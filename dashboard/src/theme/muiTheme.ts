import { createTheme } from "@mui/material/styles";
import { theme as palette } from "./palette";

export const muiTheme = createTheme({
  palette: {
    primary: {
      main: palette.colors.primary,
      dark: palette.colors.primaryDark,
      contrastText: "#ffffff",
    },
    secondary: {
      main: palette.colors.secondary,
    },
    warning: {
      main: palette.colors.accent,
    },
    background: {
      default: palette.colors.background,
      paper: palette.colors.surface,
    },
    text: {
      primary: palette.colors.text,
      secondary: palette.colors.textLight,
    },
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: palette.colors.primary,
        },
      },
    },
  },
});
