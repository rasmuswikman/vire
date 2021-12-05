import React from "react";
import { useQuery } from "@apollo/client";
import CATEGORY_QUERY from "../queries/category.graphql";
import Products from "./Products";
import Link from "next/link";
import Head from "next/head";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Loading from "../components/Loading";

export default function Category({ filters }) {
  const { loading, data } = useQuery(CATEGORY_QUERY, {
    variables: { filters },
  });

  if (loading && !data) return <Loading />;

  const category = data.categoryList[0];
  const categoryUrlSuffix = data.storeConfig.category_url_suffix ?? "";

  return (
    <>
      <Head>
        <title>{category.name}</title>
      </Head>
      <Breadcrumbs aria-label="breadcrumb">
        <Link href="/">
          <a>Home</a>
        </Link>
        {category.breadcrumbs?.length > 0 &&
          category.breadcrumbs.map((breadcrumb, index) => (
            <Link
              href={`/${breadcrumb.category_url_path + categoryUrlSuffix}`}
              key={index}
            >
              <a>{breadcrumb.category_name}</a>
            </Link>
          ))}
        <Typography color="text.primary">{category.name}</Typography>
      </Breadcrumbs>
      <Typography gutterBottom variant="h4" sx={{ my: 5 }}>
        {category.name}
      </Typography>
      {category.children?.length > 0 && (
        <ul>
          {category.children.map((category) => (
            <li key={category.id}>
              <Link
                href={{
                  pathname: `/${category.url_path + categoryUrlSuffix}`,
                  query: {
                    type: "CATEGORY",
                  },
                }}
                as={`/${category.url_path + categoryUrlSuffix}`}
              >
                <a>{category.name}</a>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <Products filters={{ category_id: { eq: category.id } }} />
    </>
  );
}
