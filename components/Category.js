import React from "react";
import { useQuery } from "@apollo/client";
import routeQuery from "../queries/route.graphql";
import NextLink from "next/link";
import Head from "next/head";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import Loading from "../components/Loading";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@mui/material/CardActionArea";
import useAddToCart from "../lib/useAddToCart";
import LoadingButton from "@mui/lab/LoadingButton";
import Price from "./Price";
import Image from "next/image";
import productsQuery from "../queries/products.graphql";
import Grid from "@mui/material/Grid";

export default function Category({ url, page, uid }) {
  const { loading, data } = useQuery(routeQuery, {
    variables: { url },
  });
  const { data: dataProducts, loading: loadingProducts } = useQuery(
    productsQuery,
    {
      variables: {
        filters: { category_uid: { eq: uid } },
        page: page ?? 1,
      },
    }
  );

  const router = useRouter();

  const { addToCart } = useAddToCart();
  const handleAddToCart = async (sku) => {
    setLoadingCart(true);
    await addToCart(sku);
    setLoadingCart(false);
  };

  const [loadingCart, setLoadingCart] = React.useState(false);

  const category = data.route;
  const categoryUrlSuffix = data.storeConfig.category_url_suffix ?? "";
  const productUrlSuffix = data.storeConfig.product_url_suffix ?? "";

  const handleChange = (event, value) => {
    router.push({
      pathname: `/${category.url_path + categoryUrlSuffix}`,
      query: { page: value },
    });
  };

  if ((loading && !data) || (loadingProducts && !dataProducts))
    return <Loading />;

  return (
    <>
      <Head>
        <title>{category.name}</title>
      </Head>
      <Breadcrumbs aria-label="breadcrumb">
        <NextLink href="/" passHref>
          <Link>Home</Link>
        </NextLink>
        {category.breadcrumbs?.length > 0 &&
          category.breadcrumbs.map((breadcrumb, index) => (
            <NextLink
              href={`/${breadcrumb.category_url_path + categoryUrlSuffix}`}
              key={index}
              passHref
            >
              <Link>{breadcrumb.category_name}</Link>
            </NextLink>
          ))}
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
          <Box sx={{ mb: 2 }}>
            {category.children?.length > 0 &&
              category.children.map((category) => (
                <Typography key={category.uid}>
                  <NextLink
                    href={{
                      pathname: `/${category.url_path + categoryUrlSuffix}`,
                      query: {
                        type: "CATEGORY",
                      },
                    }}
                    as={`/${category.url_path + categoryUrlSuffix}`}
                    passHref
                  >
                    <Link>{category.name}</Link>
                  </NextLink>
                </Typography>
              ))}
          </Box>
          <Box sx={{ mb: 2 }}>
            {dataProducts.products.aggregations &&
              dataProducts.products.aggregations.map((aggregation, index) => (
                <Typography key={index}>
                  <NextLink
                    href={{
                      pathname: `/${category.url_path + categoryUrlSuffix}`,
                      query: {
                        type: "CATEGORY",
                      },
                    }}
                    as={`/${category.url_path + categoryUrlSuffix}`}
                    passHref
                  >
                    <Link>{aggregation.attribute_code}</Link>
                  </NextLink>
                </Typography>
              ))}
          </Box>
        </Grid>
        <Grid item xs={12} md={9}>
          {dataProducts.products?.items?.length > 0 && (
            <Box
              sx={{
                display: "grid",
                gap: {
                  xs: 1,
                  sm: 2,
                  md: 3,
                  lg: 2,
                },
                gridTemplateColumns: {
                  xs: "repeat(2, 1fr)",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                  lg: "repeat(3, 1fr)",
                },
              }}
            >
              {dataProducts.products.items.map((product) => (
                <Card key={product.id} variant="outlined" sx={{ pb: 2 }}>
                  <NextLink
                    href={{
                      pathname: `/${product.url_key + productUrlSuffix}`,
                      query: {
                        type: "PRODUCT",
                      },
                    }}
                    as={`/${product.url_key + productUrlSuffix}`}
                    passHref={true}
                  >
                    <CardActionArea>
                      <CardMedia sx={{ p: 3, pb: 1 }}>
                        <div
                          style={{
                            position: "relative",
                            width: "100%",
                            height: "100%",
                          }}
                        >
                          <Image
                            src={product.thumbnail.url}
                            alt={product.thumbnail.label}
                            width={320}
                            height={397}
                          />
                        </div>
                      </CardMedia>
                    </CardActionArea>
                  </NextLink>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h4">
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <Price {...product.price_range} />
                    </Typography>
                    <Box sx={{ mt: 3 }}>
                      <LoadingButton
                        onClick={() => handleAddToCart(product.sku)}
                        size="small"
                        variant="contained"
                        disableElevation
                        loading={loadingCart}
                      >
                        Add to Cart
                      </LoadingButton>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
          <Box
            sx={{
              display: "flex",
              flexGrow: 1,
              justifyContent: "center",
              mt: 2,
            }}
          >
            {dataProducts.products.page_info.total_pages > 0 && (
              <Pagination
                count={dataProducts.products.page_info.total_pages}
                page={dataProducts.products.page_info.current_page}
                onChange={handleChange}
              />
            )}
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
