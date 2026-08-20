import { useEffect, useState } from 'react';
import { breakpoints, type Breakpoint } from '../styles/responsive';

/**
 * Hook para detectar breakpoint actual
 * Útil para lógica condicional basada en tamaño de pantalla
 */
export function useResponsive() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>('xs');
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 0
  );

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);

      // Determinar breakpoint actual
      if (width < breakpoints.sm) {
        setCurrentBreakpoint('xs');
        setIsMobile(true);
        setIsTablet(false);
        setIsDesktop(false);
      } else if (width < breakpoints.md) {
        setCurrentBreakpoint('sm');
        setIsMobile(false);
        setIsTablet(true);
        setIsDesktop(false);
      } else if (width < breakpoints.lg) {
        setCurrentBreakpoint('md');
        setIsMobile(false);
        setIsTablet(true);
        setIsDesktop(false);
      } else if (width < breakpoints.xl) {
        setCurrentBreakpoint('lg');
        setIsMobile(false);
        setIsTablet(false);
        setIsDesktop(true);
      } else {
        setCurrentBreakpoint('xl');
        setIsMobile(false);
        setIsTablet(false);
        setIsDesktop(true);
      }
    };

    // Ejecutar una vez al montar
    handleResize();

    // Agregar listener con debounce
    let timeoutId: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 150);
    };

    window.addEventListener('resize', debouncedResize);

    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return {
    isMobile,
    isTablet,
    isDesktop,
    currentBreakpoint,
    windowWidth,
    // Helpers adicionales
    isSmallDevice: isMobile || isTablet,
    isLargeDevice: isDesktop,
  };
}

/**
 * Hook para valores responsive
 * Uso: const padding = useResponsiveValue({ xs: 8, md: 16, lg: 24 })
 */
export function useResponsiveValue<T>(
  values: Partial<Record<Breakpoint, T>>
): T | undefined {
  const { currentBreakpoint } = useResponsive();
  
  // Buscar el valor más cercano para el breakpoint actual
  const breakpointOrder: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl'];
  const currentIndex = breakpointOrder.indexOf(currentBreakpoint);
  
  for (let i = currentIndex; i >= 0; i--) {
    const bp = breakpointOrder[i];
    if (values[bp] !== undefined) {
      return values[bp];
    }
  }
  
  return undefined;
}

/**
 * Hook personalizado para lógica que depende del breakpoint
 * Uso: const showDesktopMenu = useMediaQuery('(min-width: 1024px)')
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}
