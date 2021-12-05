import React from "react";
import Link from "next/link";
import Image from "next/image";
import { styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
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

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: "rgba(255, 255, 255, 0.9)",
        color: "#000",
        padding: {
          xs: "30px 20px 20px 20px",
          sm: "30px 25px 20px 25px",
          md: "30px 30px 20px 30px",
          lg: "30px 40px 20px 40px",
        },
        borderBottom: "1px solid rgba(0, 0, 0, .07)",
        backdropFilter: "blur(10px)",
      }}
    >
      <Toolbar sx={{ mr: { xs: 0, sm: -1 } }} disableGutters>
        <Box
          sx={{
            maxWidth: "1200px",
            width: "100%",
            marginLeft: "auto",
            marginRight: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexFlow: { xs: "row wrap", sm: "row" },
            padding: {
              xs: "0 20px 0 20px",
              sm: "0 25px 0 25px",
              md: "0 30px 0 30px",
              lg: "0 40px 0 40px",
            },
          }}
        >
          <Box sx={{ flexGrow: { xs: 1, sm: 0 }, order: { xs: 1, sm: 1 } }}>
            <Link href="/">
              <a>
                <Image
                  src="/logo.svg"
                  alt="Store logo"
                  width={124}
                  height={33}
                />
              </a>
            </Link>
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
              isOptionEqualToValue={(option, value) =>
                option.name === value.name
              }
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
              <Link href="/cart">
                <a>
                  <IconButton
                    size="large"
                    sx={{ p: "8px" }}
                    aria-label="Go to shopping bag"
                  >
                    {mainData?.cartItems ? (
                      <Badge badgeContent={mainData.cartItems} color="primary">
                        <ShoppingBagIcon
                          sx={{ fontSize: "26px", color: "#333" }}
                        />
                      </Badge>
                    ) : (
                      <ShoppingBagIcon
                        sx={{ fontSize: "26px", color: "#333" }}
                      />
                    )}
                  </IconButton>
                </a>
              </Link>
            </ClientOnly>
            <IconButton
              size="large"
              sx={{ p: "8px" }}
              onClick={() => toggleDrawer(true)}
              aria-label="Show menu"
            >
              <MenuIcon sx={{ fontSize: "26px", color: "#333" }} />
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
                      <Link
                        href={{
                          pathname: `/${
                            category.url_key + props.categoryUrlSuffix
                          }`,
                          query: {
                            type: "CATEGORY",
                          },
                        }}
                        as={`/${category.url_key + props.categoryUrlSuffix}`}
                      >
                        <a>{category.name}</a>
                      </Link>
                    </ListItemText>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Drawer>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
