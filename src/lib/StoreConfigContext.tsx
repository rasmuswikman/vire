import React, { useState, FC } from 'react';
import { StoreConfigFragment } from '../../generated/generated-types';

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
  const [storeConfig, setStoreConfig] = useState(defaultState);

  return (
    <StoreConfigContext.Provider
      value={{
        storeConfig,
        setStoreConfig,
      }}
    >
      {children}
    </StoreConfigContext.Provider>
  );
};
