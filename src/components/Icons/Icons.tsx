import React from 'react';
import { useCookies } from 'react-cookie';
import Link from 'next/link';
import Image from 'next/image';

export default function Icons() {
  const [hasMounted, setHasMounted] = React.useState(false);
  const [cookies] = useCookies(['cart']);

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  if (hasMounted) {
    return (
      <Link href="/checkout">
        <a>
          {cookies?.cart?.cartItems ?? null}
          <Image
            src="/icons/bag.svg"
            width={28}
            height={28}
            alt="Shopping bag icon"
          />
        </a>
      </Link>
    );
  }
  return null;
}
