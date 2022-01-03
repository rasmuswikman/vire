import {
  CategoryDocument,
  CategoryQuery,
  CategoryQueryVariables,
} from '../generated/types';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import { initUrqlClient } from 'next-urql';
import { ssrExchange, dedupExchange, cacheExchange, fetchExchange } from 'urql';
const HomePage = dynamic(() => import('../components/HomePage'));

export default function Home() {
  return <HomePage />;
}

export const getServerSideProps: GetServerSideProps = async () => {
  const ssrCache = ssrExchange({ isClient: false });
  const client = initUrqlClient(
    {
      url: new URL('/graphql', process.env.NEXT_PUBLIC_ADOBE_COMMERCE_URL).href,
      exchanges: [dedupExchange, cacheExchange, ssrCache, fetchExchange],
      preferGetMethod: true,
    },
    false,
  );

  await client
    ?.query<CategoryQuery, CategoryQueryVariables>(CategoryDocument)
    .toPromise();

  return {
    props: {
      urqlState: ssrCache.extractData(),
    },
  };
};
