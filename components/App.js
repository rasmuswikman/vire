import React from "react";
import { useQuery } from "@apollo/client";
import APP_QUERY from "../queries/app.graphql";
import Head from "next/head";
import Box from "@mui/material/Box";
import Nav from "./Nav";
import NextNProgress from "nextjs-progressbar";

export default function App({ children }) {
  const { data } = useQuery(APP_QUERY);
  const store = data?.storeConfig;
  const categoryUrlSuffix = store?.category_url_suffix ?? "";
  const categories = data?.categoryList[0].children;

  return (
    <>
      <Head>
        <title>Vire{/*store?.default_title*/}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="description" content="Vire Storefront" />
        <link rel="apple-touch-icon" href="/logo192.png" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <NextNProgress color="#333" height={1} />
      <Nav categories={categories} categoryUrlSuffix={categoryUrlSuffix} />
      <Box
        sx={{
          maxWidth: "1200px",
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: {
            xs: "150px",
            sm: "100px",
          },
          padding: {
            xs: "30px 20px 100px 20px",
            sm: "30px 25px 100px 25px",
            md: "30px 30px 100px 30px",
            lg: "30px 40px 100px 40px",
          },
        }}
      >
        {children}
      </Box>
    </>
  );
}
