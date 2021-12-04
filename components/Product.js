import React from "react";
import { useQuery, useApolloClient } from "@apollo/client";
import productQuery from "../queries/product.graphql";
import createEmptyCartMutation from "../queries/createEmptyCart.graphql";
import addProductsToCartMutation from "../queries/addProductsToCart.graphql";
import Price from "./Price";
import Head from "next/head";
import Image from "next/image";
import LoadingButton from "@mui/lab/LoadingButton";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
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
      <Grid container spacing={2}>
        <Grid item xs={12} md={5}>
          <Image
            src={product.media_gallery[0].url}
            width={500}
            height={620}
            alt={product.media_gallery[0].label}
          />
        </Grid>
        <Grid item xs={12} md={7}>
          <h2>{product.name}</h2>
          <Price {...product.price_range} />
          {product.__typename === "SimpleProduct" && (
            <Box sx={{ my: 3 }}>
              <LoadingButton
                color="success"
                onClick={addToCart}
                size="large"
                variant="contained"
                disableElevation
                loading={loadingCart}
                endIcon={<KeyboardArrowRightIcon />}
                loadingPosition="end"
              >
                Add to Cart
              </LoadingButton>
            </Box>
          )}
          <div>
            {product.sku} - {product.__typename}
          </div>
          {product.description?.html && (
            <div
              dangerouslySetInnerHTML={{ __html: product.description.html }}
            />
          )}
        </Grid>
      </Grid>
    </>
  );
}
