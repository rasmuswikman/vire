import React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

export default function Loading() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: {
          xs: '210px 20px 100px 20px',
          sm: '210px 25px 100px 25px',
          md: '210px 30px 100px 30px',
          lg: '210px 40px 100px 40px',
        },
      }}
    >
      <CircularProgress />
    </Box>
  );
}
