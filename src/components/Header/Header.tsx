import React from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import NextLink from 'next/link';
const QuickNav = dynamic(() => import('../QuickNav'));
const MainNav = dynamic(() => import('../MainNav'));
const Search = dynamic(() => import('../Search'));
import styles from './Header.module.css';

export default function Header() {
  const [mainNavVisible, setMainNavVisible] = React.useState(
    typeof window !== 'undefined' ? window.innerWidth > 600 : false,
  );
  const [hasMounted, setHasMounted] = React.useState(false);

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  if (hasMounted) {
    return (
      <>
        <div className={styles.wrapper}>
          <div className={styles.container}>
            <div className={styles.logo}>
              <NextLink href="/">
                <a>
                  <Image src="/logo.svg" alt="Store logo" width={88} height={35} />
                </a>
              </NextLink>
            </div>
            <div className={styles.search}>
              <Search />
            </div>
            <div className={styles.quicknav}>
              <QuickNav
                mainNavVisible={mainNavVisible}
                setMainNavVisible={setMainNavVisible}
              />
            </div>
          </div>
        </div>
        <MainNav
          mainNavVisible={mainNavVisible}
          setMainNavVisible={setMainNavVisible}
        />
      </>
    );
  }
  return null;
}
