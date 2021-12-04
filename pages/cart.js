import React from "react";
import { useQuery } from "@apollo/client";
import cartQuery from "../queries/cart.graphql";
import { useMainData } from "../lib/main-data";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Link from "next/link";

const Cart = () => {
  const [hasMounted, setHasMounted] = React.useState(false);
  const { mainData } = useMainData();
  const { loading, data } = useQuery(cartQuery, {
    variables: { cartId: mainData.cartId },
    fetchPolicy: "no-cache",
  });

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;
  if (loading && !data) return <div>Loading...</div>;

  return (
    <div>
      {data ? (
        <>
          <Box sx={{ mt: 1, textAlign: "center" }}>
            {data.cart.items.map((item, index) => (
              <div key={index}>
                {`${item.quantity} x ${item.product.name} - ${item.prices.price.value}`}
              </div>
            ))}
          </Box>
          <Box sx={{ mt: 1, textAlign: "center" }}>
            <Link href="/checkout" passHref>
              <Button variant="contained" component="a">
                Checkout
              </Button>
            </Link>
          </Box>
        </>
      ) : (
        <>Cart is empty.</>
      )}
    </div>
  );
};

export default Cart;
