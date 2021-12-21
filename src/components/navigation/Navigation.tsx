import React from 'react';
import type { CategoryChildrenFragment } from '../../../generated/generated-types';
import Image from 'next/image';
import NextLink from 'next/link';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Icons from './Icons';
import Menu from './Menu';
import Search from './Search';

type Props = {
  categories: Array<CategoryChildrenFragment | null | undefined> | null | undefined;
  categoryUrlSuffix: string;
  productUrlSuffix: string;
};

export default function Navigation(props: Props) {
  const { categories, categoryUrlSuffix, productUrlSuffix } = props;

  return (
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
        py: {
          sm: 1,
          lg: 4,
        },
      }}
    >
      <Box sx={{ flexGrow: { xs: 1, sm: 0 }, order: { xs: 0, sm: 0 } }}>
        <NextLink href="/" passHref>
          <Link>
            <Image src="/logo.svg" alt="Store logo" width={120} height={37} />
          </Link>
        </NextLink>
      </Box>
      {categories && (
        <Box
          sx={{
            ml: 4,
            flexGrow: { xs: 1, sm: 0 },
            order: { xs: 1, sm: 1 },
            display: { xs: 'none', sm: 'block' },
          }}
        >
          <Menu categories={categories} categoryUrlSuffix={categoryUrlSuffix} />
        </Box>
      )}
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
      <Box sx={{ order: { xs: 2, sm: 3 }, whiteSpace: 'nowrap' }}>
        <Icons categories={categories} categoryUrlSuffix={categoryUrlSuffix} />
      </Box>
    </Box>
  );
}
