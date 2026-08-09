import { Link } from "react-router-dom";
import styled from "styled-components";

const StyledHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: #fff;
`;

const Brand = styled(Link)`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1.5rem;
  font-weight: 700;
  text-decoration: none;
  color: #fff;
`;

const Nav = styled.nav`
  display: flex;
  gap: 1.5rem;
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: #fff;
  font-weight: 500;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

export function Header() {
  return (
    <StyledHeader>
      <Brand to="/">🎣 Pesca Marché</Brand>
      <Nav>
        <NavLink to="/">Inicio</NavLink>
        <NavLink to="/productos">Productos</NavLink>
      </Nav>
    </StyledHeader>
  );
}
