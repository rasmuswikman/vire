import React, { FC } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import NextNProgress from 'nextjs-progressbar';
import { StoreConfigContext } from '../../lib/StoreConfigContext';
const Header = dynamic(() => import('../Header'));
import styles from './Layout.module.css';

const Layout: FC = ({ children }) => {
  const { storeConfig } = React.useContext(StoreConfigContext);

  return (
    <>
      <Head>
        <title>{storeConfig.default_title ?? ''}</title>
      </Head>
      <NextNProgress color="#111" height={1} />
      <Header />
      <div className={styles.content}>{children}</div>
      <div className={styles.footer}>{storeConfig.copyright ?? ''}</div>
    </>
  );
};

export default Layout;
