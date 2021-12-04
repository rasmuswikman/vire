import React from "react";
import { useQuery } from "@apollo/client";
import cartQuery from "../queries/cart.graphql";
import { useMainData } from "../lib/main-data";
import Button from "@mui/material/Button";
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
          {data.cart.items.map((item, index) => (
            <div key={index}>
              {item.quantity} x {item.product.name} - {item.prices.price.value}
            </div>
          ))}
          <Link href="/checkout" passHref>
            <Button variant="contained" component="a">Checkout</Button>
          </Link>
        </>
      ) : (
        <>Cart is empty.</>
      )}
    </div>
  );
};

export default Cart;
