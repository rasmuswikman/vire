import { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { CookiesProvider } from 'react-cookie';
import { withUrqlClient } from 'next-urql';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import createEmotionCache from '../lib/createEmotionCache';
import theme from '../lib/theme';
import { StoreConfigProvider } from '../lib/StoreConfigContext';
const Layout = dynamic(() => import('../components/Layout'));

const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <CookiesProvider>
      <StoreConfigProvider>
        <CacheProvider value={emotionCache}>
          <ThemeProvider theme={theme}>
            <Head>
              <meta name="viewport" content="initial-scale=1, width=device-width" />
            </Head>
            <CssBaseline />
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ThemeProvider>
        </CacheProvider>
      </StoreConfigProvider>
    </CookiesProvider>
  );
}

export default withUrqlClient(
  () => ({
    url: new URL('/graphql', process.env.NEXT_PUBLIC_ADOBE_COMMERCE_URL).href,
    preferGetMethod: true,
  }),
  { ssr: false, neverSuspend: true },
)(MyApp);
