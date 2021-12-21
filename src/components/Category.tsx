import React from 'react';
import { useRouteQuery, useProductsQuery } from '../../generated/generated-types';
import { initializeApollo } from '../lib/apolloClient';
import type { NormalizedCacheObject } from '@apollo/client';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import NextLink from 'next/link';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import useAddToCart from '../lib/useAddToCart';
import Loading from './Loading';
import Price from './Price';

type Props = {
  type: string;
  url: string;
  page: number;
  uid: string;
  initialApolloState: NormalizedCacheObject | undefined;
};

export default function Category(props: Props) {
  const { url, page, uid, initialApolloState } = props;
  const apolloClient = initializeApollo({ initialState: initialApolloState });
  const { loading, data } = useRouteQuery({
    variables: { url },
    client: apolloClient,
  });
  const { data: dataProducts, loading: loadingProducts } = useProductsQuery({
    variables: {
      filters: { category_uid: { eq: uid } },
      page: page ?? 1,
    },
    client: apolloClient,
  });
  const router = useRouter();
  const { addToCart } = useAddToCart();
  const handleAddToCart = async (sku: string) => {
    setLoadingCart(true);
    await addToCart(sku);
    setLoadingCart(false);
  };
  const [loadingCart, setLoadingCart] = React.useState(false);
  const category = data?.route?.__typename === 'CategoryTree' ? data?.route : null;
  const categoryUrlSuffix = data?.storeConfig?.category_url_suffix ?? '';
  const productUrlSuffix = data?.storeConfig?.product_url_suffix ?? '';

  const handlePagination = (event: React.ChangeEvent<unknown>, value: number) => {
    if (category) {
      router.push({
        pathname: `/${category.url_path + categoryUrlSuffix}`,
        query: { page: value },
      });
    }
  };

  if (loading || !data || loadingProducts || !dataProducts) return <Loading />;

  return category ? (
    <>
      <Head>
        <title>{category.name}</title>
      </Head>
      <Breadcrumbs aria-label="breadcrumb">
        <NextLink href="/" passHref>
          <Link>Home</Link>
        </NextLink>
        {category.breadcrumbs &&
          category.breadcrumbs.map(
            (breadcrumb) =>
              breadcrumb && (
                <NextLink
                  href={`/${breadcrumb.category_url_path + categoryUrlSuffix}`}
                  key={breadcrumb.id}
                  passHref
                >
                  <Link>{breadcrumb.category_name}</Link>
                </NextLink>
              ),
          )}
        <Typography color="text.primary">{category.name}</Typography>
      </Breadcrumbs>
      <Typography variant="h4" sx={{ my: 5 }}>
        {category.name}
      </Typography>
      <Grid
        container
        spacing={5}
        direction="row"
        justifyContent="center"
        alignItems="flex-start"
      >
        <Grid item xs={12} md={3}>
          {category.children && (
            <Box sx={{ mb: 2 }}>
              {category.children?.length > 0 &&
                category.children.map(
                  (category) =>
                    category && (
                      <Typography key={category.id}>
                        <NextLink
                          href={{
                            pathname: `/${category.url_path + categoryUrlSuffix}`,
                            query: {
                              type: 'CATEGORY',
                            },
                          }}
                          as={`/${category.url_path + categoryUrlSuffix}`}
                          passHref
                        >
                          <Link>{category.name}</Link>
                        </NextLink>
                      </Typography>
                    ),
                )}
            </Box>
          )}
          {dataProducts?.products?.aggregations && (
            <Box sx={{ mb: 2 }}>
              {dataProducts.products.aggregations.map(
                (aggregation) =>
                  aggregation && (
                    <Typography key={aggregation.attribute_code}>
                      <NextLink
                        href={{
                          pathname: `/${category.url_path + categoryUrlSuffix}`,
                          query: {
                            type: 'CATEGORY',
                          },
                        }}
                        as={`/${category.url_path + categoryUrlSuffix}`}
                        passHref
                      >
                        <Link>{aggregation.label}</Link>
                      </NextLink>
                    </Typography>
                  ),
              )}
            </Box>
          )}
        </Grid>
        <Grid item xs={12} md={9}>
          {dataProducts?.products?.items &&
          dataProducts?.products?.items.length > 0 ? (
            <>
              <Box
                sx={{
                  display: 'grid',
                  gap: {
                    xs: 1,
                    sm: 2,
                    md: 3,
                    lg: 2,
                  },
                  gridTemplateColumns: {
                    xs: 'repeat(2, 1fr)',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                    lg: 'repeat(3, 1fr)',
                  },
                }}
              >
                {dataProducts.products.items.map(
                  (product) =>
                    product && (
                      <Card key={product.id} variant="outlined" sx={{ pb: 2 }}>
                        {product.thumbnail?.url && (
                          <NextLink
                            href={{
                              pathname: `/${product.url_key + productUrlSuffix}`,
                              query: {
                                type: 'PRODUCT',
                              },
                            }}
                            as={`/${product.url_key + productUrlSuffix}`}
                            passHref={true}
                          >
                            <CardActionArea>
                              <CardMedia sx={{ p: 3, pb: 1 }}>
                                <div
                                  style={{
                                    position: 'relative',
                                    width: '100%',
                                    height: '100%',
                                  }}
                                >
                                  <Image
                                    src={product.thumbnail.url}
                                    alt={product.thumbnail.label ?? 'Product image'}
                                    width={320}
                                    height={397}
                                  />
                                </div>
                              </CardMedia>
                            </CardActionArea>
                          </NextLink>
                        )}
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="h4">
                            <div
                              dangerouslySetInnerHTML={{
                                __html: product.name ?? '',
                              }}
                            />
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <Price price={product.price_range} />
                          </Typography>
                          {product.sku && product.__typename === 'SimpleProduct' && (
                            <Box sx={{ mt: 3 }}>
                              <LoadingButton
                                onClick={() => handleAddToCart(product.sku ?? '')}
                                size="small"
                                variant="contained"
                                disableElevation
                                loading={loadingCart}
                              >
                                Add to Cart
                              </LoadingButton>
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    ),
                )}
              </Box>
              {dataProducts?.products?.page_info?.total_pages &&
                dataProducts?.products?.page_info?.total_pages > 0 && (
                  <Box
                    sx={{
                      display: 'flex',
                      flexGrow: 1,
                      justifyContent: 'center',
                      mt: 2,
                    }}
                  >
                    <Pagination
                      count={dataProducts.products.page_info.total_pages ?? 0}
                      page={dataProducts.products.page_info.current_page ?? 0}
                      onChange={handlePagination}
                    />
                  </Box>
                )}
            </>
          ) : (
            <Box>No products.</Box>
          )}
        </Grid>
      </Grid>
    </>
  ) : (
    <Box>Not found.</Box>
  );
}
