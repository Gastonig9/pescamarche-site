import styled from "styled-components";

const StyledFooter = styled.footer`
  padding: 1.5rem 2rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: #fff;
  text-align: center;
  font-size: 0.9rem;
`;

export function Footer() {
  return (
    <StyledFooter>
      <p>
        © {new Date().getFullYear()} Pesca Marché. Todos los derechos
        reservados.
      </p>
    </StyledFooter>
  );
}
