import React from "react";
import Error from "next/error";
import { gql } from "@apollo/client";
import { initializeApollo } from "../lib/apollo-client";
import APP_QUERY from "../queries/app.graphql";
import PRODUCTS_QUERY from "../queries/products.graphql";
import CATEGORY_QUERY from "../queries/category.graphql";
import PRODUCT_QUERY from "../queries/product.graphql";
import Category from "../components/Category";
import Product from "../components/Product";
import Box from "@mui/material/Box";

const renderSwitch = (type, urlKey) => {
  switch (type) {
    case "CMS_PAGE":
      return <div>CMS is not implemented in this sample.</div>;
    case "CATEGORY":
      return <Category filters={{ url_key: { eq: urlKey } }} />;
    case "PRODUCT":
      return <Product filters={{ url_key: { eq: urlKey } }} />;
    case "404":
      return <Error statusCode={404} />;
    default:
      return <Error statusCode={500} />;
  }
};

const URLResolver = ({ type, urlKey }) => {
  return (
    <Box
      sx={{
        background: "#fff",
        maxWidth: "1200px",
        marginLeft: "auto",
        marginRight: "auto",
        padding: {
          xs: "130px 20px 100px 20px",
          sm: "130px 25px 100px 25px",
          md: "130px 30px 100px 30px",
          lg: "130px 40px 100px 40px",
        },
      }}
    >
      {renderSwitch(type, urlKey)}
    </Box>
  );
};

export default URLResolver;

export async function getServerSideProps({ req, res, query, resolvedUrl }) {
  res?.setHeader("cache-control", "s-maxage=1, stale-while-revalidate");

  const apolloClient = initializeApollo();
  const pathname = resolvedUrl.replace("/", "");
  const urlKey = pathname.split(".")?.shift().split("/")?.pop();

  // If a type has been provided then return the props and render the Component
  if (query.type) {
    return { props: { type: query.type, urlKey } };
  }

  const { data } = await apolloClient.query({
    query: gql`
      query UrlResolver($url: String!) {
        urlResolver(url: $url) {
          id
          type
        }
      }
    `,
    variables: {
      url: pathname,
    },
  });

  if (!data?.urlResolver) {
    if (res) res.statusCode = 404;
    return { props: { type: "404", pathname } };
  }

  const { type, id } = data.urlResolver;

  if (req) {
    await apolloClient.query({ query: APP_QUERY });

    switch (type) {
      case "CMS_PAGE":
        // Not implemented...
        break;
      case "CATEGORY":
        await apolloClient.query({
          query: CATEGORY_QUERY,
          variables: { filters: { url_key: { eq: urlKey } } },
        });

        await apolloClient.query({
          query: PRODUCTS_QUERY,
          variables: { filters: { category_id: { eq: id } } },
        });
        break;
      case "PRODUCT":
        await apolloClient.query({
          query: PRODUCT_QUERY,
          variables: { filters: { url_key: { eq: urlKey } } },
        });
        break;
      default:
        break;
    }
  }

  return {
    props: {
      type,
      urlKey,
      initialApolloState: apolloClient.cache.extract(),
    },
  };
}
