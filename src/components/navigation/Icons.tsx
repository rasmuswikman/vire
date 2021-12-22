import React from 'react';
import type { CategoryTreeFragment } from '../../../generated/generated-types';
import { useCookies } from 'react-cookie';
import NextLink from 'next/link';
import { styled } from '@mui/material/styles';
import Backdrop from '@mui/material/Backdrop';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

type ClientOnlyProps = {
  children?: React.ReactChild | React.ReactChild[];
};

function ClientOnly({ children }: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = React.useState(false);
  React.useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) {
    return null;
  }
  return <>{children}</>;
}

type Props = {
  categories: Array<CategoryTreeFragment | null | undefined> | null | undefined;
  categoryUrlSuffix: string;
};

export default function Icons(props: Props) {
  const { categories, categoryUrlSuffix } = props;
  const [cookies] = useCookies(['cart']);
  const [drawer, setDrawer] = React.useState(false);
  const toggleDrawer = (value: boolean) => {
    setDrawer(value);
  };

  return (
    <>
      <ClientOnly>
        <NextLink href="/checkout" passHref>
          <Link>
            <IconButton size="large" sx={{ p: 1 }} aria-label="Go to shopping bag">
              {cookies?.cart?.cartItems ? (
                <Badge badgeContent={cookies.cart.cartItems} color="secondary">
                  <ShoppingBagIcon color="primary" sx={{ fontSize: '26px' }} />
                </Badge>
              ) : (
                <ShoppingBagIcon color="primary" sx={{ fontSize: '26px' }} />
              )}
            </IconButton>
          </Link>
        </NextLink>
      </ClientOnly>
      <IconButton
        size="large"
        sx={{ p: 1 }}
        onClick={() => toggleDrawer(true)}
        aria-label="Show menu"
      >
        <MenuIcon color="primary" sx={{ fontSize: '26px' }} />
      </IconButton>
      <Drawer
        anchor="left"
        open={drawer}
        onClose={() => toggleDrawer(false)}
        ModalProps={{
          BackdropComponent: styled(Backdrop, {
            name: 'MuiModal',
            slot: 'Backdrop',
            overridesResolver: (props, styles) => {
              return styles.backdrop;
            },
          })({
            background: 'rgba(0, 0, 0, .02)',
            backdropFilter: 'blur(5px)',
          }),
        }}
      >
        <Box
          sx={{
            height: '100vh',
            p: 3,
            width: 320,
          }}
          role="presentation"
          onClick={() => toggleDrawer(false)}
          onKeyDown={() => toggleDrawer(false)}
        >
          <List>
            {categories?.map(
              (category: CategoryTreeFragment | undefined | null) =>
                category && (
                  <ListItem key={category.id}>
                    <ListItemText>
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
                        <Link>{category.name}</Link>
                      </NextLink>
                    </ListItemText>
                  </ListItem>
                ),
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
