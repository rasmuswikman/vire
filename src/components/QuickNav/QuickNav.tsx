import React from 'react';
import { useCookies } from 'react-cookie';
import Link from 'next/link';
import Image from 'next/image';
import styles from './QuickNav.module.css';

type Props = {
  mainNavVisible: boolean;
  setMainNavVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function QuickNav(props: Props) {
  const { mainNavVisible, setMainNavVisible } = props;
  const [cookies] = useCookies(['cart']);

  return (
    <ul className={styles.menu}>
      <li>
        <Link href="/checkout">
          <a>
            {cookies?.cart?.cartItems ?? null}
            <Image src="/icons/bag.svg" width={28} height={28} alt="Shopping bag" />
          </a>
        </Link>
      </li>
      {typeof window !== 'undefined' && window.innerWidth < 601 && (
        <li>
          <Image
            src={mainNavVisible ? '/icons/close.svg' : '/icons/menu.svg'}
            width={28}
            height={28}
            alt="Menu"
            onClick={() => setMainNavVisible(!mainNavVisible)}
          />
        </li>
      )}
    </ul>
  );
}
