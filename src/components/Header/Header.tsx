import React from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import NextLink from 'next/link';
const Icons = dynamic(() => import('../Icons'));
const Navigation = dynamic(() => import('../Navigation'));
import styles from './Header.module.css';

export default function Header() {
  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.logo}>
            <NextLink href="/">
              <a>
                <Image src="/logo.svg" alt="Store logo" width={120} height={37} />
              </a>
            </NextLink>
          </div>
          <div className={styles.search}>{/*<Search />*/}</div>
          <div className={styles.icons}>
            <Icons />
          </div>
        </div>
      </div>
      <Navigation />
    </>
  );
}
