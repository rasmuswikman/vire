import React, { useContext } from 'react';
import {
  CategoryDocument,
  CategoryQuery,
  CategoryQueryVariables,
  CategoryTreeFragment,
  ProductsDocument,
  ProductsQuery,
  ProductsQueryVariables,
} from '../../../generated/generated-types';
import { useQuery } from 'urql';
import { useRouter } from 'next/router';
import Head from 'next/head';
import NextLink from 'next/link';
import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import { StoreConfigContext } from '../../lib/StoreConfigContext';
import Loading from '../Loading';
const ProductCard = dynamic(() => import('./ProductCard'));

type Props = {
  type: string;
  page: number;
  id: string;
};

export default function Category(props: Props) {
  const { page, id } = props;
  const { storeConfig } = useContext(StoreConfigContext);
  const [result] = useQuery<CategoryQuery, CategoryQueryVariables>({
    query: CategoryDocument,
    variables: { filters: { category_uid: { eq: id } } },
  });
  const { data, fetching } = result;

  const [resultProducts] = useQuery<ProductsQuery, ProductsQueryVariables>({
    query: ProductsDocument,
    variables: {
      filters: { category_uid: { eq: id } },
      page: page ?? 1,
    },
  });
  const { data: dataProducts, fetching: fetchingProducts } = resultProducts;

  const router = useRouter();
  const category: CategoryTreeFragment | null =
    data?.categoryList && data?.categoryList[0] ? data?.categoryList[0] : null;
  const categoryUrlSuffix = storeConfig.category_url_suffix ?? '';
  const productUrlSuffix = storeConfig.product_url_suffix ?? '';

  const handlePagination = (event: React.ChangeEvent<unknown>, value: number) => {
    if (category) {
      router.push(
        {
          pathname: `/${category.url_path + categoryUrlSuffix}`,
          query: { page: value, type: 'CATEGORY', id: category.id },
        },
        `/${category.url_path + categoryUrlSuffix}?page=${value}`,
      );
    }
  };

  if (fetching || !data || fetchingProducts || !dataProducts) return <Loading />;

  return category ? (
    <>
      <Head>
        <title>
          {category.name} - {storeConfig.default_title}
        </title>
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
                              id: category.id,
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
                            id: category.id,
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
                      <ProductCard
                        key={product.id}
                        product={product}
                        productUrlSuffix={productUrlSuffix}
                      />
                    ),
                )}
              </Box>
              {dataProducts?.products?.page_info?.total_pages &&
                dataProducts?.products?.page_info?.total_pages > 1 && (
                  <Box
                    sx={{
                      display: 'flex',
                      flexGrow: 1,
                      justifyContent: 'center',
                      mt: 5,
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
