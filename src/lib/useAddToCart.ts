import {
  CreateEmptyCartDocument,
  AddProductsToCartDocument,
} from '../../generated/generated-types';
import { useCookies } from 'react-cookie';
import { useApolloClient } from '@apollo/client';
import { useRouter } from 'next/router';

const useAddToCart = () => {
  const client = useApolloClient();
  const router = useRouter();
  const [cookies, setCookie] = useCookies(['cart']);
  const addToCart = async (sku: string) => {
    let cartId = cookies.cart?.cartId;
    if (typeof cartId === 'undefined') {
      const { data } = await client.query({
        query: CreateEmptyCartDocument,
        fetchPolicy: 'no-cache',
        context: {
          fetchOptions: {
            method: 'POST',
          },
        },
      });
      cartId = data.createEmptyCart;
    }
    const { data } = await client.query({
      query: AddProductsToCartDocument,
      fetchPolicy: 'no-cache',
      context: {
        fetchOptions: {
          method: 'POST',
        },
      },
      variables: {
        cartId,
        cartItem: {
          quantity: 1,
          sku,
        },
      },
    });
    setCookie('cart', {
      ...cookies.cart,
      ...{ cartId, cartItems: data.addProductsToCart.cart.total_quantity },
    });
    router.push('/checkout');
  };

  return { addToCart };
};

export default useAddToCart;
