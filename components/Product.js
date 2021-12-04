import React from "react";
import { useQuery } from "@apollo/client";
import productQuery from "../queries/product.graphql";
import Price from "./Price";
import Head from "next/head";
import Image from "next/image";
import LoadingButton from "@mui/lab/LoadingButton";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import useAddToCart from "../lib/useAddToCart";

export default function Product({ filters }) {
  const { loading, data } = useQuery(productQuery, { variables: { filters } });
  const product = data?.products.items[0];
  const [loadingCart, setLoadingCart] = React.useState(false);

  const { addToCart } = useAddToCart();
  const handleAddToCart = async () => {
    setLoadingCart(true);
    await addToCart(product.sku);
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
                onClick={handleAddToCart}
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
