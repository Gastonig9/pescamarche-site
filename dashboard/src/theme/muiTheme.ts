import { createTheme } from "@mui/material/styles";
import { theme as palette } from "./palette";

export const muiTheme = createTheme({
  // Breakpoints responsivos personalizados
  breakpoints: {
    values: {
      xs: 0,      // Mobile
      sm: 640,    // Tablet pequeño
      md: 1024,   // Tablet grande
      lg: 1280,   // Desktop
      xl: 1536,   // Desktop grande
    },
  },
  
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
    // Títulos responsivos
    h1: {
      fontSize: "28px",
      "@media (min-width:640px)": {
        fontSize: "32px",
      },
      "@media (min-width:1024px)": {
        fontSize: "36px",
      },
    },
    h2: {
      fontSize: "24px",
      "@media (min-width:640px)": {
        fontSize: "28px",
      },
      "@media (min-width:1024px)": {
        fontSize: "32px",
      },
    },
    h3: {
      fontSize: "20px",
      "@media (min-width:640px)": {
        fontSize: "24px",
      },
      "@media (min-width:1024px)": {
        fontSize: "28px",
      },
    },
  },
  
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: palette.colors.primary,
        },
      },
    },
    
    // Hacer los inputs completamente responsivos
    MuiTextField: {
      styleOverrides: {
        root: {
          width: "100%",
        },
      },
    },
    
    // Buttons responsivos
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontSize: "14px",
          "@media (min-width:640px)": {
            fontSize: "16px",
          },
        },
      },
    },
    
    // Data Grid responsive
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: "none",
          "& .MuiDataGrid-cell": {
            fontSize: "12px",
            "@media (min-width:640px)": {
              fontSize: "14px",
            },
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontSize: "12px",
            fontWeight: "600",
            "@media (min-width:640px)": {
              fontSize: "14px",
            },
          },
        },
      },
    },
    
    // Table responsiva
    MuiTable: {
      styleOverrides: {
        root: {
          fontSize: "12px",
          "@media (min-width:640px)": {
            fontSize: "14px",
          },
        },
      },
    },
    
    // Paper/Card responsive
    MuiPaper: {
      styleOverrides: {
        root: {
          padding: "16px",
          "@media (min-width:640px)": {
            padding: "20px",
          },
          "@media (min-width:1024px)": {
            padding: "24px",
          },
        },
      },
    },
    
    // Dialog responsive
    MuiDialog: {
      styleOverrides: {
        paper: {
          margin: "16px",
          "@media (min-width:640px)": {
            margin: "32px",
          },
        },
      },
    },
  },
});
