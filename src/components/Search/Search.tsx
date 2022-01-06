import React from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useClient } from 'urql';
import {
  ProductsDocument,
  ProductsQuery,
  ProductsQueryVariables,
  ProductBundleFragment,
  ProductConfigurableFragment,
  ProductDownloadableFragment,
  ProductGroupedFragment,
  ProductSimpleFragment,
  ProductVirtualFragment,
} from '../../generated/types';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Price from '../Price';
import styles from './Search.module.css';

export default function Search() {
  const client = useClient();
  const router = useRouter();
  const [options, setOptions] = React.useState<
    Array<
      | ProductBundleFragment
      | ProductConfigurableFragment
      | ProductDownloadableFragment
      | ProductGroupedFragment
      | ProductSimpleFragment
      | ProductVirtualFragment
      | null
      | undefined
    >
  >([]);
  const [value, setValue] = React.useState('');

  const debounced = useDebouncedCallback((value) => {
    (async () => {
      const { data } = await client
        .query<ProductsQuery, ProductsQueryVariables>(
          ProductsDocument,
          {
            search: value,
            pageSize: 300,
          },
          {
            requestPolicy: 'network-only',
          },
        )
        .toPromise();
      const items = data?.products?.items ?? [];
      setOptions([...items]);
    })();
  }, 300);

  const handleClick = (
    option:
      | ProductBundleFragment
      | ProductConfigurableFragment
      | ProductDownloadableFragment
      | ProductGroupedFragment
      | ProductSimpleFragment
      | ProductVirtualFragment
      | null
      | undefined,
  ) => {
    if (option) {
      router.push(
        {
          pathname: `/${option.url_key}.html`,
          query: {
            type: 'PRODUCT',
          },
        },
        `/${option.url_key}.html`,
      );
      setValue('');
      setOptions([]);
    }
  };

  return (
    <div className={styles.search}>
      <input
        className={styles.searchinput}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          debounced(e.target.value);
        }}
        onBlur={(e) => e.relatedTarget === null && setOptions([])}
        placeholder="Search the store"
      />
      {options && (
        <ul className={styles.searchlist}>
          {options.map(
            (option) =>
              option && (
                <li
                  key={option.id}
                  className={styles.searchitem}
                  onClick={() => handleClick(option)}
                  tabIndex={0}
                >
                  {option?.thumbnail?.url && (
                    <Image
                      src={option.thumbnail.url}
                      width={62}
                      height={77}
                      alt={option.thumbnail.label ?? 'Product image'}
                    />
                  )}
                  <div className={styles.searchitemcontent}>
                    <div>{option.name}</div>
                    <Price price={option.price_range} />
                  </div>
                </li>
              ),
          )}
        </ul>
      )}
    </div>
  );
}
