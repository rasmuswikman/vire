import React from "react";
import { useApolloClient, useQuery } from "@apollo/client";
import cartQuery from "../queries/cart.graphql";
import placeOrderMutation from "../queries/placeOrder.graphql";
import { useMainData } from "../lib/main-data";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import Loading from "../components/Loading";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

const Cart = () => {
  const client = useApolloClient();
  const [hasMounted, setHasMounted] = React.useState(false);
  const [orderNumber, setOrderNumber] = React.useState(false);
  const [loadingCheckout, setLoadingCheckout] = React.useState(false);
  const [variables, setVariables] = React.useState({
    email: "firstname.lastname@example.com",
    firstname: "Firstname",
    lastname: "Lastname",
  });
  const { mainData, setMainData } = useMainData();
  const { loading, data } = useQuery(cartQuery, {
    variables: { cartId: mainData.cartId },
    fetchPolicy: "no-cache",
  });

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;
  if (loading && !data) return <Loading />;

  const onChangeVariables = (event) => {
    const obj = {};
    obj[event.target.name] = event.target.value;
    setVariables({ ...variables, ...obj });
  };

  const checkout = async () => {
    setLoadingCheckout(true);
    let cartId = mainData.cartId;
    const { data } = await client.query({
      query: placeOrderMutation,
      fetchPolicy: "no-cache",
      variables: {
        cartId,
        email: variables.email,
        firstname: variables.firstname,
        lastname: variables.lastname,
        telephone: "0123456789",
        street: "Street Address",
        city: "City",
        postcode: "00000",
        country_code: "FI",
        carrier_code: "flatrate",
        method_code: "flatrate",
        payment_method_code: "checkmo",
      },
    });
    setMainData({});
    setOrderNumber(data.placeOrder.order.order_number);
    setLoadingCheckout(false);
  };

  return (
    <Box
      sx={{
        background: "#fff",
        maxWidth: "1200px",
        marginLeft: "auto",
        marginRight: "auto",
        padding: {
          xs: "210px 20px 100px 20px",
          sm: "210px 25px 100px 25px",
          md: "210px 30px 100px 30px",
          lg: "210px 40px 100px 40px",
        },
      }}
    >
      {orderNumber ? (
        <Box sx={{ textAlign: "center" }}>
          <Typography gutterBottom variant="h5">
            Thank you for your order!
          </Typography>
          <Typography variant="subtitle1">
            Order number: {orderNumber}
          </Typography>
        </Box>
      ) : data ? (
        <>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="flex-start"
            spacing={8}
            sx={{ mt: "-100px" }}
          >
            <Grid item xs={4}>
              <Typography gutterBottom variant="h5">
                Shopping bag
              </Typography>
              {data.cart.items.map((item, index) => (
                <div key={index}>
                  {`${item.quantity} x ${item.product.name} - ${item.prices.price.value}`}
                </div>
              ))}
            </Grid>
            <Grid item xs={4}>
              <Typography gutterBottom variant="h5">
                Contact details
              </Typography>
              <TextField
                size="small"
                sx={{ mt: 1, width: "100%" }}
                onChange={(event) => onChangeVariables(event)}
                name="email"
                placeholder="E-mail"
                defaultValue="firstname.lastname@example.com"
                required={true}
              />
              <TextField
                size="small"
                sx={{ mt: 1, width: "100%" }}
                onChange={(event) => onChangeVariables(event)}
                name="firstname"
                placeholder="Firstname"
                defaultValue="Firstname"
                required={true}
              />
              <TextField
                size="small"
                sx={{ mt: 1, width: "100%" }}
                onChange={(event) => onChangeVariables(event)}
                name="lastname"
                placeholder="Lastname"
                defaultValue="Lastname"
                required={true}
              />
              ...
            </Grid>
            <Grid item xs={4}>
              <Typography gutterBottom variant="h5">
                Shipping & payment
              </Typography>
              ...
            </Grid>
          </Grid>
          <Box sx={{ mt: 10, textAlign: "center" }}>
            <LoadingButton
              onClick={checkout}
              size="large"
              variant="contained"
              disableElevation
              loading={loadingCheckout}
            >
              Place order
            </LoadingButton>
          </Box>
        </>
      ) : (
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h5">Your shopping bag is empty.</Typography>
        </Box>
      )}
    </Box>
  );
};

export default Cart;
