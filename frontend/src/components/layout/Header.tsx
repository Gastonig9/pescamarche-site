import { useState } from "react";
import { Link, NavLink as RouterNavLink } from "react-router-dom";
import styled from "styled-components";
import logo from "../../assets/pescamarche-logo.png";
import { useAppSelector } from "../../app/hooks";

const StyledHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 2rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: #fff;
  position: sticky;
  top: 0;
  z-index: 100;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 0.75rem 1.25rem;
  }
`;

const Brand = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1.3rem;
  font-weight: 700;
  text-decoration: none;
  color: #fff;
`;

const Logo = styled.img`
  height: 48px;
  width: auto;
`;

const MenuToggle = styled.button`
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;

  span {
    display: block;
    height: 2px;
    width: 100%;
    background-color: #fff;
    border-radius: 2px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: flex;
  }
`;

const Nav = styled.nav<{ $open: boolean }>`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    background-color: ${({ theme }) => theme.colors.primary};
    max-height: ${({ $open }) => ($open ? "400px" : "0")};
    overflow: hidden;
    transition: max-height 0.25s ease;
  }
`;

const NavLink = styled(RouterNavLink)`
  text-decoration: none;
  color: #fff;
  font-weight: 500;
  padding: 0.5rem 0;

  &:hover,
  &.active {
    color: ${({ theme }) => theme.colors.accent};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 0.85rem 1.25rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

const CartButton = styled(Link)`
  position: relative;
  display: flex;
  align-items: center;
  color: #fff;
  text-decoration: none;
  padding: 0.5rem;
  border-radius: 6px;
  transition: background 0.15s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  svg {
    width: 22px;
    height: 22px;
  }
`;

const CartBadge = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  background-color: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.65rem;
  font-weight: 700;
  border-radius: 50%;
  width: 17px;
  height: 17px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
`;

export function Header() {
  const [open, setOpen] = useState(false);
  const cartCount = useAppSelector((state) =>
    state.cart.items.reduce((sum, i) => sum + i.quantity, 0),
  );

  return (
    <StyledHeader>
      <Brand to="/" onClick={() => setOpen(false)}>
        <Logo src={logo} alt="Pescamarche" />
        Pescamarche
      </Brand>

      <MenuToggle
        type="button"
        aria-label="Abrir menú"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span />
        <span />
        <span />
      </MenuToggle>

      <Nav $open={open}>
        <NavLink to="/" end onClick={() => setOpen(false)}>
          Inicio
        </NavLink>
        <NavLink to="/productos" onClick={() => setOpen(false)}>
          Productos
        </NavLink>
        <NavLink to="/quienes-somos" onClick={() => setOpen(false)}>
          Quiénes somos
        </NavLink>
        <NavLink to="/preguntas-frecuentes" onClick={() => setOpen(false)}>
          Preguntas frecuentes
        </NavLink>
        <NavLink to="/contacto" onClick={() => setOpen(false)}>
          Contacto
        </NavLink>
        <CartButton
          to="/carrito"
          onClick={() => setOpen(false)}
          aria-label="Carrito"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          {cartCount > 0 && (
            <CartBadge>{cartCount > 99 ? "99+" : cartCount}</CartBadge>
          )}
        </CartButton>
      </Nav>
    </StyledHeader>
  );
}
