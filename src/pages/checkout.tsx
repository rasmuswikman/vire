import React from 'react';
import {
  useCartQuery,
  SetBillingAddressOnCartDocument,
} from '../../generated/generated-types';
import { useCookies } from 'react-cookie';
import { useApolloClient } from '@apollo/client';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import Loading from '../components/Loading';

const Cart = () => {
  const client = useApolloClient();
  const [hasMounted, setHasMounted] = React.useState(false);
  const [orderNumber, setOrderNumber] = React.useState(false);
  const [loadingCheckout, setLoadingCheckout] = React.useState(false);
  const [variables, setVariables] = React.useState({
    email: 'firstname.lastname@example.com',
    firstname: 'Firstname',
    lastname: 'Lastname',
    telephone: '0123456789',
    street: 'Street Address',
    city: 'City',
    postcode: '00000',
    country_code: 'FI',
  });
  const [cookies, setCookie] = useCookies(['cart']);
  const { loading, data } = useCartQuery({
    variables: { cartId: cookies.cart?.cartId },
    fetchPolicy: 'no-cache',
    context: {
      fetchOptions: {
        method: 'POST',
      },
    },
  });

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  const onChangeVariables = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setVariables({
      ...variables,
      [event.currentTarget.name]: String(event.target.value),
    });
  };

  const checkout = async () => {
    setLoadingCheckout(true);
    const cartId = cookies.cart?.cartId;
    const { data } = await client.query({
      query: SetBillingAddressOnCartDocument,
      fetchPolicy: 'no-cache',
      variables: {
        cartId,
        email: variables.email,
        firstname: variables.firstname,
        lastname: variables.lastname,
        telephone: variables.telephone,
        street: variables.street,
        city: variables.city,
        postcode: variables.postcode,
        country_code: variables.country_code,
        carrier_code: 'flatrate',
        method_code: 'flatrate',
        payment_method_code: 'checkmo',
      },
    });
    setCookie('cart', {});
    setLoadingCheckout(false);
    setOrderNumber(data.placeOrder.order.order_number);
  };

  if (!hasMounted) return null;
  if (loading && !data) return <Loading />;

  return (
    <Box
      sx={{
        background: '#fff',
        maxWidth: 'lg',
        mx: 'auto',
        py: 10,
      }}
    >
      {orderNumber ? (
        <Box sx={{ textAlign: 'center' }}>
          <Typography gutterBottom variant="h5">
            Thank you for your order!
          </Typography>
          <Typography variant="subtitle1">Order number: {orderNumber}</Typography>
        </Box>
      ) : data ? (
        <Box sx={{ display: 'flex' }}>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="flex-start"
            spacing={5}
          >
            <Grid item md={4}>
              <Typography gutterBottom variant="h5">
                Shopping bag
              </Typography>
              {data.cart?.items &&
                data.cart.items.map(
                  (item) =>
                    item && (
                      <div key={item.id}>
                        {`${item.quantity} x ${item.product.name} - ${
                          item.prices?.price.value ?? null
                        }`}
                      </div>
                    ),
                )}
            </Grid>
            <Grid item md={4}>
              <Typography gutterBottom variant="h5">
                Contact details
              </Typography>
              <TextField
                size="small"
                sx={{ mt: 1, width: '100%' }}
                onChange={(event) => onChangeVariables(event)}
                name="email"
                placeholder="E-mail"
                defaultValue="firstname.lastname@example.com"
                required={true}
              />
              <TextField
                size="small"
                sx={{ mt: 1, width: '100%' }}
                onChange={(event) => onChangeVariables(event)}
                name="firstname"
                placeholder="Firstname"
                defaultValue="Firstname"
                required={true}
              />
              <TextField
                size="small"
                sx={{ mt: 1, width: '100%' }}
                onChange={(event) => onChangeVariables(event)}
                name="lastname"
                placeholder="Lastname"
                defaultValue="Lastname"
                required={true}
              />
              ...
            </Grid>
            <Grid item md={4}>
              <Typography gutterBottom variant="h5">
                Shipping & payment
              </Typography>
              <Box>Checkmo</Box>
            </Grid>
            <Grid item md={12}>
              <Box sx={{ mt: 10, textAlign: 'center' }}>
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
            </Grid>
          </Grid>
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5">Your shopping bag is empty.</Typography>
        </Box>
      )}
    </Box>
  );
};

export default Cart;
