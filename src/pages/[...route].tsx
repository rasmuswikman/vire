import React from 'react';
import Error from 'next/error';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import { initUrqlClient } from 'next-urql';
import { ssrExchange, dedupExchange, cacheExchange, fetchExchange } from 'urql';
import {
  CategoryDocument,
  CategoryQuery,
  CategoryQueryVariables,
  RouteDocument,
  RouteQuery,
  RouteQueryVariables,
  ProductsDocument,
  ProductsQuery,
  ProductsQueryVariables,
} from '../../generated/generated-types';
import Box from '@mui/material/Box';
const Category = dynamic(() => import('../components/category/Category'));
const Product = dynamic(() => import('../components/product/Product'));

type Props = {
  type: string;
  url: string;
  urlKey: string;
  page: number;
  id: string;
};

const renderSwitch = (props: Props) => {
  const { type } = props;

  switch (type) {
    case 'CMS_PAGE':
      return <div>CMS is not implemented in this sample.</div>;
    case 'CATEGORY':
      return <Category {...props} />;
    case 'PRODUCT':
      return <Product {...props} />;
    case '404':
      return <Error statusCode={404} />;
    default:
      return <Error statusCode={500} />;
  }
};

export default function URLResolver(props: Props) {
  return (
    <Box
      sx={{
        width: '100%',
        borderTop: `1px solid #f1f1f1`,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 'lg',
          mx: 'auto',
          pt: 3,
          pb: 5,
        }}
      >
        {renderSwitch(props)}
      </Box>
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res, query, resolvedUrl } = context;

  res?.setHeader('cache-control', 's-maxage=1, stale-while-revalidate');

  const url = resolvedUrl.replace('/', '').split('?')[0];
  const urlKey = url.replace('.html', '');
  const page = typeof query.page === 'string' ? parseInt(query.page) : 1;

  if (query?.type) {
    return {
      props: { url, urlKey, page, type: query.type, id: query.id },
    };
  }

  const ssrCache = ssrExchange({ isClient: false });
  const client = initUrqlClient(
    {
      url: new URL('/graphql', process.env.NEXT_PUBLIC_ADOBE_COMMERCE_URL).href,
      exchanges: [dedupExchange, cacheExchange, ssrCache, fetchExchange],
      preferGetMethod: true,
    },
    false,
  );

  const result = await client
    ?.query<RouteQuery, RouteQueryVariables>(RouteDocument, { url })
    .toPromise();

  const data = result?.data;

  if (!data?.route) {
    if (res) res.statusCode = 404;
    return { props: { type: '404' } };
  }

  const type = data.route.type;
  const id = data.route.__typename === 'CategoryTree' ? data.route.id : null;

  if (req) {
    const promises = [];

    promises.push(
      client
        ?.query<CategoryQuery, CategoryQueryVariables>(CategoryDocument)
        .toPromise(),
    );

    if (type === 'CATEGORY') {
      promises.push(
        client
          ?.query<CategoryQuery, CategoryQueryVariables>(CategoryDocument, {
            filters: { category_uid: { eq: id } },
          })
          .toPromise(),
      );

      promises.push(
        client
          ?.query<ProductsQuery, ProductsQueryVariables>(ProductsDocument, {
            filters: { category_uid: { eq: id } },
            page,
          })
          .toPromise(),
      );
    }

    if (type === 'PRODUCT') {
      promises.push(
        client
          ?.query<ProductsQuery, ProductsQueryVariables>(ProductsDocument, {
            filters: { url_key: { eq: urlKey } },
          })
          .toPromise(),
      );
    }

    await Promise.all(promises);
  }

  return {
    props: {
      type,
      url,
      urlKey,
      page,
      id,
      urqlState: ssrCache.extractData(),
    },
  };
};
