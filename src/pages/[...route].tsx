import React from 'react';
import Error from 'next/error';
import { GetServerSideProps } from 'next';
import { initializeApollo } from '../lib/apolloClient';
import type { NormalizedCacheObject } from '@apollo/client';
import {
  AppDocument,
  ProductsDocument,
  RouteDocument,
} from '../../generated/generated-types';
import Box from '@mui/material/Box';
import Category from '../components/Category';
import Product from '../components/Product';

type Props = {
  type: string;
  url: string;
  page: number;
  uid: string;
  initialApolloState: NormalizedCacheObject | undefined;
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
  return <Box sx={{ maxWidth: 'lg', mx: 'auto', py: 2 }}>{renderSwitch(props)}</Box>;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res, query, resolvedUrl } = context;

  res?.setHeader('cache-control', 's-maxage=1, stale-while-revalidate');

  try {
    const apolloClient = initializeApollo();
    const url = resolvedUrl.replace('/', '');
    const page = query.page ?? 1;

    const { data } = await apolloClient.query({
      query: RouteDocument,
      variables: { url },
    });

    if (!data?.route) {
      if (res) res.statusCode = 404;
      return { props: { type: '404' } };
    }

    if (req) {
      await apolloClient.query({ query: AppDocument });

      if (data.route.type === 'CATEGORY') {
        await apolloClient.query({
          query: ProductsDocument,
          variables: { filters: { category_uid: { eq: data.route.id } }, page },
        });
      }
    }

    return {
      props: {
        type: data.route.type,
        url,
        page,
        uid: typeof data.route.id !== 'undefined' ? data.route.id : null,
        initialApolloState: apolloClient.cache.extract(),
      },
    };
  } catch (e) {
    console.log(e);
    if (res) res.statusCode = 500;
    return { props: { type: '500' } };
  }
};
