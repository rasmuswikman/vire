import React, { useContext } from 'react';
import {
  RouteDocument,
  RouteQuery,
  RouteQueryVariables,
} from '../../../generated/generated-types';
import { useQuery } from 'urql';
import Head from 'next/head';
import Image from 'next/image';
import Price from '../Price';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { StoreConfigContext } from '../../lib/StoreConfigContext';
import useAddToCart from '../../lib/useAddToCart';
import Loading from '../Loading';

type Props = {
  url: string;
};

export default function Product(props: Props) {
  const { url } = props;
  const { storeConfig } = useContext(StoreConfigContext);
  const [result] = useQuery<RouteQuery, RouteQueryVariables>({
    query: RouteDocument,
    variables: { url },
  });
  const { data, fetching } = result;
  const [loadingCart, setLoadingCart] = React.useState(false);
  const { addToCart } = useAddToCart();
  const handleAddToCart = async () => {
    if (product) {
      setLoadingCart(true);
      await addToCart(product?.sku);
      setLoadingCart(false);
    }
  };

  if (fetching && !data) return <Loading />;

  // TODO: data.route can be typenames CategoryTree and CmsPage
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const product: any = data?.route;
  //const product = data?.route;

  return product ? (
    <Box sx={{ pt: 2 }}>
      <Head>
        <title>
          {product.name} - {storeConfig.default_title}
        </title>
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
            <Box sx={{ position: 'relative' }}>
              <Box sx={{ p: 5 }}>
                <Image
                  src={product.media_gallery[0].url}
                  width={500}
                  height={620}
                  alt={product.media_gallery[0].label}
                />
              </Box>
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                  background: '#000',
                  opacity: 0.02,
                }}
              ></Box>
            </Box>
          )}
        </Grid>
        <Grid item xs={12} md={7}>
          <Box sx={{ pl: 10 }}>
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
                  Add to Basket
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
          </Box>
        </Grid>
      </Grid>
    </Box>
  ) : (
    <Box>Not found.</Box>
  );
}
