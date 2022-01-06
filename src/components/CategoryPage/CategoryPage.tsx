import React from 'react';
import {
  CategoryDocument,
  CategoryQuery,
  CategoryQueryVariables,
  CategoryTreeFragment,
  ProductsDocument,
  ProductsQuery,
  ProductsQueryVariables,
} from '../../generated/types';
import { useQuery } from 'urql';
import Head from 'next/head';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Loading from '../Loading';
const ProductCard = dynamic(() => import('../ProductCard'));
import styles from './CategoryPage.module.css';

type Props = {
  type: string;
  page: number;
  id: string;
};

export default function CategoryPage(props: Props) {
  const { page, id } = props;
  const [{ data, fetching }] = useQuery<CategoryQuery, CategoryQueryVariables>({
    query: CategoryDocument,
    variables: { filters: { category_uid: { eq: id } } },
  });
  const [{ data: dataProducts }] = useQuery<ProductsQuery, ProductsQueryVariables>({
    query: ProductsDocument,
    variables: {
      filters: { category_uid: { eq: id } },
      page: page ?? 1,
    },
  });
  const category: CategoryTreeFragment | null =
    data?.categoryList && data?.categoryList[0] ? data.categoryList[0] : null;

  if (fetching || !data) return <Loading />;

  return (
    category && (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <Head>
            <title>{category.name} - Vire</title>
          </Head>
          <h2>{category.name}</h2>
          <div className={styles.columns}>
            {category.children && (
              <div className={styles.categories}>
                {category.children?.length > 0 &&
                  category.children.map(
                    (category) =>
                      category && (
                        <Link
                          key={category.id}
                          href={{
                            pathname: `/${category.url_path}.html`,
                            query: {
                              type: 'CATEGORY',
                              id: category.id,
                            },
                          }}
                          as={`/${category.url_path}.html`}
                        >
                          <a>{category.name}</a>
                        </Link>
                      ),
                  )}
              </div>
            )}
            {dataProducts?.products?.items &&
            dataProducts?.products?.items.length > 0 ? (
              <div className={styles.products}>
                {dataProducts.products.items.map(
                  (product, index) =>
                    product && (
                      <ProductCard
                        index={index}
                        key={product.id}
                        product={product}
                      />
                    ),
                )}
              </div>
            ) : (
              <>No products.</>
            )}
          </div>
        </div>
      </div>
    )
  );
}
