import React, { useContext } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Box from '@mui/material/Box';
import NextNProgress from 'nextjs-progressbar';
import GlobalStyles from '@mui/material/GlobalStyles';
import { StoreConfigContext } from '../lib/StoreConfigContext';
import theme from '../lib/theme';
const Navigation = dynamic(() => import('./navigation/Navigation'));

type Props = {
  children?: React.ReactChild | React.ReactChild[];
};

export default function Layout(props: Props) {
  const { storeConfig } = useContext(StoreConfigContext);
  const { children } = props;

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
