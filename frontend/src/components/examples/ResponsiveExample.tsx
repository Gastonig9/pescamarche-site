/**
 * Ejemplos de componentes responsivos para el frontend
 */

import styled from "styled-components";
import { Container, Grid, Flex, FlexCenter, FlexBetween } from "../ui";
import { responsive } from "../../styles/responsive";
import { useResponsive } from "../../hooks/useResponsive";

// Componentes con Media Queries
const HeroSection = styled.section`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  ${responsive.padding(20, 40, 60)}
  
  h1 {
    ${responsive.fontSize(28, 32, 48)}
    margin-bottom: 20px;
  }
`;

const ProductGrid = styled.div`
  ${responsive.gridCols(1, 2, 3)}
  gap: 16px;
`;

// Componentes Reutilizables
export function ResponsiveContainerExample() {
  return (
    <Container maxWidth="lg" padding="md">
      <h2>Usando Container</h2>
      <p>Contenido con ancho máximo y padding responsive</p>
    </Container>
  );
}

export function ResponsiveGridExample() {
  return (
    <Grid columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} gap="20px">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} style={{
          background: '#f0f0f0',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center',
        }}>
          Item {i}
        </div>
      ))}
    </Grid>
  );
}

export function ResponsiveFlexExample() {
  return (
    <Flex
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      gap="20px"
      wrap={true}
    >
      <div>Elemento 1</div>
      <div>Elemento 2</div>
      <div>Elemento 3</div>
    </Flex>
  );
}

export function ResponsiveFlexCenterExample() {
  return (
    <FlexCenter gap="10px">
      <span>🎨</span>
      <h3>Contenido Centrado</h3>
    </FlexCenter>
  );
}

export function ResponsiveFlexBetweenExample() {
  return (
    <FlexBetween>
      <h3>Título</h3>
      <button>Botón</button>
    </FlexBetween>
  );
}

export function HeroSectionExample() {
  return (
    <HeroSection>
      <h1>Sección Hero Responsiva</h1>
      <p>Ajusta tamaño de fuente y padding según el breakpoint</p>
    </HeroSection>
  );
}

// Componentes con Lógica Responsiva
export function ConditionalRenderExample() {
  const { isMobile, isTablet, isDesktop, currentBreakpoint } = useResponsive();

  return (
    <div>
      <p>Breakpoint actual: <strong>{currentBreakpoint}</strong></p>
      <p>Es móvil: {isMobile ? '✓' : '✗'}</p>
      <p>Es tablet: {isTablet ? '✓' : '✗'}</p>
      <p>Es desktop: {isDesktop ? '✓' : '✗'}</p>

      {isMobile && (
        <div style={{
          background: '#ffeaa7',
          padding: '16px',
          borderRadius: '8px',
          marginTop: '16px',
        }}>
          👨‍💻 Vista optimizada para móvil
        </div>
      )}

      {isDesktop && (
        <div style={{
          background: '#a29bfe',
          padding: '16px',
          borderRadius: '8px',
          marginTop: '16px',
          color: 'white',
        }}>
          🖥️ Vista optimizada para desktop
        </div>
      )}
    </div>
  );
}

export default ResponsiveContainerExample;
