import React from 'react';
import {
  ProductBundleFragment,
  ProductConfigurableFragment,
  ProductDownloadableFragment,
  ProductGroupedFragment,
  ProductSimpleFragment,
  ProductVirtualFragment,
} from '../../../generated/generated-types';
import Image from 'next/image';
import NextLink from 'next/link';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Price from '../Price';

type Props = {
  product:
    | ProductBundleFragment
    | ProductConfigurableFragment
    | ProductDownloadableFragment
    | ProductGroupedFragment
    | ProductSimpleFragment
    | ProductVirtualFragment;
  productUrlSuffix: string;
};

export default function ProductCard(props: Props) {
  const { product, productUrlSuffix } = props;

  return (
    <Card variant="outlined" sx={{ position: 'relative' }}>
      {product.thumbnail?.url && (
        <NextLink
          href={{
            pathname: `/${product.url_key + productUrlSuffix}`,
            query: {
              type: 'PRODUCT',
            },
          }}
          as={`/${product.url_key + productUrlSuffix}`}
          passHref={true}
        >
          <CardActionArea>
            <CardMedia sx={{ p: 3, pb: 1 }}>
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                }}
              >
                <Image
                  src={product.thumbnail.url}
                  alt={product.thumbnail.label ?? 'Product image'}
                  width={320}
                  height={397}
                />
              </div>
            </CardMedia>
            <CardContent sx={{ pb: 3 }}>
              <Typography
                gutterBottom
                component="h4"
                sx={{ fontSize: '0.9rem', fontWeight: 500 }}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: product.name ?? '',
                  }}
                />
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <Price price={product.price_range} />
              </Typography>
            </CardContent>
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                background: '#000',
                opacity: 0.02,
              }}
            ></Box>
          </CardActionArea>
        </NextLink>
      )}
    </Card>
  );
}
