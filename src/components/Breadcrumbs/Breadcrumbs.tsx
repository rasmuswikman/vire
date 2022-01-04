import React from 'react';
import NextLink from 'next/link';
import { StoreConfigContext } from '../../lib/StoreConfigContext';

export default function Breadcrumbs() {
  const { storeConfig } = React.useContext(StoreConfigContext);
  const categoryUrlSuffix = storeConfig.category_url_suffix ?? '';

  return (
    <div aria-label="breadcrumb">
      <NextLink href="/">
        <a>Home</a>
      </NextLink>
      {category &&
        category.breadcrumbs &&
        category.breadcrumbs.map(
          (breadcrumb) =>
            breadcrumb && (
              <NextLink
                href={`/${breadcrumb.category_url_path + categoryUrlSuffix}`}
                key={breadcrumb.id}
              >
                <a>{breadcrumb.category_name}</a>
              </NextLink>
            ),
        )}
      <span>{category.name}</span>
    </div>
  );
}
