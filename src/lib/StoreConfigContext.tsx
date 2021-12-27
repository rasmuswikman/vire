import React, { useEffect, useMemo, useState, FC } from 'react';
import {
  StoreConfigDocument,
  StoreConfigQuery,
  StoreConfigQueryVariables,
  StoreConfigFragment,
} from '../../generated/generated-types';
import { useClient } from 'urql';

const defaultState: StoreConfigFragment = {
  product_url_suffix: '.html',
  category_url_suffix: '.html',
  default_title: 'Vire',
  copyright: '',
};

type StoreConfigContextType = {
  storeConfig: StoreConfigFragment;
  setStoreConfig: (storeConfig: StoreConfigFragment) => void;
};

export const StoreConfigContext = React.createContext<StoreConfigContextType>({
  storeConfig: defaultState,
  setStoreConfig: () => console.warn('No context provider.'),
});

export const StoreConfigProvider: FC = ({ children }) => {
  const [storeConfig, setStoreConfig] = useState<StoreConfigFragment>(defaultState);
  const client = useClient();

  useEffect(() => {
    client
      .query<StoreConfigQuery, StoreConfigQueryVariables>(StoreConfigDocument)
      .toPromise()
      .then((result) => {
        setStoreConfig(result?.data?.storeConfig ?? defaultState);
      });
  }, [client]);

  const value = useMemo(
    () => ({
      storeConfig,
      setStoreConfig,
    }),
    [storeConfig, setStoreConfig],
  );

  return (
    <StoreConfigContext.Provider value={value}>
      {children}
    </StoreConfigContext.Provider>
  );
};
