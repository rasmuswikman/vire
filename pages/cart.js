import React from "react";
import { useQuery } from "@apollo/client";
import { initializeApollo } from "../lib/apollo-client";
import CART_QUERY from "../queries/cart.graphql";
import { getCookie } from "cookies-next";
import { useMainData } from "../lib/main-data";

const Cart = () => {
  const [hasMounted, setHasMounted] = React.useState(false);

  const { mainData } = useMainData();
  const { loading, data } = useQuery(CART_QUERY, {
    variables: { cartId: mainData.cartId },
  });

  React.useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) {
    return null;
  }

  if (loading && !data) return <div>Loading...</div>;

  return (
    <div>
      {data.cart.items.map((item, index) => (
        <div key={index}>
          {item.quantity}x - {item.product.name} - {item.prices.price.value}
        </div>
      ))}
    </div>
  );
};

export default Cart;

export async function getServerSideProps({ req, res }) {
  const mainData = JSON.parse(getCookie("mainData", { req, res }));
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: CART_QUERY,
    variables: { cartId: mainData.cartId },
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  };
}
