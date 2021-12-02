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

export default function Products({ search, filters }) {
  const { loading, data, fetchMore } = useQuery(PRODUCTS_QUERY, {
    variables: { search, filters },
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

  if (loading && !data) return <div>Loading...</div>;

  if (products.length === 0) return <div>No products found.</div>;

  return (
    <>
      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          },
        }}
      >
        {products.map((product) => (
          <Card key={product.id}>
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
                <CardMedia>
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
                      width={520}
                      height={640}
                    />
                  </div>
                </CardMedia>
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <Price {...product.price_range} />
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Link>
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
