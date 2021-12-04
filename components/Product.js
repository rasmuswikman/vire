import React from "react";
import { useQuery, useApolloClient } from "@apollo/client";
import productQuery from "../queries/product.graphql";
import createEmptyCartMutation from "../queries/createEmptyCart.graphql";
import addProductsToCartMutation from "../queries/addProductsToCart.graphql";
import Price from "./Price";
import Head from "next/head";
import Image from "next/image";
import Button from "@mui/material/Button";
import { useMainData } from "../lib/main-data";

export default function Product({ filters }) {
  const { mainData, setMainData } = useMainData();
  const client = useApolloClient();
  const { loading, data } = useQuery(productQuery, { variables: { filters } });
  const product = data?.products.items[0];
  const [loadingCart, setLoadingCart] = React.useState(false);

  const addToCart = async () => {
    setLoadingCart(true);
    let cartId = mainData.cartId;
    if (typeof mainData.cartId === "undefined") {
      const { data } = await client.query({
        query: createEmptyCartMutation,
        fetchPolicy: "no-cache",
      });
      cartId = data.createEmptyCart;
    }
    const { data } = await client.query({
      query: addProductsToCartMutation,
      fetchPolicy: "no-cache",
      variables: {
        cartId,
        cartItem: {
          quantity: 1,
          sku: product.sku,
        },
      },
    });
    setMainData({
      ...mainData,
      ...{ cartId, cartItems: data.addProductsToCart.cart.total_quantity },
    });
    setLoadingCart(false);
  };

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
      <div>
        {product.sku} - {product.__typename}
      </div>
      <Price {...product.price_range} />
      {product.__typename === "SimpleProduct" && (
        <Button variant="contained" onClick={addToCart} disabled={loadingCart}>
          {loadingCart ? "Adding..." : "Add to Cart"}
        </Button>
      )}
      {product.description?.html && (
        <div dangerouslySetInnerHTML={{ __html: product.description.html }} />
      )}
    </>
  );
}
