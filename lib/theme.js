import { createTheme } from "@mui/material/styles";

let theme = createTheme({
  typography: {
    fontFamily: ["Inter", "sans-serif"].join(","),
  },
});

theme = createTheme(theme, {
  palette: {
    primary: {
      main: "#333",
    },
    secondary: {
      main: "#AFE8F6",
    },
    success: {
      main: "#3CB731",
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "24px",
          border: "1px solid #eee",
          textAlign: "center",
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        colorSecondary: {
          color: "#333",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          textTransform: "none",
          borderRadius: "50px",
          padding: "8px 16px",
          [theme.breakpoints.up("md")]: {
            padding: "8px 24px",
          },
          "&:hover": {
            boxShadow: "none",
          },
          "&:active": {
            boxShadow: "none",
          },
        },
        contained: {
          color: "#333",
          background: "#eee",
          "&:hover": {
            color: "#fff",
            background: "#333",
          },
          "&:active": {
            color: "#fff",
            background: "#333",
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
          background: "#f6f6f6",
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
