import { ApolloProvider } from "@apollo/client";
import { useApollo } from "../lib/apollo-client";
import App from "../components/App";
import Head from "next/head";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider } from "@emotion/react";
import theme from "../lib/theme";
import createEmotionCache from "../lib/createEmotionCache";
import { MainDataProvider } from "../lib/main-data";

const clientSideEmotionCache = createEmotionCache();

export default function NextApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <MainDataProvider>
      <ApolloProvider client={apolloClient}>
        <CacheProvider value={emotionCache}>
          <Head>
            <meta
              name="viewport"
              content="initial-scale=1, width=device-width"
            />
          </Head>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <App>
              <Component {...pageProps} />
            </App>
          </ThemeProvider>
        </CacheProvider>
      </ApolloProvider>
    </MainDataProvider>
  );
}
