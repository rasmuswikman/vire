import { useApolloClient } from "@apollo/client";
import { useRouter } from "next/router";
import { useMainData } from "./main-data";
import createEmptyCartMutation from "../queries/createEmptyCart.graphql";
import addProductsToCartMutation from "../queries/addProductsToCart.graphql";

const useAddToCart = () => {
  const client = useApolloClient();
  const router = useRouter();
  const { mainData, setMainData } = useMainData();
  const addToCart = async (sku) => {
    let cartId = mainData.cartId;
    if (typeof mainData.cartId === "undefined") {
      const { data } = await client.query({
        query: createEmptyCartMutation,
        fetchPolicy: "no-cache",
      });
      cartId = data.createEmptyCart;
    }
    const { data } = await client.query({
      query: addProductsToCartMutation,
      fetchPolicy: "no-cache",
      variables: {
        cartId,
        cartItem: {
          quantity: 1,
          sku,
        },
      },
    });
    setMainData({
      ...mainData,
      ...{ cartId, cartItems: data.addProductsToCart.cart.total_quantity },
    });
    router.push("/checkout");
  };

  return { addToCart };
};

export default useAddToCart;
