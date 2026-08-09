import { Link } from "react-router-dom";
import styled from "styled-components";

const StyledFooter = styled.footer`
  background-color: ${({ theme }) => theme.colors.primaryDark};
  color: #fff;
`;

const Content = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 2.5rem 2rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

const Heading = styled.h3`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.accent};
  margin-bottom: 0.4rem;
`;

const FooterLink = styled(Link)`
  color: #fff;
  text-decoration: none;
  font-size: 0.9rem;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const Text = styled.p`
  font-size: 0.9rem;
  margin: 0;
`;

const Bottom = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1rem 2rem;
  text-align: center;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
`;

export function Footer() {
  return (
    <StyledFooter>
      <Content>
        <Column>
          <Heading>Pescamarche</Heading>
          <Text>Pesca, Camping y mucho más en Villa Lugano.</Text>
        </Column>

        <Column>
          <Heading>Enlaces</Heading>
          <FooterLink to="/">Inicio</FooterLink>
          <FooterLink to="/productos">Productos</FooterLink>
          <FooterLink to="/quienes-somos">Quiénes somos</FooterLink>
          <FooterLink to="/preguntas-frecuentes">
            Preguntas frecuentes
          </FooterLink>
          <FooterLink to="/contacto">Contacto</FooterLink>
        </Column>

        <Column>
          <Heading>Contacto</Heading>
          <Text>Villa Lugano, CABA</Text>
          <Text>Tel/WhatsApp: 4601-9578 / 11-2834-4179</Text>
          <Text>Instagram: @pescamarche</Text>
        </Column>
      </Content>

      <Bottom>
        © {new Date().getFullYear()} Pescamarche. Todos los derechos reservados.
      </Bottom>
    </StyledFooter>
  );
}
