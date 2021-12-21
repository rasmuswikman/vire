import React from 'react';
import type { CategoryChildrenFragment } from '../../../generated/generated-types';
import NextLink from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Fade from '@mui/material/Fade';
import Link from '@mui/material/Link';
import MuiMenu from '@mui/material/Menu';
import theme from '../../lib/theme';

type Props = {
  categories: Array<CategoryChildrenFragment | null | undefined>;
  categoryUrlSuffix: string;
};

export default function Menu(props: Props) {
  const { categories, categoryUrlSuffix } = props;
  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);
  const menuOpen = Boolean(menuAnchorEl);
  const menuHandleClick = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };
  const menuHandleClose = () => {
    setMenuAnchorEl(null);
  };

  return (
    <>
      <Button
        sx={{ color: 'primary.main', textTransform: 'none' }}
        aria-controls="basic-menu"
        aria-haspopup="true"
        aria-expanded={menuOpen ? 'true' : undefined}
        onClick={menuHandleClick}
      >
        <strong>Products</strong>
      </Button>
      <MuiMenu
        PaperProps={{
          style: {
            width: `calc(100vw - ${theme.spacing(4)})`,
            maxWidth: theme.breakpoints.values.lg,
            transform: `translateX(calc(50vw - 50% - ${theme.spacing(
              2,
            )})) translateY(${theme.spacing(2)})`,
            background: theme.palette.primary.main,
            borderRadius: theme.shape.borderRadius,
            border: '1px solid #fff',
          },
        }}
        TransitionComponent={Fade}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        anchorEl={menuAnchorEl}
        open={menuOpen}
        onClose={menuHandleClose}
        MenuListProps={{
          'aria-labelledby': 'Primary menu',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            p: 5,
          }}
        >
          {categories.map(
            (category: CategoryChildrenFragment | undefined | null) =>
              category && (
                <Box key={category.id} sx={{ mx: 4 }}>
                  <NextLink
                    href={{
                      pathname: `/${category.url_path + categoryUrlSuffix}`,
                      query: {
                        type: 'CATEGORY',
                      },
                    }}
                    as={`/${category.url_path + categoryUrlSuffix}`}
                    passHref
                  >
                    <Link
                      color={theme.palette.primary.light}
                      onClick={menuHandleClose}
                    >
                      <strong>{category.name}</strong>
                    </Link>
                  </NextLink>
                  {category.children?.map(
                    (category: CategoryChildrenFragment | undefined | null) =>
                      category && (
                        <Box key={category.id} sx={{ my: 1 }}>
                          <NextLink
                            href={{
                              pathname: `/${category.url_path + categoryUrlSuffix}`,
                              query: {
                                type: 'CATEGORY',
                              },
                            }}
                            as={`/${category.url_path + categoryUrlSuffix}`}
                            passHref
                          >
                            <Link
                              color={theme.palette.primary.light}
                              onClick={menuHandleClose}
                            >
                              {category.name}
                            </Link>
                          </NextLink>
                        </Box>
                      ),
                  )}
                </Box>
              ),
          )}
        </Box>
      </MuiMenu>
    </>
  );
}
