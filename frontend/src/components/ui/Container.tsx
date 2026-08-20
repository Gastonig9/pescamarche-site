import styled from "styled-components";

interface ContainerProps {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'sm' | 'md' | 'lg';
}

const getMaxWidth = (maxWidth: string = 'lg') => {
  const widths = {
    sm: '640px',
    md: '1024px',
    lg: '1200px',
    xl: '1400px',
    full: '100%',
  };
  return widths[maxWidth as keyof typeof widths] || widths.lg;
};

const getPadding = (padding: string = 'md') => {
  const paddings = {
    sm: '12px',
    md: '20px',
    lg: '32px',
  };
  return paddings[padding as keyof typeof paddings] || paddings.md;
};

export const Container = styled.div<ContainerProps>`
  width: 100%;
  max-width: ${props => getMaxWidth(props.maxWidth)};
  margin: 0 auto;
  padding: 0 ${props => getPadding(props.padding)};
  
  /* Mobile first */
  @media (max-width: 639px) {
    padding: 0 12px;
  }
  
  @media (min-width: 640px) {
    padding: 0 20px;
  }
  
  @media (min-width: 1024px) {
    padding: 0 24px;
  }
  
  @media (min-width: 1280px) {
    padding: 0 32px;
  }
`;

Container.defaultProps = {
  maxWidth: 'lg',
  padding: 'md',
};
