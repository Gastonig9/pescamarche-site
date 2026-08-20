import styled from "styled-components";

interface GridProps {
  columns?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: string | number;
  alignItems?: string;
  justifyContent?: string;
}

const getGridColumns = (columns?: GridProps['columns']) => {
  const defaultColumns = {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 4,
  };
  
  return {
    ...defaultColumns,
    ...columns,
  };
};

export const Grid = styled.div<GridProps>`
  display: grid;
  gap: ${props => typeof props.gap === 'number' ? `${props.gap}px` : props.gap || '16px'};
  align-items: ${props => props.alignItems || 'stretch'};
  justify-content: ${props => props.justifyContent || 'stretch'};
  
  ${props => {
    const cols = getGridColumns(props.columns);
    return `
      grid-template-columns: repeat(${cols.xs}, 1fr);
      
      @media (min-width: 640px) {
        grid-template-columns: repeat(${cols.sm}, 1fr);
      }
      
      @media (min-width: 1024px) {
        grid-template-columns: repeat(${cols.md}, 1fr);
      }
      
      @media (min-width: 1280px) {
        grid-template-columns: repeat(${cols.lg}, 1fr);
      }
      
      @media (min-width: 1536px) {
        grid-template-columns: repeat(${cols.xl}, 1fr);
      }
    `;
  }}
  
  /* Para garantizar que los items se adapten */
  > * {
    min-width: 0;
  }
`;

Grid.defaultProps = {
  columns: {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 4,
  },
  gap: '16px',
};
