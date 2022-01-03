import React from 'react';
import { PriceRangeFragment } from '../../generated/types';

type Props = {
  price: PriceRangeFragment;
};

export default function Price(props: Props) {
  const { price } = props;

  const currency = price.minimum_price.regular_price.currency || 'USD';

  const formattedPrice = price?.minimum_price?.regular_price?.value?.toLocaleString(
    'en-US',
    {
      style: 'currency',
      currency,
    },
  );

  const discount = price?.minimum_price?.discount?.amount_off
    ? price.minimum_price.discount.amount_off.toLocaleString('en-US', {
        style: 'currency',
        currency,
      })
    : null;

  return (
    <span>
      {formattedPrice} {discount && <span>({discount} OFF)</span>}
    </span>
  );
}
