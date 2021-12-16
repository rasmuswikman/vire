import React from "react";
import NextLink from "next/link";
import Image from "next/image";
import { styled } from "@mui/material/styles";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Backdrop from "@mui/material/Backdrop";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import MenuIcon from "@mui/icons-material/Menu";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { useApolloClient } from "@apollo/client";
import PRODUCTS_QUERY from "../queries/products.graphql";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/router";
import { useMainData } from "../lib/main-data";
import Badge from "@mui/material/Badge";
import Price from "./Price";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Button from "@mui/material/Button";
import Fade from "@mui/material/Fade";
import { useTheme } from "@mui/material/styles";

function ClientOnly({ children }) {
  const [hasMounted, setHasMounted] = React.useState(false);
  React.useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) {
    return null;
  }
  return <>{children}</>;
}

export default function Nav({ ...props }) {
  const { mainData } = useMainData();

  const router = useRouter();
  const [drawer, setDrawer] = React.useState(false);

  const toggleDrawer = (value) => {
    setDrawer(value);
  };

  const theme = useTheme();
  const client = useApolloClient();
  const [value, setValue] = React.useState(null);
  const [inputValue, setInputValue] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [productUrlSuffix, setProductUrlSuffix] = React.useState("");
  const loading = open && options.length === 0;

  const clearSearch = (option) => {
    router.push(
      {
        pathname: `/${option.url_key + productUrlSuffix}`,
        query: {
          type: "PRODUCT",
        },
      },
      `/${option.url_key + productUrlSuffix}`
    );
    setOpen(false);
    setValue(null);
    setInputValue("");
    setOptions([]);
  };

  const handleInput = (e) => {
    if (e) {
      const input = e.target.value;
      if (input?.length > 2) {
        setOpen(true);
        (async () => {
          const { data } = await client.query({
            query: PRODUCTS_QUERY,
            fetchPolicy: "no-cache",
            variables: {
              search: input,
              pageSize: 300,
            },
          });
          setProductUrlSuffix(data?.storeConfig.product_url_suffix ?? "");
          setOptions([...data.products.items]);
        })();
      }
    }
  };

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  const [megaMenuAnchorEl, setMegaMenuAnchorEl] = React.useState(null);
  const megaMenuOpen = Boolean(megaMenuAnchorEl);
  const megaMenuHandleClick = (event) => {
    setMegaMenuAnchorEl(event.currentTarget);
  };
  const megaMenuHandleClose = () => {
    setMegaMenuAnchorEl(null);
  };

  return (
    <Box
      sx={{
        maxWidth: "lg",
        width: "100%",
        marginLeft: "auto",
        marginRight: "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexFlow: { xs: "row wrap", sm: "row" },
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
      <Box
        sx={{
          ml: 4,
          flexGrow: { xs: 1, sm: 0 },
          order: { xs: 1, sm: 1 },
          display: { xs: "none", sm: "block" },
        }}
      >
        <Button
          sx={{ color: "primary.main", textTransform: "none" }}
          aria-controls="basic-menu"
          aria-haspopup="true"
          aria-expanded={megaMenuOpen ? "true" : undefined}
          onClick={megaMenuHandleClick}
        >
          <strong>Products</strong>
        </Button>
        <Menu
          PaperProps={{
            style: {
              width: `calc(100vw - ${theme.spacing(4)})`,
              maxWidth: theme.breakpoints.values.lg,
              transform: `translateX(calc(50vw - 50% - ${theme.spacing(2)}))`,
              background: theme.palette.primary.main,
              borderRadius: theme.shape.borderRadius,
            },
          }}
          TransitionComponent={Fade}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          anchorEl={megaMenuAnchorEl}
          open={megaMenuOpen}
          onClose={megaMenuHandleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 5,
            }}
          >
            {props.categories?.map((category) => (
              <Box key={category.id} sx={{ mx: 2 }}>
                <NextLink
                  href={{
                    pathname: `/${category.url_key + props.categoryUrlSuffix}`,
                    query: {
                      type: "CATEGORY",
                    },
                  }}
                  as={`/${category.url_key + props.categoryUrlSuffix}`}
                  passHref
                >
                  <Link
                    color={theme.palette.primary.light}
                    onClick={megaMenuHandleClose}
                  >
                    {category.name}
                  </Link>
                </NextLink>
              </Box>
            ))}
          </Box>
        </Menu>
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          flexBasis: "350px",
          mx: { xs: 0, sm: 6 },
          mt: { xs: 2, sm: 0 },
          order: { xs: 3, sm: 2 },
        }}
      >
        <Autocomplete
          value={value}
          inputValue={inputValue}
          open={open}
          onClose={() => {
            setOpen(false);
          }}
          onChange={(value, option) => {
            clearSearch(option);
          }}
          isOptionEqualToValue={(option, value) => option.name === value.name}
          getOptionLabel={(option) => option.name}
          renderOption={(props, option) => (
            <Box sx={{ display: "flex" }} {...props}>
              <Image
                src={option.thumbnail.url}
                width={62}
                height={77}
                alt={option.thumbnail.label}
              />
              <Box sx={{ ml: 2 }}>
                <Typography variant="h6">{option.name}</Typography>
                <Price {...option.price_range} />
              </Box>
            </Box>
          )}
          options={options}
          loading={loading}
          renderInput={(params) => (
            <TextField
              onChange={(event) => {
                handleInput(event);
                setInputValue(event.target.value);
              }}
              {...params}
              placeholder="What are you looking for?"
              InputProps={{
                ...params.InputProps,
                style: { paddingLeft: "24px" },
                endAdornment: loading && (
                  <CircularProgress color="inherit" size={20} />
                ),
                startAdornment: <SearchIcon sx={{ mr: 1 }} />,
              }}
            />
          )}
        />
      </Box>
      <Box sx={{ order: { xs: 2, sm: 3 }, whiteSpace: "nowrap" }}>
        <ClientOnly>
          <NextLink href="/checkout" passHref>
            <Link>
              <IconButton
                size="large"
                sx={{ p: 1 }}
                aria-label="Go to shopping bag"
              >
                {mainData?.cartItems ? (
                  <Badge badgeContent={mainData.cartItems} color="primary">
                    <ShoppingBagIcon
                      color="primary"
                      sx={{ fontSize: "26px" }}
                    />
                  </Badge>
                ) : (
                  <ShoppingBagIcon color="primary" sx={{ fontSize: "26px" }} />
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
          <MenuIcon color="primary" sx={{ fontSize: "26px" }} />
        </IconButton>
      </Box>
      <Drawer
        anchor="left"
        open={drawer}
        onClose={() => toggleDrawer(false)}
        ModalProps={{
          BackdropComponent: styled(Backdrop, {
            name: "MuiModal",
            slot: "Backdrop",
            overridesResolver: (props, styles) => {
              return styles.backdrop;
            },
          })({
            background: "rgba(0, 0, 0, .02)",
            backdropFilter: "blur(5px)",
          }),
        }}
      >
        <Box
          sx={{
            height: "100vh",
            p: 3,
            width: 320,
          }}
          role="presentation"
          onClick={() => toggleDrawer(false)}
          onKeyDown={() => toggleDrawer(false)}
        >
          <List>
            {props.categories?.map((category) => (
              <ListItem key={category.id}>
                <ListItemText>
                  <NextLink
                    href={{
                      pathname: `/${
                        category.url_key + props.categoryUrlSuffix
                      }`,
                      query: {
                        type: "CATEGORY",
                      },
                    }}
                    as={`/${category.url_key + props.categoryUrlSuffix}`}
                    passHref
                  >
                    <Link>{category.name}</Link>
                  </NextLink>
                </ListItemText>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}
