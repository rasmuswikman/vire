import React, { useContext } from 'react';
import {
  CategoryDocument,
  CategoryQuery,
  CategoryQueryVariables,
} from '../../../generated/generated-types';
import { useQuery } from 'urql';
import Image from 'next/image';
import NextLink from 'next/link';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { StoreConfigContext } from '../../lib/StoreConfigContext';
import Icons from './Icons';
import Menu from './Menu';
import Search from './Search';

export default function Navigation() {
  const { storeConfig } = useContext(StoreConfigContext);
  const [result] = useQuery<CategoryQuery, CategoryQueryVariables>({
    query: CategoryDocument,
  });
  const { data, fetching } = result;
  const categories =
    (data?.categoryList &&
      data?.categoryList[0] &&
      data.categoryList[0]?.children) ??
    null;
  const categoryUrlSuffix = storeConfig.category_url_suffix ?? '';
  const productUrlSuffix = storeConfig.product_url_suffix ?? '';

  if (fetching || !data || !categories) return null;

  return (
    <>
      <Box
        sx={{
          maxWidth: 'lg',
          width: '100%',
          marginLeft: 'auto',
          marginRight: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexFlow: { xs: 'row wrap', sm: 'row' },
          pt: {
            sm: 1,
            lg: 4,
          },
        }}
      >
        <Box sx={{ mr: 5, flexGrow: { xs: 1, sm: 0 }, order: { xs: 0, sm: 0 } }}>
          <NextLink href="/" passHref>
            <Link>
              <Image src="/logo.svg" alt="Store logo" width={120} height={37} />
            </Link>
          </NextLink>
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            flexBasis: '350px',
            mx: { xs: 0, sm: 6 },
            mt: { xs: 2, sm: 0 },
            order: { xs: 3, sm: 2 },
          }}
        >
          <Search productUrlSuffix={productUrlSuffix} />
        </Box>
        <Box sx={{ ml: 5, order: { xs: 2, sm: 3 }, whiteSpace: 'nowrap' }}>
          <Icons categories={categories} categoryUrlSuffix={categoryUrlSuffix} />
        </Box>
      </Box>
      {categories && (
        <Box
          sx={{
            maxWidth: 'lg',
            width: '100%',
            marginLeft: 'auto',
            marginRight: 'auto',
            display: { xs: 'none', sm: 'block' },
            textAlign: 'center',
            py: 4,
          }}
        >
          <Menu categories={categories} categoryUrlSuffix={categoryUrlSuffix} />
        </Box>
      )}
    </>
  );
}
