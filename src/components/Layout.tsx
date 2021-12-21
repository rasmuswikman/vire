import React from 'react';
import { useAppQuery } from '../../generated/generated-types';
import { initializeApollo } from '../lib/apolloClient';
import type { NormalizedCacheObject } from '@apollo/client';
import Head from 'next/head';
import NextLink from 'next/link';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Navigation from './navigation/Navigation';
import NextNProgress from 'nextjs-progressbar';
import GlobalStyles from '@mui/material/GlobalStyles';
import theme from '../lib/theme';

type Props = {
  initialApolloState: NormalizedCacheObject | undefined;
  children?: React.ReactChild | React.ReactChild[];
};

export default function Layout(props: Props) {
  const { initialApolloState, children } = props;
  const apolloClient = initializeApollo({ initialState: initialApolloState });
  const { data, error, loading } = useAppQuery({
    client: apolloClient,
  });

  if (loading) return null;
  if (error) return <Box>{error.message}</Box>;
  if (data?.storeConfig) {
    return (
      <>
        <GlobalStyles
          styles={{
            body: { backgroundColor: theme.palette.primary.light },
          }}
        />
        <Head>
          <title>{data.storeConfig.default_title ?? 'Vire'}</title>
        </Head>
        <NextNProgress color={theme.palette.primary.main} height={1} />
        <Box
          sx={{
            background: '#fff',
            borderBottom: `1px solid ${theme.palette.primary.light}`,
          }}
        >
          <Navigation
            categories={
              (data?.categoryList &&
                data?.categoryList[0] &&
                data.categoryList[0]?.children) ??
              null
            }
            productUrlSuffix={data.storeConfig.product_url_suffix ?? ''}
            categoryUrlSuffix={data.storeConfig.category_url_suffix ?? ''}
          />
        </Box>
        <Box sx={{ background: '#fff' }}>{children}</Box>
        <Box
          sx={{
            maxWidth: 'lg',
            width: '100%',
            mx: 'auto',
            py: 10,
            fontSize: '0.9rem',
            textAlign: 'center',
          }}
        >
          <Box>{data.storeConfig.copyright ?? ''}</Box>
          <Box
            sx={{
              mt: 1,
            }}
          >
            <NextLink
              href="https://github.com/rasmuswikman/vire-storefront"
              passHref
            >
              <Link>Happy hacking!</Link>
            </NextLink>
          </Box>
        </Box>
      </>
    );
  } else {
    return <Box>Could not connect to backend.</Box>;
  }
}
