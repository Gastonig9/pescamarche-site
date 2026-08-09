import { Link } from "react-router-dom";
import styled from "styled-components";
import logo from "../../assets/pescamarche-logo.png";
import banner from "../../assets/pescamarche-banner.jpeg";

const Hero = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 1.5rem;
  padding: 5rem 2rem;
  overflow: hidden;
  background-image:
    linear-gradient(
      135deg,
      ${({ theme }) => `${theme.colors.primary}e6`},
      ${({ theme }) => `${theme.colors.primaryDark}f2`}
    ),
    url(${banner});
  background-size: cover;
  background-position: center 30%;
  background-repeat: no-repeat;
  color: #fff;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 3rem 1.25rem;
  }
`;

const HeroLogo = styled.img`
  height: 140px;
  width: auto;
  margin-bottom: 0.5rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    height: 100px;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  max-width: 800px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 1.8rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.15rem;
  max-width: 640px;
  color: ${({ theme }) => theme.colors.lightBlue};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 1rem;
  }
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

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 3rem 1.25rem;
  }
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

const ProductsTeaser = styled.section`
  background-color: ${({ theme }) => theme.colors.surface};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding: 4rem 2rem;
  text-align: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 3rem 1.25rem;
  }
`;

const ProductsTeaserText = styled.p`
  max-width: 560px;
  margin: 0.75rem auto 1.75rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

export function LandingPage() {
  return (
    <>
      <Hero>
        <HeroLogo src={logo} alt="Pescamarche - Pesca & Camping" />
        <Title>BIENVENIDOS A PESCAMARCHE</Title>
        <Subtitle>
          Somos una casa de Pesca, Camping y más... Única casa de pesca atendida
          por pescadores, contamos con asesoramiento personalizado y consejos
          para una excelente pesca!
        </Subtitle>
        <CtaButton to="/contacto">Contactanos</CtaButton>
      </Hero>

      <Section>
        <h2>¿Por qué elegirnos?</h2>
        <Features>
          <Feature>
            <h3>Atendido por pescadores</h3>
            <p>Te asesoramos con la experiencia de quienes viven la pesca.</p>
          </Feature>
          <Feature>
            <h3>Pesca, camping y más</h3>
            <p>Indumentaria, náutica, trekking, bazar y mucho más.</p>
          </Feature>
          <Feature>
            <h3>Asesoramiento personalizado</h3>
            <p>Te ayudamos a elegir el equipo ideal para tu estilo de pesca.</p>
          </Feature>
        </Features>
      </Section>

      <ProductsTeaser>
        <h2>Nuestros productos</h2>
        <ProductsTeaserText>
          Muy pronto vas a poder ver acá nuestro catálogo completo. Mientras
          tanto, escribinos y te asesoramos con lo que estás buscando.
        </ProductsTeaserText>
        <CtaButton to="/productos">Ver productos</CtaButton>
      </ProductsTeaser>
    </>
  );
}
