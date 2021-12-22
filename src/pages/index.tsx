import type { NextPage } from 'next';
import NextLink from 'next/link';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

const Home: NextPage = () => {
  return (
    <Box sx={{ bgcolor: '#fafafa', mb: 2, width: '100%' }}>
      <Box
        sx={{
          pt: 19,
          pb: 16,
          maxWidth: 'lg',
          mx: 'auto',
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontWeight: '500',
            fontSize: '5.5rem',
            lineHeight: '5.8rem',
            background: '#fff',
            backgroundImage:
              'linear-gradient(145deg, rgba(255,122,0,1) 0%, rgba(250,15,0,1) 100%)',
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
            mt: 4,
            fontWeight: '400',
            fontSize: '2.3rem',
            letterSpacing: '-1px',
          }}
        >
          ...and a bit of TypeScript.
        </Typography>
        <Button
          sx={{
            mt: 6,
            fontWeight: '500',
            fontSize: '0.9rem',
            border: '1px solid #111',
          }}
        >
          <NextLink href="https://github.com/rasmuswikman/vire-storefront" passHref>
            <Link
              underline="none"
              sx={{
                color: '#111',
                px: 3,
              }}
            >
              Learn more
            </Link>
          </NextLink>
        </Button>
      </Box>
    </Box>
  );
};

export default Home;