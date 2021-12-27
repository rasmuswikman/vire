import React, { useContext } from 'react';
import {
  ProductsDocument,
  ProductsQuery,
  ProductsQueryVariables,
  ProductBundleFragment,
  ProductConfigurableFragment,
  ProductDownloadableFragment,
  ProductGroupedFragment,
  ProductSimpleFragment,
  ProductVirtualFragment,
} from '../../../generated/generated-types';
import { useQuery } from 'urql';
import Head from 'next/head';
import Image from 'next/image';
import Price from '../Price';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { StoreConfigContext } from '../../lib/StoreConfigContext';
import useAddToCart from '../../lib/useAddToCart';
import Loading from '../Loading';

type Props = {
  urlKey: string;
};

export default function Product(props: Props) {
  const { urlKey } = props;
  const { storeConfig } = useContext(StoreConfigContext);
  const [result] = useQuery<ProductsQuery, ProductsQueryVariables>({
    query: ProductsDocument,
    variables: { filters: { url_key: { eq: urlKey } } },
  });
  const { data, fetching } = result;
  const [loadingCart, setLoadingCart] = React.useState(false);
  const { addToCart } = useAddToCart();
  const handleAddToCart = async () => {
    if (product && product.sku) {
      setLoadingCart(true);
      await addToCart(product?.sku);
      setLoadingCart(false);
    }
  };

  const [productOptions, setProductOptions] = React.useState<Record<string, string>>(
    {},
  );
  const handleChangeProductOptions = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setProductOptions({
      ...productOptions,
      [event.currentTarget.name]: String(event.target.value),
    });
  };

  if (fetching && !data) return <Loading />;

  const product:
    | ProductBundleFragment
    | ProductConfigurableFragment
    | ProductDownloadableFragment
    | ProductGroupedFragment
    | ProductSimpleFragment
    | ProductVirtualFragment
    | null =
    data?.products?.items && data?.products?.items[0]
      ? data?.products?.items[0]
      : null;

  return product ? (
    <Box sx={{ pt: 2 }}>
      <Head>
        <title>
          {product.name} - {storeConfig.default_title}
        </title>
      </Head>
      <Grid
        container
        spacing={0}
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={12} md={5}>
          {product.media_gallery &&
            product.media_gallery[0] &&
            product.media_gallery[0].url && (
              <Box sx={{ position: 'relative' }}>
                <Box sx={{ p: 5 }}>
                  <Image
                    src={product.media_gallery[0].url}
                    width={500}
                    height={620}
                    alt={product.media_gallery[0].label ?? 'product image'}
                  />
                </Box>
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
              </Box>
            )}
        </Grid>
        <Grid item xs={12} md={7}>
          <Box sx={{ pl: 10 }}>
            <Typography gutterBottom variant="h4">
              <div
                dangerouslySetInnerHTML={{
                  __html: product.name ?? '',
                }}
              />
            </Typography>
            <Typography variant="h5">
              <Price price={product.price_range} />
            </Typography>
            {product.__typename === 'ConfigurableProduct' &&
              product.configurable_options &&
              product.configurable_options?.length > 0 &&
              product.configurable_options.map(
                (option) =>
                  option && (
                    <Box key={option.id}>
                      <FormControl component="fieldset">
                        <FormLabel component="legend">{option.label}</FormLabel>
                        <RadioGroup
                          row
                          aria-label={option.label ?? 'product option'}
                          name={option.id}
                          value={productOptions[option.id] ?? null}
                          onChange={handleChangeProductOptions}
                        >
                          {option?.values?.map(
                            (value) =>
                              value && (
                                <FormControlLabel
                                  key={value.id}
                                  value={value.id}
                                  control={<Radio />}
                                  label={value.label ?? 'product label'}
                                />
                              ),
                          )}
                        </RadioGroup>
                      </FormControl>
                    </Box>
                  ),
              )}
            {product.__typename === 'SimpleProduct' && (
              <Box sx={{ my: 3 }}>
                <LoadingButton
                  onClick={handleAddToCart}
                  size="large"
                  variant="contained"
                  disableElevation
                  loading={loadingCart}
                >
                  Add to Basket
                </LoadingButton>
              </Box>
            )}
            {product.description?.html && (
              <Typography variant="body1" component="div">
                <div
                  dangerouslySetInnerHTML={{ __html: product.description.html }}
                />
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  ) : (
    <Box>Not found.</Box>
  );
}
