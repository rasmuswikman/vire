import React, { useContext } from 'react';
import {
  StoreConfigDocument,
  StoreConfigQuery,
  StoreConfigQueryVariables,
} from '../../generated/generated-types';
import { useQuery } from 'urql';
import Head from 'next/head';
import Box from '@mui/material/Box';
import Navigation from './navigation/Navigation';
import NextNProgress from 'nextjs-progressbar';
import GlobalStyles from '@mui/material/GlobalStyles';
import { StoreConfigContext } from '../lib/StoreConfigContext';
import theme from '../lib/theme';

type Props = {
  children?: React.ReactChild | React.ReactChild[];
};

export default function Layout(props: Props) {
  const { storeConfig, setStoreConfig } = useContext(StoreConfigContext);
  const { children } = props;
  const [result] = useQuery<StoreConfigQuery, StoreConfigQueryVariables>({
    query: StoreConfigDocument,
  });
  const { data, fetching, error } = result;

  if (fetching) return null;
  if (error) return <Box>{error.message}</Box>;
  if (data?.storeConfig) {
    setStoreConfig(data.storeConfig);
  }

  return (
    <>
      <GlobalStyles
        styles={{
          body: { backgroundColor: theme.palette.primary.light },
        }}
      />
      <Head>
        <title>{storeConfig.default_title ?? ''}</title>
      </Head>
      <NextNProgress color={theme.palette.primary.main} height={1} />
      <Box
        sx={{
          background: '#fff',
        }}
      >
        <Navigation />
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
        <Box>{storeConfig.copyright ?? ''}</Box>
      </Box>
    </>
  );
}
