import { createTheme } from "@mui/material/styles";

let theme = createTheme();

theme = createTheme(theme, {
  typography: {
    fontFamily: ["Inter", "sans-serif"].join(","),
    fontWeightLight: 300,
  },
  palette: {
    primary: {
      main: "#219EBC",
    },
    success: {
      main: "#3CB731",
    },
  },
  components: {
    MuiBadge: {
      styleOverrides: {
        colorSuccess: {
          color: "#fff",
        }
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          color: "#fff",
          boxShadow: "none",
          textTransform: "none",
          borderRadius: "50px",
          padding: "8px 16px",
          [theme.breakpoints.up('md')]: {
            padding: "8px 24px",
          },
          fontWeight: "700",
          "&:hover": {
            boxShadow: "none",
          },
          "&:active": {
            boxShadow: "none",
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
          borderRadius: "50px",
          background: "rgba(0, 0, 0, 0.03)",
        },
        notchedOutline: {
          border: "none",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        elevation: {
          boxShadow: "0px 0px 0px 1px rgba(0, 0, 0, 0.1)",
        },
        elevation0: {
          boxShadow: "none",
        },
      },
    },
  },
});

export default theme;
