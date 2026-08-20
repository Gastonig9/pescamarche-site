import styled from "styled-components";

interface FlexProps {
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  justifyContent?: string;
  alignItems?: string;
  gap?: string | number;
  wrap?: boolean;
  flex?: number | string;
}

export const Flex = styled.div<FlexProps>`
  display: flex;
  flex-direction: ${props => props.direction || 'row'};
  justify-content: ${props => props.justifyContent || 'flex-start'};
  align-items: ${props => props.alignItems || 'stretch'};
  gap: ${props => typeof props.gap === 'number' ? `${props.gap}px` : props.gap || '0'};
  flex-wrap: ${props => props.wrap ? 'wrap' : 'nowrap'};
  flex: ${props => props.flex || 'auto'};
  
  /* Responsive por defecto: cambiar a column en móvil */
  @media (max-width: 639px) {
    flex-direction: ${props => {
      const isRow = props.direction === 'row' || !props.direction;
      return isRow ? 'column' : props.direction;
    }};
  }
`;

Flex.defaultProps = {
  direction: 'row',
  justifyContent: 'flex-start',
  alignItems: 'stretch',
  gap: '0',
  wrap: false,
};

// Alias útiles
export const FlexCenter = styled(Flex)`
  justify-content: center;
  align-items: center;
`;

export const FlexBetween = styled(Flex)`
  justify-content: space-between;
  align-items: center;
`;

export const FlexColumn = styled(Flex)`
  flex-direction: column;
`;
