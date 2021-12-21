import React from 'react';
import { useRouteQuery } from '../../generated/generated-types';
import { initializeApollo } from '../lib/apolloClient';
import type { NormalizedCacheObject } from '@apollo/client';
import Head from 'next/head';
import Image from 'next/image';
import Price from './Price';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import useAddToCart from '../lib/useAddToCart';
import Loading from '../components/Loading';

type Props = {
  type: string;
  url: string;
  page: number;
  uid: string;
  initialApolloState: NormalizedCacheObject | undefined;
};

export default function Product(props: Props) {
  const { url, initialApolloState } = props;
  const apolloClient = initializeApollo({ initialState: initialApolloState });
  const { loading, data } = useRouteQuery({
    variables: { url },
    client: apolloClient,
  });
  const [loadingCart, setLoadingCart] = React.useState(false);
  const { addToCart } = useAddToCart();
  const handleAddToCart = async () => {
    if (product) {
      setLoadingCart(true);
      await addToCart(product?.sku);
      setLoadingCart(false);
    }
  };

  if (loading && !data) return <Loading />;

  // TODO: data.route can be typenames BundleProduct (etc), CategoryTree and CmsPage
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const product: any = data?.route;
  //const product = data?.route;

  return product ? (
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
          {product.media_gallery && (
            <Image
              src={product.media_gallery[0].url}
              width={500}
              height={620}
              alt={product.media_gallery[0].label}
            />
          )}
        </Grid>
        <Grid item xs={12} md={7}>
          <Typography gutterBottom variant="h4">
            <div
              dangerouslySetInnerHTML={{
                __html: product.name ?? '',
              }}
            />
          </Typography>
          <Typography variant="h5">
            <Price price={product.price_range} />
          </Typography>
          {product.__typename === 'SimpleProduct' && (
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
              <div dangerouslySetInnerHTML={{ __html: product.description.html }} />
            </Typography>
          )}
        </Grid>
      </Grid>
    </>
  ) : (
    <Box>Not found.</Box>
  );
}
