import { createTheme } from "@mui/material/styles";

let theme = createTheme({
  typography: {
    fontFamily: ["Inter", "sans-serif"].join(","),
  },
  palette: {
    primary: {
      main: "#333",
      light: "#f1f1f1",
      ultralight: "#fafafa",
    },
    secondary: {
      main: "#AFE8F6",
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
      lg: 1100,
      xl: 1536,
    },
  },
});

theme = createTheme(theme, {
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: theme.shape.borderRadius,
          border: `1px solid ${theme.palette.primary.light}`,
          textAlign: "center",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          textTransform: "none",
          borderRadius: theme.shape.borderRadius,
          padding: theme.spacing(1, 2),
          [theme.breakpoints.up("md")]: {
            padding: theme.spacing(1, 3),
          },
          "&:hover": {
            boxShadow: "none",
          },
          "&:active": {
            boxShadow: "none",
          },
        },
        contained: {
          color: theme.palette.primary.main,
          background: theme.palette.primary.light,
          "&:hover": {
            color: theme.palette.primary.light,
            background: theme.palette.primary.main,
          },
          "&:active": {
            color: theme.palette.primary.light,
            background: theme.palette.primary.main,
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
          border: "none",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        elevation: {
          boxShadow: "none",
        },
        elevation0: {
          boxShadow: "none",
        },
      },
    },
  },
});

export default theme;
