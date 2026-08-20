import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  /* Reset y estilos base */
  *, *::before, *::after {
    box-sizing: border-box;
  }

  html {
    /* Usar rem relativo a 16px */
    font-size: 16px;
    
    /* Breakpoints */
    @media (min-width: 640px) {
      font-size: 16px;
    }
    
    @media (min-width: 1024px) {
      font-size: 16px;
    }
    
    @media (min-width: 1280px) {
      font-size: 16px;
    }
  }

  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
  }

  body {
    font-family: ${({ theme }) => theme.fonts.base};
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    
    /* Scroll behavior suave */
    scroll-behavior: smooth;
  }

  /* Títulos responsivos */
  h1 {
    font-family: ${({ theme }) => theme.fonts.heading};
    margin: 0;
    font-size: 28px;
    line-height: 1.2;
    
    @media (min-width: 640px) {
      font-size: 32px;
    }
    
    @media (min-width: 1024px) {
      font-size: 36px;
    }
  }

  h2 {
    font-family: ${({ theme }) => theme.fonts.heading};
    margin: 0;
    font-size: 24px;
    line-height: 1.3;
    
    @media (min-width: 640px) {
      font-size: 28px;
    }
    
    @media (min-width: 1024px) {
      font-size: 32px;
    }
  }

  h3 {
    font-family: ${({ theme }) => theme.fonts.heading};
    margin: 0;
    font-size: 20px;
    line-height: 1.3;
    
    @media (min-width: 640px) {
      font-size: 24px;
    }
    
    @media (min-width: 1024px) {
      font-size: 28px;
    }
  }

  h4, h5, h6 {
    font-family: ${({ theme }) => theme.fonts.heading};
    margin: 0;
  }

  /* Enlaces */
  a {
    color: inherit;
    text-decoration: none;
    transition: color 0.2s ease;
    
    &:hover {
      text-decoration: underline;
    }
  }

  /* Imágenes responsivas */
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* Videos y embeds responsivos */
  video,
  iframe {
    max-width: 100%;
    height: auto;
  }

  /* Botones */
  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    background: none;
    padding: 0;
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  /* Inputs y formularios */
  input,
  select,
  textarea {
    font-family: inherit;
    font-size: inherit;
    width: 100%;
  }

  /* Tablas responsivas */
  table {
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    padding: 8px;
    text-align: left;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border || '#e0e0e0'};
  }

  /* Listas */
  ul, ol {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  /* Código */
  code, pre {
    font-family: 'Courier New', monospace;
    background-color: ${({ theme }) => theme.colors.background || '#f5f5f5'};
    padding: 2px 6px;
    border-radius: 3px;
  }

  pre {
    overflow-x: auto;
    padding: 12px;
  }

  /* Scroll personalizado (navegadores modernos) */
  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background || '#f1f1f1'};
  }

  ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 5px;
    
    &:hover {
      background: #555;
    }
  }

  /* Mejoras de accesibilidad */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }

  /* Modo oscuro opcional (future-proof) */
  @media (prefers-color-scheme: dark) {
    body {
      color-scheme: dark;
    }
  }
`;
