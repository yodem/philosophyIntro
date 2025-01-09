import { createTheme } from "@mui/material/styles";

export const getTheme = (mode: "light" | "dark", direction: "ltr" | "rtl") =>
  createTheme({
    direction,
    palette: {
      mode,
    },
  });
