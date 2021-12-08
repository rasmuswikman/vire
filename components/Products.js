import React, { useCallback } from "react";
import Image from "next/image";
import { useQuery } from "@apollo/client";
import PRODUCTS_QUERY from "../queries/products.graphql";
import Link from "next/link";
import Price from "./Price";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import Grid from "@mui/material/Grid";
import useAddToCart from "../lib/useAddToCart";
import LoadingButton from "@mui/lab/LoadingButton";
import Loading from "../components/Loading";

export default function Products({ search, filters, pageSize }) {
  const { addToCart } = useAddToCart();
  const handleAddToCart = async (sku) => {
    setLoadingCart(true);
    await addToCart(sku);
    setLoadingCart(false);
  };
  const [loadingCart, setLoadingCart] = React.useState(false);

  const { loading, data, fetchMore } = useQuery(PRODUCTS_QUERY, {
    variables: { search, filters, pageSize },
    notifyOnNetworkStatusChange: true,
  });

  const page = data?.products?.page_info;
  const products = data?.products?.items || [];
  const productUrlSuffix = data?.storeConfig.product_url_suffix ?? "";

  const handleFetchMore = useCallback(() => {
    if (loading || !page || page.current_page === page.total_pages) return;

    fetchMore({
      variables: {
        currentPage: page.current_page + 1,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;

        return {
          ...prev,
          products: {
            ...prev.products,
            ...fetchMoreResult.products,
            items: [...prev.products.items, ...fetchMoreResult.products.items],
          },
        };
      },
    });
  }, [loading, page, fetchMore]);

  if (loading && !data) return <Loading />;

  if (products.length === 0) return <div>No products found.</div>;

  return (
    <>
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
            lg: "repeat(4, 1fr)",
          },
        }}
      >
        {products.map((product) => (
          <Card key={product.id} variant="outlined" sx={{ pb: 2 }}>
            <Link
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
            </Link>
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
      {page && page.current_page !== page.total_pages && (
        <Grid container justifyContent="center" sx={{ mt: 5 }}>
          <Button
            variant="contained"
            onClick={handleFetchMore}
            disabled={loading}
          >
            {loading ? "Loading..." : "Load More"}
          </Button>
        </Grid>
      )}
    </>
  );
}
