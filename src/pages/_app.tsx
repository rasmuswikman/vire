import { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { CookiesProvider } from 'react-cookie';
import { withUrqlClient } from 'next-urql';
const Layout = dynamic(() => import('../components/Layout'));
import '../styles/variables.css';
import '../styles/globals.css';

function MyApp(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <CookiesProvider>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
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
