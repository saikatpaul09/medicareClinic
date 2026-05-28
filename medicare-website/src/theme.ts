import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#165d59",
    },
    secondary: {
      main: "#2563eb",
    },
    success: {
      main: "#16a34a",
    },
    error: {
      main: "#dc2626",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
});

export default theme;
