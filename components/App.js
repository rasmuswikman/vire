import React from "react";
import { useQuery } from "@apollo/client";
import APP_QUERY from "../queries/app.graphql";
import Head from "next/head";
import Box from "@mui/material/Box";
import Nav from "./Nav";
import NextNProgress from "nextjs-progressbar";
import GlobalStyles from "@mui/material/GlobalStyles";
import Link from "next/link";

export default function App({ children }) {
  const { data } = useQuery(APP_QUERY);
  const store = data?.storeConfig;
  const categoryUrlSuffix = store?.category_url_suffix ?? "";
  const categories = data?.categoryList[0].children;

  return (
    <>
      <GlobalStyles
        styles={(theme) => ({
          body: { backgroundColor: "#fafafa" },
        })}
      />
      <Head>
        <title>Vire{/*store?.default_title*/}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="description" content="Vire Storefront" />
        <link rel="apple-touch-icon" href="/logo192.png" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <NextNProgress color="#003566" height={1} />
      <Nav categories={categories} categoryUrlSuffix={categoryUrlSuffix} />
      <Box sx={{ background: "#fff", minHeight: "50vh" }}>{children}</Box>
      <Box
        sx={{
          background: "#fafafa",
          textAlign: "center",
          pt: 6,
          pb: 15,
          fontSize: "0.9rem",
        }}
      >
        Vire sai aikaan väreitä veden pintaan. –{" "}
        <Link href="https://fi.wiktionary.org/wiki/vire">
          <a>Wiktionary</a>
        </Link>
      </Box>
    </>
  );
}
