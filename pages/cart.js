import React from "react";
import { useApolloClient, useQuery } from "@apollo/client";
import cartQuery from "../queries/cart.graphql";
import placeOrderMutation from "../queries/placeOrder.graphql";
import { useMainData } from "../lib/main-data";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

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
  if (loading && !data) return <div>Loading...</div>;

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
    <div>
      {orderNumber ? (
        <div>Thank you for your order {orderNumber}!</div>
      ) : data ? (
        <>
          <Box sx={{ mt: 1, textAlign: "center" }}>
            {data.cart.items.map((item, index) => (
              <div key={index}>
                {`${item.quantity} x ${item.product.name} - ${item.prices.price.value}`}
              </div>
            ))}
          </Box>
          <Box sx={{ mt: 1, textAlign: "center" }}>
            <TextField
              sx={{ mt: 1, width: "100%" }}
              onChange={(event) => onChangeVariables(event)}
              name="email"
              placeholder="E-mail"
              defaultValue="firstname.lastname@example.com"
              required={true}
            />
            <TextField
              sx={{ mt: 1, width: "100%" }}
              onChange={(event) => onChangeVariables(event)}
              name="firstname"
              placeholder="Firstname"
              defaultValue="Firstname"
              required={true}
            />
            <TextField
              sx={{ mt: 1, width: "100%" }}
              onChange={(event) => onChangeVariables(event)}
              name="lastname"
              placeholder="Lastname"
              defaultValue="Lastname"
              required={true}
            />
          </Box>
          <Box sx={{ mt: 1, textAlign: "center" }}>
            <LoadingButton
              color="success"
              onClick={checkout}
              size="large"
              variant="contained"
              disableElevation
              loading={loadingCheckout}
              endIcon={<KeyboardArrowRightIcon />}
              loadingPosition="end"
            >
              Place order
            </LoadingButton>
          </Box>
        </>
      ) : (
        <>Cart is empty.</>
      )}
    </div>
  );
};

export default Cart;
