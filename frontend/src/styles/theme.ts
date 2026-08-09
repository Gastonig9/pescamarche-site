export const theme = {
  colors: {
    primary: "#0b4f6c",
    secondary: "#01baef",
    accent: "#fbb13c",
    background: "#f7f9fa",
    surface: "#ffffff",
    text: "#1c2b33",
    textLight: "#5a6b73",
    border: "#e1e6e8",
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
