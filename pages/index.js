import React from "react";
import Home from "../components/Home";
import { initializeApollo } from "../lib/apollo-client";
import APP_QUERY from "../queries/app.graphql";
import PRODUCTS_QUERY from "../queries/products.graphql";

const HomePage = () => {
  return <Home />;
};

export const getStaticProps = async () => {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: APP_QUERY,
  });

  await apolloClient.query({
    query: PRODUCTS_QUERY,
    variables: { search: "" },
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
    revalidate: 1,
  };
};

export default HomePage;
