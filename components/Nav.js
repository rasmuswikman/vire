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
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { useApolloClient } from "@apollo/client";
import PRODUCTS_QUERY from "../queries/products.graphql";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/router";

export default function Nav({ ...props }) {
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
        pathname: "_url-resolver",
        query: {
          pathname: `/${option.url_key + productUrlSuffix}`,
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
          xs: "30px 20px 15px 20px",
          sm: "30px 25px 15px 25px",
          md: "30px 30px 15px 30px",
          lg: "30px 40px 15px 40px",
        },
        borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(10px)",
      }}
    >
      <Toolbar
        sx={{ mr: { xs: 0, sm: -1 }, flexFlow: { xs: "row wrap", sm: "row" } }}
        disableGutters
      >
        <Box sx={{ flexGrow: { xs: 1, sm: 0 }, order: { xs: 1, sm: 1 } }}>
          <Link href="/">
            <a>
              <Image src="/logo.svg" alt="Store logo" width={90} height={30} />
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
            isOptionEqualToValue={(option, value) => option.name === value.name}
            getOptionLabel={(option) => option.name}
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                {option.name}
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
                  endAdornment: (
                    <React.Fragment>
                      {loading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : (
                        <SearchIcon />
                      )}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
              />
            )}
          />
        </Box>
        <Box sx={{ order: { xs: 2, sm: 3 }, whiteSpace: "nowrap" }}>
          <IconButton size="large" sx={{ p: "8px" }} aria-label="Go to account">
            <AccountCircleIcon sx={{ fontSize: "26px", color: "#333" }} />
          </IconButton>
          <IconButton
            size="large"
            sx={{ p: "8px" }}
            aria-label="Go to shopping bag"
          >
            <ShoppingBagIcon sx={{ fontSize: "26px", color: "#333" }} />
          </IconButton>
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
              background: "rgba(0, 0, 0, 0.03)",
              backdropFilter: "blur(10px)",
            }),
          }}
        >
          <Box
            sx={{
              height: "100vh",
              p: 3,
              width: 280,
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
                        pathname: "_url-resolver",
                        query: {
                          pathname: `/${
                            category.url_key + props.categoryUrlSuffix
                          }`,
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
      </Toolbar>
    </AppBar>
  );
}
