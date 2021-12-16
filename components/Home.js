import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Products from "./Products";
import Image from "next/image";
import NextLink from "next/link";

export default function Home() {
  return (
    <>
      <Box
        sx={{
          bgcolor: "primary.ultralight",
          textAlign: "center",
          display: {
            xs: "none",
            md: "block",
          },
        }}
      >
        <Box sx={{ pb: 15, pt: 9, maxWidth: "950px", mx: "auto" }}>
          <Typography gutterBottom variant="h3" component="h4" sx={{ pr: 3 }}>
            <Image src="/logo.svg" alt="MUI" width={210} height={65} />
          </Typography>
          <Typography sx={{ fontSize: "1.6rem" }}>
            Vire is a concept storefront built with{" "}
            <NextLink href="https://www.mui.com/" passHref>
              <Link>MUI</Link>
            </NextLink>{" "}
            and{" "}
            <NextLink href="https://nextjs.org/" passHref>
              <Link>Next.js</Link>
            </NextLink>{" "}
            – without middlewares or custom tooling – on the{" "}
            <NextLink href="https://magento.com/" passHref>
              <Link>Adobe Commerce</Link>
            </NextLink>{" "}
            GraphQL API.
          </Typography>
        </Box>
      </Box>
      <Box sx={{ maxWidth: "lg", mx: "auto", py: 5 }}>
        <Products search="watch" pageSize={4} />
      </Box>
    </>
  );
}
