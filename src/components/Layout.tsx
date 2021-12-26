import React from 'react';
import {
  AppDocument,
  AppQuery,
  AppQueryVariables,
} from '../../generated/generated-types';
import { useQuery } from 'urql';
import Head from 'next/head';
import Box from '@mui/material/Box';
import Navigation from './navigation/Navigation';
import NextNProgress from 'nextjs-progressbar';
import GlobalStyles from '@mui/material/GlobalStyles';
import theme from '../lib/theme';

type Props = {
  children?: React.ReactChild | React.ReactChild[];
};

export default function Layout(props: Props) {
  const { children } = props;
  const [result] = useQuery<AppQuery, AppQueryVariables>({
    query: AppDocument,
  });
  const { data, fetching, error } = result;

  if (fetching) return null;
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
        <Box sx={{ background: '#fff', display: 'flex' }}>{children}</Box>
        <Box
          sx={{
            maxWidth: 'lg',
            width: '100%',
            mx: 'auto',
            pt: 9,
            pb: 14,
            fontSize: '0.9rem',
            textAlign: 'center',
          }}
        >
          <Box>{data.storeConfig.copyright ?? ''}</Box>
        </Box>
      </>
    );
  } else {
    return <Box>Could not connect to backend.</Box>;
  }
}
