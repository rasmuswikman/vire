import React, { FC } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
const Header = dynamic(() => import('../Header'));
import styles from './Layout.module.css';

const Layout: FC = ({ children }) => {
  return (
    <>
      <Head>
        <title>Vire</title>
      </Head>
      <Header />
      <div className={styles.content}>{children}</div>
      <div className={styles.footer}>{''}</div>
    </>
  );
};

export default Layout;
