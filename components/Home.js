import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Products from "./Products";
import Image from "next/image";
import NextLink from "next/link";

export default function Home() {
  return (
    <>
      <Box
        sx={{
          background: "#fafafa",
          textAlign: "center",
          display: {
            xs: "none",
            md: "block",
          },
        }}
      >
        <Box
          sx={{
            maxWidth: "1200px",
            marginTop: {
              xs: "150px",
              sm: "100px",
            },
            marginLeft: "auto",
            marginRight: "auto",
            marginBottom: 4,
          }}
        >
          <Box sx={{ pb: 9, pt: 12, maxWidth: "700px", margin: "0 auto" }}>
            <Typography gutterBottom variant="h3" component="h4" sx={{ pr: 3 }}>
              <Image src="/logo.svg" alt="MUI" width={210} height={65} />
            </Typography>
            <Typography sx={{ fontSize: "1.3rem" }}>
              Vire is a storefront built with{" "}
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
            <Typography
              sx={{
                fontSize: "1.0rem",
                mt: 4,
                opacity: 0.5,
              }}
            >
              Prerelease v0.0.1
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          background: "#fff",
          maxWidth: "1200px",
          marginLeft: "auto",
          marginRight: "auto",
          padding: {
            xs: "190px 20px 100px 20px",
            sm: "140px 25px 100px 25px",
            md: "30px 30px 100px 30px",
            lg: "30px 40px 100px 40px",
          },
        }}
      >
        <Products search="watch" pageSize={4} />
      </Box>
    </>
  );
}
