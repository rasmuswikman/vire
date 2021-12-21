import { useMemo } from 'react';
import type { AppProps } from 'next/app';
import type { NormalizedCacheObject } from '@apollo/client';
import { ApolloClient, HttpLink, InMemoryCache, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';

export const APOLLO_STATE_PROPERTY_NAME = '__APOLLO_STATE__';

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined;

const createApolloClient = () => {
  const uri = new URL('/graphql', process.env.NEXT_PUBLIC_ADOBE_COMMERCE_URL).href;

  const httpLink = new HttpLink({
    uri,
    fetchOptions: {
      method: 'GET',
    },
  });

  /*
  const authLink = new ApolloLink((operation, forward) => {
    operation.setContext(({ headers }) => ({
      headers: {
        //authorization: Auth.userId(), // however you get your token
        ...headers,
      },
    }));
    console.log(operation.getContext());
    return forward(operation);
  });
  */

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.forEach((error) =>
        console.log(`[GraphQL error]: ${JSON.stringify(error)}`),
      );

    if (networkError) console.log(`[Network error]: ${networkError}`);
  });

  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    credentials: 'include',
    link: from([errorLink, httpLink]),
    cache: new InMemoryCache(),
  });
};

type InitialState = NormalizedCacheObject | undefined;

interface InitializeApollo {
  initialState?: InitialState | null;
}

export const initializeApollo = (
  { initialState }: InitializeApollo = {
    initialState: null,
  },
) => {
  const _apolloClient = apolloClient ?? createApolloClient();

  if (initialState) {
    const existingCache = _apolloClient.extract();
    _apolloClient.cache.restore({ ...existingCache, ...initialState });
  }

  if (typeof window === 'undefined') return _apolloClient;

  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
};

export function useApollo(pageProps: AppProps['pageProps']) {
  const state = pageProps[APOLLO_STATE_PROPERTY_NAME];
  const store = useMemo(() => initializeApollo({ initialState: state }), [state]);
  return store;
}
