import React from "react";
import { useQuery } from "@apollo/client";
import routeQuery from "../queries/route.graphql";
import Price from "./Price";
import Head from "next/head";
import Image from "next/image";
import LoadingButton from "@mui/lab/LoadingButton";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import useAddToCart from "../lib/useAddToCart";
import Loading from "../components/Loading";
import Typography from "@mui/material/Typography";

export default function Product({ url }) {
  const { loading, data } = useQuery(routeQuery, { variables: { url } });
  const product = data?.route;
  const [loadingCart, setLoadingCart] = React.useState(false);

  const { addToCart } = useAddToCart();
  const handleAddToCart = async () => {
    setLoadingCart(true);
    await addToCart(product.sku);
    setLoadingCart(false);
  };

  if (loading && !data) return <Loading />;

  return (
    <>
      <Head>
        <title>{product.name}</title>
      </Head>
      <Grid
        container
        spacing={0}
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={12} md={5}>
          <Image
            src={product.media_gallery[0].url}
            width={500}
            height={620}
            alt={product.media_gallery[0].label}
          />
        </Grid>
        <Grid item xs={12} md={7}>
          <Typography gutterBottom variant="h4">
            {product.name}
          </Typography>
          <Typography variant="h5">
            <Price {...product.price_range} />
          </Typography>
          {product.__typename === "SimpleProduct" && (
            <Box sx={{ my: 3 }}>
              <LoadingButton
                onClick={handleAddToCart}
                size="large"
                variant="contained"
                disableElevation
                loading={loadingCart}
              >
                Add to Cart
              </LoadingButton>
            </Box>
          )}
          {product.description?.html && (
            <Typography variant="body1" component="div">
              <div
                dangerouslySetInnerHTML={{ __html: product.description.html }}
              />
            </Typography>
          )}
        </Grid>
      </Grid>
    </>
  );
}
