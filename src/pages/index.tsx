import type { NextPage } from 'next';
import NextLink from 'next/link';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const Home: NextPage = () => {
  return (
    <Box sx={{ bgcolor: '#111' }}>
      <Box
        sx={{
          py: 19,
          maxWidth: 'lg',
          mx: 'auto',
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontWeight: '400',
            fontSize: '6rem',
            background: '#fff',
            backgroundImage:
              'linear-gradient(145deg, rgba(144,97,224,1) 0%, rgba(166,252,252,1) 100%)',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-5px',
          }}
        >
          MUI, Next.js &amp;
          <br /> Adobe Commerce
        </Typography>
        <Typography
          variant="h1"
          sx={{
            mt: 5,
            fontWeight: '400',
            fontSize: '3rem',
            letterSpacing: '-1px',
          }}
        >
          <NextLink href="https://github.com/rasmuswikman/vire-storefront" passHref>
            <Link
              underline="none"
              sx={{
                color: '#fff',
              }}
            >
              Version 1
            </Link>
          </NextLink>
        </Typography>
      </Box>
    </Box>
  );
};

export default Home;
