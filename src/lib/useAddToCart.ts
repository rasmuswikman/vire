import {
  CreateEmptyCartDocument,
  AddProductsToCartDocument,
} from '../../generated/generated-types';
import { useCookies } from 'react-cookie';
import { useClient } from 'urql';
import { useRouter } from 'next/router';

const useAddToCart = () => {
  const client = useClient();
  const router = useRouter();
  const [cookies, setCookie] = useCookies(['cart']);
  const addToCart = async (sku: string) => {
    let cartId = cookies.cart?.cartId;
    if (typeof cartId === 'undefined') {
      const { data } = await client.mutation(CreateEmptyCartDocument).toPromise();
      cartId = data.createEmptyCart;
    }
    const { data } = await client
      .mutation(AddProductsToCartDocument, {
        cartId,
        cartItem: {
          quantity: 1,
          sku,
        },
      })
      .toPromise();
    setCookie('cart', {
      ...cookies.cart,
      ...{ cartId, cartItems: data.addProductsToCart.cart.total_quantity },
    });
    router.push('/checkout');
  };

  return { addToCart };
};

export default useAddToCart;
