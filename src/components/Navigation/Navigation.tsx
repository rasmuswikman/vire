import React from 'react';
import type { CategoryTreeFragment } from '../../generated/types';
import {
  CategoryDocument,
  CategoryQuery,
  CategoryQueryVariables,
} from '../../generated/types';
import { useQuery } from 'urql';
import NextLink from 'next/link';
import { StoreConfigContext } from '../../lib/StoreConfigContext';
import styles from './Navigation.module.css';

export default function Navigation() {
  const { storeConfig } = React.useContext(StoreConfigContext);
  const categoryUrlSuffix = storeConfig.category_url_suffix ?? '';
  const [result] = useQuery<CategoryQuery, CategoryQueryVariables>({
    query: CategoryDocument,
  });
  const { data, fetching } = result;
  const categories: Array<CategoryTreeFragment | null | undefined> | null =
    (data?.categoryList &&
      data?.categoryList[0] &&
      data.categoryList[0]?.children) ??
    null;

  if (fetching || !data || !categories) return null;

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {categories.map(
          (category: CategoryTreeFragment | undefined | null) =>
            category && (
              <NextLink
                key={category.id}
                href={{
                  pathname: `/${category.url_path + categoryUrlSuffix}`,
                  query: {
                    type: 'CATEGORY',
                    id: category.id,
                  },
                }}
                as={`/${category.url_path + categoryUrlSuffix}`}
              >
                <a>{category.name}</a>
              </NextLink>
            ),
        )}
      </div>
    </div>
  );
}
