import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: ["IBM Plex Sans", "sans-serif"].join(","),
    fontWeightLight: 300,
  },
  palette: {
    primary: {
      main: "#333333",
    },
  },
  components: {
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
          background: "rgba(0, 0, 0, 0.07)",
        },
        notchedOutline: {
          border: "none",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        elevation: {
          boxShadow: "0px 0px 0px 3px rgba(0, 0, 0, 0.07)",
        },
        elevation0: {
          boxShadow: "none",
        },
      },
    },
  },
});

export default theme;
