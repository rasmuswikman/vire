import React from "react";
import { useApolloClient } from "@apollo/client";
import placeOrderMutation from "../queries/placeOrder.graphql";
import { useMainData } from "../lib/main-data";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

const Cart = () => {
  const client = useApolloClient();
  const [hasMounted, setHasMounted] = React.useState(false);
  const [loadingCheckout, setLoadingCheckout] = React.useState(false);
  const { mainData, setMainData } = useMainData();
  const [orderNumber, setOrderNumber] = React.useState(false);
  const [variables, setVariables] = React.useState({});

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

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
        street: "Rantakatu 2",
        city: "Vaasa",
        postcode: "65100",
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
    <div>
      {orderNumber ? (
        <div>Thank you for your order {orderNumber}!</div>
      ) : (
        <>
          <Box sx={{ mt: 1, textAlign: "center" }}>
          <TextField
              sx={{ mt: 1, width: "100%" }}
              onChange={(event) => onChangeVariables(event)}
              name="email"
              placeholder="E-mail"
              required={true}
            />
            <TextField
              sx={{ mt: 1, width: "100%" }}
              onChange={(event) => onChangeVariables(event)}
              name="firstname"
              placeholder="Firstname"
              required={true}
            />
            <TextField
              sx={{ mt: 1, width: "100%" }}
              onChange={(event) => onChangeVariables(event)}
              name="lastname"
              placeholder="Lastname"
              required={true}
            />
          </Box>
          <Box sx={{ mt: 1, textAlign: "center" }}>
            <Button
              variant="contained"
              onClick={checkout}
              disabled={loadingCheckout}
            >
              {loadingCheckout ? "Placing order..." : "Place order"}
            </Button>
          </Box>
        </>
      )}
    </div>
  );
};

export default Cart;
