import { createTheme } from '@mui/material/styles';

let theme = createTheme({
  typography: {
    fontFamily: ['Inter', 'sans-serif'].join(','),
  },
  palette: {
    primary: {
      main: '#111',
      light: '#fafafa',
    },
    secondary: {
      main: '#FD4401',
    },
  },
  shape: {
    borderRadius: 25,
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

theme = createTheme(theme, {
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: 'none',
          textAlign: 'center',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          textTransform: 'none',
          borderRadius: theme.shape.borderRadius,
          padding: theme.spacing(1, 2),
          [theme.breakpoints.up('md')]: {
            padding: theme.spacing(1, 3),
          },
          '&:hover': {
            boxShadow: 'none',
          },
          '&:active': {
            boxShadow: 'none',
          },
        },
        contained: {
          color: '#fff',
          fontWeight: '500',
          backgroundColor: theme.palette.secondary.main,
          backgroundImage:
            'linear-gradient(145deg, rgba(255,122,0,1) 0%, rgba(250,15,0,1) 100%)',
          '&:hover': {
            color: theme.palette.secondary.main,
            background: theme.palette.primary.light,
          },
          '&:active': {
            color: theme.palette.secondary.main,
            background: theme.palette.primary.light,
          },
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: theme.shape.borderRadius,
          background: theme.palette.primary.light,
        },
        notchedOutline: {
          border: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        elevation: {
          boxShadow: 'none',
        },
        elevation0: {
          boxShadow: 'none',
        },
      },
    },
  },
});

export default theme;
