import { Link } from "react-router-dom";
import styled from "styled-components";

const Hero = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 1.5rem;
  padding: 6rem 2rem;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary},
    ${({ theme }) => theme.colors.secondary}
  );
  color: #fff;
`;

const Title = styled.h1`
  font-size: 2.75rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  max-width: 560px;
`;

const CtaButton = styled(Link)`
  display: inline-block;
  padding: 0.85rem 2rem;
  background-color: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.text};
  border-radius: 999px;
  text-decoration: none;
  font-weight: 700;
  transition: transform 0.15s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const Section = styled.section`
  max-width: 960px;
  margin: 0 auto;
  padding: 4rem 2rem;
  text-align: center;
`;

const Features = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2rem;
  margin-top: 2.5rem;
  text-align: left;
`;

const Feature = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 1.5rem;
`;

export function LandingPage() {
  return (
    <>
      <Hero>
        <Title>Todo lo que necesitás para tu próxima pesca</Title>
        <Subtitle>
          Cañas, reels, carnadas y accesorios seleccionados para pescadores de
          agua dulce y salada.
        </Subtitle>
        <CtaButton to="/productos">Ver productos</CtaButton>
      </Hero>

      <Section>
        <h2>¿Por qué elegirnos?</h2>
        <Features>
          <Feature>
            <h3>Calidad garantizada</h3>
            <p>Productos de marcas reconocidas, probados en el agua.</p>
          </Feature>
          <Feature>
            <h3>Envíos a todo el país</h3>
            <p>Recibí tu equipo donde estés, de forma rápida y segura.</p>
          </Feature>
          <Feature>
            <h3>Asesoramiento experto</h3>
            <p>Te ayudamos a elegir el equipo ideal para tu estilo de pesca.</p>
          </Feature>
        </Features>
      </Section>
    </>
  );
}
