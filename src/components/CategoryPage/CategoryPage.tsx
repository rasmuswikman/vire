import React from 'react';
import {
  AggregationFragment,
  CategoryDocument,
  CategoryQuery,
  CategoryQueryVariables,
  CategoryTreeFragment,
  ProductsDocument,
  ProductsQuery,
  ProductsQueryVariables,
  ProductsFragment,
} from '../../generated/types';
import { useQuery } from 'urql';
import { useClient } from 'urql';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { StoreConfigContext } from '../../lib/StoreConfigContext';
import Loading from '../Loading';
//const Breadcrumbs = dynamic(() => import('../Breadcrumbs'));
//const Filters = dynamic(() => import('../Filters'));
const ProductCard = dynamic(() => import('../ProductCard'));
import styles from './CategoryPage.module.css';

type Props = {
  type: string;
  page: number;
  id: string;
};

export default function CategoryPage(props: Props) {
  const { page, id } = props;
  const { storeConfig } = React.useContext(StoreConfigContext);
  const client = useClient();
  const [result] = useQuery<CategoryQuery, CategoryQueryVariables>({
    query: CategoryDocument,
    variables: { filters: { category_uid: { eq: id } } },
  });
  const { data, fetching } = result;
  const [products, setProducts] = React.useState<
    ProductsFragment | undefined | null
  >(null);
  const [aggregations, setAggregations] = React.useState<
    Array<AggregationFragment | null | undefined>
  >([]);

  const [resultProducts] = useQuery<ProductsQuery, ProductsQueryVariables>({
    query: ProductsDocument,
    variables: {
      filters: { category_uid: { eq: id } },
      page: page ?? 1,
    },
  });
  const { data: dataProducts } = resultProducts;

  const getProducts = async (
    filter: Record<string, Record<string, string>>,
    page: number,
  ) => {
    const filters = { category_uid: { eq: id }, ...filter };
    const { data } = await client
      .query<ProductsQuery, ProductsQueryVariables>(ProductsDocument, {
        filters,
        page,
      })
      .toPromise();
    setProducts(data?.products);
  };

  React.useEffect(() => {
    setAggregations(dataProducts?.products?.aggregations ?? []);
    setProducts(dataProducts?.products);
  }, [setProducts, dataProducts?.products]);

  const router = useRouter();
  const category: CategoryTreeFragment | null =
    data?.categoryList && data?.categoryList[0] ? data?.categoryList[0] : null;
  const categoryUrlSuffix = storeConfig.category_url_suffix ?? '';
  const productUrlSuffix = storeConfig.product_url_suffix ?? '';

  /*
  const handlePagination = (event: React.ChangeEvent<unknown>, value: number) => {
    if (category) {
      router.push(
        {
          pathname: `/${category.url_path + categoryUrlSuffix}`,
          query: { page: value, type: 'CATEGORY', id: category.id },
        },
        `/${category.url_path + categoryUrlSuffix}?page=${value}`,
      );
    }
  };
  */

  const handleAggregations = (options: Record<string, Record<string, boolean>>) => {
    if (category) {
      const filter: Record<string, Record<string, string>> = {};
      let params = '';
      for (const [attributeCode, option] of Object.entries(options)) {
        let fromTo: string[] = [];
        for (const [optionLabel, value] of Object.entries(option)) {
          if (value === false) {
            delete options[attributeCode][optionLabel];
          }
          fromTo = optionLabel.split('_');
        }
        filter[attributeCode] = { from: fromTo[0], to: fromTo[1] };
        params += `&${attributeCode}=${Object.keys(option).join(',')}`;
      }
      const page = 1;
      router.push(
        {
          pathname: `/${category.url_path + categoryUrlSuffix}`,
          query: { page, type: 'CATEGORY', id: category.id },
        },
        `/${category.url_path + categoryUrlSuffix}?page=${page}${params}`,
        { shallow: true },
      );
      getProducts(filter, page);
    }
  };

  if (fetching || !data) return <Loading />;

  return category ? (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <Head>
          <title>
            {category.name} - {storeConfig.default_title}
          </title>
        </Head>
        {/* <Breadcrumbs breadcrumbs={category.breadcrumbs} /> */}
        <h2>{category.name}</h2>
        <div className={styles.columns}>
          <div>
            {category.children && (
              <div className={styles.categories}>
                {category.children?.length > 0 &&
                  category.children.map(
                    (category) =>
                      category && (
                        <Link
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
                        </Link>
                      ),
                  )}
              </div>
            )}
            {/* aggregations && aggregations.length > 0 && (
            <Filters
              aggregations={aggregations}
              handleAggregations={handleAggregations}
            />
          ) */}
          </div>
          <div>
            {products?.items && products?.items.length > 0 ? (
              <>
                <div className={styles.products}>
                  {products.items.map(
                    (product) =>
                      product && (
                        <ProductCard
                          key={product.id}
                          product={product}
                          productUrlSuffix={productUrlSuffix}
                        />
                      ),
                  )}
                </div>
                {/*products?.page_info?.total_pages &&
                products?.page_info?.total_pages > 1 && (
                  <Box
                    sx={{
                      display: 'flex',
                      flexGrow: 1,
                      justifyContent: 'center',
                      mt: 5,
                    }}
                  >
                    <Pagination
                      count={products.page_info.total_pages ?? 0}
                      page={products.page_info.current_page ?? 0}
                      onChange={handlePagination}
                    />
                  </Box>
                  )*/}
              </>
            ) : (
              <>No products.</>
            )}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <>Not found.</>
  );
}
