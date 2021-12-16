import React from "react";
import Error from "next/error";
import { initializeApollo } from "../lib/apollo-client";
import routeQuery from "../queries/route.graphql";
import appQuery from "../queries/app.graphql";
import productsQuery from "../queries/products.graphql";
import Category from "../components/Category";
import Product from "../components/Product";
import Box from "@mui/material/Box";

const renderSwitch = (type, url, page, uid) => {
  switch (type) {
    case "CMS_PAGE":
      return <div>CMS is not implemented in this sample.</div>;
    case "CATEGORY":
      return <Category url={url} page={page} uid={uid} />;
    case "PRODUCT":
      return <Product url={url} />;
    case "404":
      return <Error statusCode={404} />;
    default:
      return <Error statusCode={500} />;
  }
};

const URLResolver = ({ type, url, page, uid }) => {
  return (
    <Box sx={{ maxWidth: "lg", mx: "auto", py: 2 }}>
      {renderSwitch(type, url, page, uid)}
    </Box>
  );
};

export default URLResolver;

export async function getServerSideProps({ req, res, query, resolvedUrl }) {
  res?.setHeader("cache-control", "s-maxage=1, stale-while-revalidate");

  const apolloClient = initializeApollo();
  const url = resolvedUrl.replace("/", "");

  //if (query.type) {
  //  return { props: { type: query.type, url } };
  //}

  const page = query.page ?? 1;

  const { data } = await apolloClient.query({
    query: routeQuery,
    variables: { url },
  });

  if (!data?.route) {
    if (res) res.statusCode = 404;
    return { props: { type: "404" } };
  }

  if (req) {
    await apolloClient.query({ query: appQuery });

    if (data.route.type === "CATEGORY") {
      await apolloClient.query({
        query: productsQuery,
        variables: { filters: { category_uid: { eq: data.route.id } }, page },
      });
    }
  }

  return {
    props: {
      type: data.route.type,
      url,
      page,
      uid: typeof data.route.id !== "undefined" ? data.route.id : null,
      initialApolloState: apolloClient.cache.extract(),
    },
  };
}
