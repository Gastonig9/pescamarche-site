/**
 * Breakpoints responsive para toda la aplicación
 * Convención mobile-first
 */

export const breakpoints = {
  xs: 0,      // Mobile
  sm: 640,    // Tablet pequeño
  md: 1024,   // Tablet grande / Laptop pequeño
  lg: 1280,   // Desktop
  xl: 1536,   // Desktop grande
} as const;

export type Breakpoint = keyof typeof breakpoints;

/**
 * Media queries responsive
 * Uso: ${media.sm`css aqui`}
 */
export const media = {
  xs: (styles: string) => `@media (min-width: ${breakpoints.xs}px) { ${styles} }`,
  sm: (styles: string) => `@media (min-width: ${breakpoints.sm}px) { ${styles} }`,
  md: (styles: string) => `@media (min-width: ${breakpoints.md}px) { ${styles} }`,
  lg: (styles: string) => `@media (min-width: ${breakpoints.lg}px) { ${styles} }`,
  xl: (styles: string) => `@media (min-width: ${breakpoints.xl}px) { ${styles} }`,
  
  // También útil para mobile-first: máximo ancho
  maxSm: (styles: string) => `@media (max-width: ${breakpoints.sm - 1}px) { ${styles} }`,
  maxMd: (styles: string) => `@media (max-width: ${breakpoints.md - 1}px) { ${styles} }`,
  maxLg: (styles: string) => `@media (max-width: ${breakpoints.lg - 1}px) { ${styles} }`,
} as const;

/**
 * Espaciado responsive
 * Escala de espacios que ajusta según el breakpoint
 */
export const spacing = {
  xs: 4,      // 0.25rem
  sm: 8,      // 0.5rem
  base: 16,   // 1rem
  md: 24,     // 1.5rem
  lg: 32,     // 2rem
  xl: 48,     // 3rem
  xxl: 64,    // 4rem
} as const;

/**
 * Contenedor máximo para secciones
 */
export const containerWidth = {
  sm: '100%',
  md: '100%',
  lg: '1200px',
  xl: '1400px',
} as const;

/**
 * Función helper para crear estilos responsive
 */
export const responsive = {
  display: (mobile: string, tablet: string, desktop: string) => `
    display: ${mobile};
    ${media.sm(`display: ${tablet};`)}
    ${media.lg(`display: ${desktop};`)}
  `,
  
  padding: (mobile: number, tablet?: number, desktop?: number) => `
    padding: ${mobile}px;
    ${tablet ? media.sm(`padding: ${tablet}px;`) : ''}
    ${desktop ? media.lg(`padding: ${desktop}px;`) : ''}
  `,
  
  fontSize: (mobile: number, tablet?: number, desktop?: number) => `
    font-size: ${mobile}px;
    ${tablet ? media.sm(`font-size: ${tablet}px;`) : ''}
    ${desktop ? media.lg(`font-size: ${desktop}px;`) : ''}
  `,
  
  gridCols: (mobile: number, tablet?: number, desktop?: number) => `
    display: grid;
    grid-template-columns: repeat(${mobile}, 1fr);
    ${tablet ? media.sm(`grid-template-columns: repeat(${tablet}, 1fr);`) : ''}
    ${desktop ? media.lg(`grid-template-columns: repeat(${desktop}, 1fr);`) : ''}
  `,
} as const;
