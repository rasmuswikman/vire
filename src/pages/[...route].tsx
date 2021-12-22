import React from 'react';
import Error from 'next/error';
import { GetServerSideProps } from 'next';
import { initializeApollo } from '../lib/apolloClient';
import {
  AppDocument,
  AppQuery,
  AppQueryVariables,
  RouteDocument,
  RouteQuery,
  RouteQueryVariables,
  ProductsDocument,
  ProductsQuery,
  ProductsQueryVariables,
} from '../../generated/generated-types';
import Box from '@mui/material/Box';
import Category from '../components/category/Category';
import Product from '../components/product/Product';

type Props = {
  type: string;
  url: string;
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

  try {
    const apolloClient = initializeApollo();
    const url = resolvedUrl.replace('/', '');
    const page = typeof query.page === 'string' ? parseInt(query.page) : 1;

    const { data } = await apolloClient.query<RouteQuery, RouteQueryVariables>({
      query: RouteDocument,
      variables: { url },
    });

    if (!data?.route) {
      if (res) res.statusCode = 404;
      return { props: { type: '404' } };
    }

    // eslint-disable-next-line
    // @ts-ignore: Type CmsPage does not have an id of Scalars['ID']
    const id = data.route?.id ?? null;

    if (req) {
      await apolloClient.query<AppQuery, AppQueryVariables>({ query: AppDocument });

      if (data.route.type === 'CATEGORY') {
        await apolloClient.query<ProductsQuery, ProductsQueryVariables>({
          query: ProductsDocument,
          variables: { filters: { category_uid: { eq: id } }, page },
        });
      }
    }

    return {
      props: {
        type: data.route.type,
        url,
        page,
        id,
        initialApolloState: apolloClient.cache.extract(),
      },
    };
  } catch (e) {
    console.log(e);
    if (res) res.statusCode = 500;
    return { props: { type: '500' } };
  }
};
