import React from 'react';
import type { CategoryTreeFragment } from '../../../generated/generated-types';
import NextLink from 'next/link';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import theme from '../../lib/theme';

type Props = {
  categories: Array<CategoryTreeFragment | null | undefined>;
  categoryUrlSuffix: string;
};

export default function Menu(props: Props) {
  const { categories, categoryUrlSuffix } = props;

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
        }}
      >
        {categories.map(
          (category: CategoryTreeFragment | undefined | null) =>
            category && (
              <Box key={category.id} sx={{ mx: 2.5 }}>
                <NextLink
                  href={{
                    pathname: `/${category.url_path + categoryUrlSuffix}`,
                    query: {
                      type: 'CATEGORY',
                      id: category.id,
                    },
                  }}
                  as={`/${category.url_path + categoryUrlSuffix}`}
                  passHref
                >
                  <Link
                    underline="none"
                    color={theme.palette.primary.main}
                    sx={{ fontWeight: '500' }}
                  >
                    {category.name}
                  </Link>
                </NextLink>
              </Box>
            ),
        )}
      </Box>
    </>
  );
}
