export const theme = {
  colors: {
    primary: "#1b2559",
    primaryDark: "#12173d",
    secondary: "#c62828",
    accent: "#f2b705",
    lightBlue: "#dceefb",
    background: "#f5f7fa",
    surface: "#ffffff",
    text: "#1b2559",
    textLight: "#5a6270",
    border: "#e2e6ea",
  },
  fonts: {
    base: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    heading: "'Poppins', 'Segoe UI', sans-serif",
  },
  breakpoints: {
    mobile: "480px",
    tablet: "768px",
    desktop: "1024px",
  },
} as const;

export type AppTheme = typeof theme;
