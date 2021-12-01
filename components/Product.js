import React from "react";
import { useQuery } from "@apollo/client";
import PRODUCT_QUERY from "../queries/product.graphql";
import Price from "./Price";
import Head from "next/head";
import Image from "next/image";

export default function Product({ filters }) {
  const { loading, data } = useQuery(PRODUCT_QUERY, { variables: { filters } });

  const product = data?.products.items[0];

  if (loading && !data) return <div>Loading...</div>;

  return (
    <>
      <Head>
        <title>{product.name}</title>
      </Head>
      <Image
        src={product.media_gallery[0].url}
        width={500}
        height={620}
        alt={product.media_gallery[0].label}
      />
      <h2>{product.name}</h2>
      <Price {...product.price_range} />
      {product.description?.html && (
        <div dangerouslySetInnerHTML={{ __html: product.description.html }} />
      )}
    </>
  );
};
