import React from "react";
import { useQuery } from "@apollo/client";
import CATEGORY_QUERY from "../queries/category.graphql";
import Products from "./Products";
import Link from "next/link";
import Head from "next/head";

export default function Category({ filters }) {
  const { loading, data, error } = useQuery(CATEGORY_QUERY, {
    variables: { filters },
  });

  if (error) {
    console.error(error);
    return <div>There was an error.</div>;
  }

  if (loading && !data) return <div>Loading...</div>;

  const category = data.categoryList[0];

  const categoryUrlSuffix = data.storeConfig.category_url_suffix ?? "";

  const backUrl =
    category.breadcrumbs &&
    category.breadcrumbs[0]?.category_url_path + categoryUrlSuffix;

  return (
    <>
      <Head>
        <title>{category.name}</title>
      </Head>
        <header>
          {backUrl && (
            <Link key={backUrl} href={`/${backUrl}`}>
              <a>⬅</a>
            </Link>
          )}

          <h2>{category.name}</h2>
        </header>
        {category.children?.length > 0 && (
          <nav>
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
          </nav>
        )}
        <Products filters={{ category_id: { eq: category.id } }} />
    </>
  );
};
