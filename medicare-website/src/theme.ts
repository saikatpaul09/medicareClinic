import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#165d59",
      light: "#0d9488",
    },
    secondary: {
      main: "#2563eb",
      light: "#eff6ff",
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
