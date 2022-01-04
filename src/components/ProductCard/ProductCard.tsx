import React from 'react';
import {
  ProductBundleFragment,
  ProductConfigurableFragment,
  ProductDownloadableFragment,
  ProductGroupedFragment,
  ProductSimpleFragment,
  ProductVirtualFragment,
} from '../../generated/types';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Price from '../Price';
import styles from './ProductCard.module.css';

type Props = {
  index: number;
  product:
    | ProductBundleFragment
    | ProductConfigurableFragment
    | ProductDownloadableFragment
    | ProductGroupedFragment
    | ProductSimpleFragment
    | ProductVirtualFragment;
  productUrlSuffix: string;
};

export default function ProductCard(props: Props) {
  const { index, product, productUrlSuffix } = props;

  return (
    <div className={styles.container}>
      {product.thumbnail?.url && (
        <Link
          href={{
            pathname: `/${product.url_key + productUrlSuffix}`,
            query: {
              type: 'PRODUCT',
            },
          }}
          as={`/${product.url_key + productUrlSuffix}`}
        >
          <a>
            <Image
              src={product.thumbnail.url}
              alt={product.thumbnail.label ?? 'Product image'}
              width={320}
              height={397}
              priority={index === 0}
            />
            <div
              dangerouslySetInnerHTML={{
                __html: product.name ?? '',
              }}
            />
            <Price price={product.price_range} />
          </a>
        </Link>
      )}
    </div>
  );
}
