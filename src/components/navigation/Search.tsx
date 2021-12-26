import React from 'react';
import { useClient } from 'urql';
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
import { useRouter } from 'next/router';
import Image from 'next/image';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import SearchIcon from '@mui/icons-material/Search';
import Typography from '@mui/material/Typography';
import Price from '../Price';

type Props = {
  productUrlSuffix: string;
};

export default function Search(props: Props) {
  const { productUrlSuffix } = props;
  const router = useRouter();
  const client = useClient();
  const [value, setValue] = React.useState(null);
  const [inputValue, setInputValue] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<
    Array<
      | ProductBundleFragment
      | ProductConfigurableFragment
      | ProductDownloadableFragment
      | ProductGroupedFragment
      | ProductSimpleFragment
      | ProductVirtualFragment
      | null
      | undefined
    >
  >([]);
  const loading = open && options?.length === 0;

  const clearSearch = (
    option:
      | ProductBundleFragment
      | ProductConfigurableFragment
      | ProductDownloadableFragment
      | ProductGroupedFragment
      | ProductSimpleFragment
      | ProductVirtualFragment
      | null
      | undefined,
  ) => {
    if (option) {
      router.push(
        {
          pathname: `/${option.url_key + productUrlSuffix}`,
          query: {
            type: 'PRODUCT',
          },
        },
        `/${option.url_key + productUrlSuffix}`,
      );
      setOpen(false);
      setValue(null);
      setInputValue('');
      setOptions([]);
    }
  };

  const handleInput = (
    e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setInputValue(e.currentTarget.value);
    if (e) {
      const input = e.currentTarget.value;
      if (input?.length > 2) {
        setOpen(true);
        (async () => {
          const { data } = await client
            .query<ProductsQuery, ProductsQueryVariables>(
              ProductsDocument,
              {
                search: input,
                pageSize: 300,
              },
              {
                requestPolicy: 'network-only',
              },
            )
            .toPromise();
          const items = data?.products?.items ?? [];
          setOptions([...items]);
        })();
      }
    }
  };

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <Autocomplete
      clearOnBlur
      clearOnEscape
      value={value}
      inputValue={inputValue}
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      onChange={(event, value) => {
        clearSearch(value);
      }}
      isOptionEqualToValue={(option, value) =>
        option && value && option.name === value.name ? true : false
      }
      getOptionLabel={(option) => option?.name ?? ''}
      renderOption={(props, option) =>
        option && (
          <li {...props}>
            <Box sx={{ display: 'flex' }}>
              {option?.thumbnail?.url && (
                <Image
                  src={option.thumbnail.url}
                  width={62}
                  height={77}
                  alt={option.thumbnail.label ?? 'Product image'}
                />
              )}
              <Box sx={{ ml: 2 }}>
                <Typography variant="h6">{option.name}</Typography>
                <Price price={option.price_range} />
              </Box>
            </Box>
          </li>
        )
      }
      options={options}
      loading={loading}
      renderInput={(params) => (
        <TextField
          placeholder="What are you looking for?"
          onChange={(event) => {
            handleInput(event);
          }}
          {...params}
          InputProps={{
            ...params.InputProps,
            style: { paddingLeft: '16px' },
            endAdornment: loading && <CircularProgress color="inherit" size={20} />,
            startAdornment: <SearchIcon sx={{ mr: 1 }} />,
            size: 'small',
            sx: { fontSize: '0.9rem' },
          }}
        />
      )}
    />
  );
}
