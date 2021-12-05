import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Products from "./Products";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Box
        sx={{
          background: "rgba(0, 53, 102, .03)",
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
          <Box sx={{ p: 1 }}>
            <Typography
              gutterBottom
              variant="h3"
              component="h4"
              sx={{ pr: 5, pt: 15 }}
            >
              <Image src="/logo.svg" alt="MUI" width={303} height={81} />
            </Typography>
            <Typography variant="h4" color="#023047" sx={{ fontWeight: 300 }}>
              Progressive commerce.
            </Typography>
          </Box>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={8}
            sx={{ p: 6, pb: 15 }}
          >
            <Grid item xs={4}>
              <Link href="https://www.mui.com/">
                <a>
                  <Typography gutterBottom variant="h5" component="h4">
                    <Image
                      src="/logos/mui.svg"
                      alt="MUI"
                      width={51}
                      height={44}
                    />
                  </Typography>
                </a>
              </Link>
              <Typography variant="body2">
                MUI provides a robust, customizable, and accessible library of
                foundational and advanced components, enabling you to build your
                own design system and develop React applications faster.
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Link href="https://nextjs.org/">
                <a>
                  <Typography gutterBottom variant="h5" component="h4">
                    <Image
                      src="/logos/next.svg"
                      alt="Next"
                      width={77}
                      height={46}
                    />
                  </Typography>
                </a>
              </Link>
              <Typography variant="body2">
                Next.js gives you the best developer experience with all the
                features you need for production: hybrid static & server
                rendering, TypeScript support, smart bundling, route
                pre-fetching, and more. No config needed.
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Link href="https://magento.com/">
                <a>
                  <Typography gutterBottom variant="h5" component="h4">
                    <Image
                      src="/logos/adobexpcloud.svg"
                      alt="Next"
                      width={46}
                      height={45}
                    />
                  </Typography>
                </a>
              </Link>
              <Typography variant="body2">
                Create engaging, shoppable experiences with Adobe Commerce. See
                how our next-generation technology, global partner ecosystem,
                and extensions marketplace can breathe life into your business.
              </Typography>
            </Grid>
          </Grid>
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
