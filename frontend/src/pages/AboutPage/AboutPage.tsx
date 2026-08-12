import styled from "styled-components";
import logo from "../../assets/pescamarche-logo.png";

const sections = [
  {
    icon: "📜",
    title: "Origen de Nuestro Negocio",
    text: "Nuestra historia comenzó con un pequeño emprendimiento dedicado a la venta de unos pocos artículos de pesca. Con mucho esfuerzo, dedicación y compromiso con la calidad, fuimos creciendo hasta convertirnos en una empresa reconocida que se especializa en la venta de productos para pesca y camping.",
  },
  {
    icon: "🎯",
    title: "Por Qué Elegimos Este Rubro",
    text: "La pesca y el camping son actividades que requieren equipamiento de primera calidad y asesoramiento experto. Nuestro objetivo es ofrecer a cada cliente productos confiables y adecuados para su tipo de pesca, asegurando una experiencia satisfactoria y segura. La pasión por estas actividades nos impulsa a seguir mejorando y ampliando nuestro catálogo.",
  },
  {
    icon: "🤝",
    title: "Nuestro Equipo de Trabajo",
    text: "Contamos con un equipo de profesionales especializados en pesca, quienes no solo venden productos, sino que también brindan asesoramiento personalizado. Esto nos permite entender mejor las necesidades de nuestros clientes y ofrecer soluciones a medida.",
  },
  {
    icon: "🏆",
    title: "Compromiso con la Calidad",
    text: "Ofrecemos productos de primera calidad, cuidadosamente seleccionados para cubrir todo tipo de pesca y camping. Ya sea pesca deportiva, de río, mar o laguna, tenemos el equipo ideal para cada situación.",
  },
];

export function AboutPage() {
  return (
    <>
      <Hero>
        <Logo src={logo} alt="Pescamarche - Pesca & Camping" />
        <Title>Quiénes Somos</Title>
        <Tagline>
          Somos una casa de pesca y camping con una sólida trayectoria y pasión
          por el deporte y la naturaleza. Nuestro equipo está compuesto por
          especialistas en pesca, que conocen en profundidad las necesidades de
          cada tipo de pescador, desde principiantes hasta expertos.
        </Tagline>
      </Hero>

      <Container>
        <Grid>
          {sections.map((section) => (
            <Card key={section.title}>
              <IconWrap>{section.icon}</IconWrap>
              <CardTitle>{section.title}</CardTitle>
              <CardText>{section.text}</CardText>
            </Card>
          ))}
        </Grid>
      </Container>
    </>
  );
}

const Hero = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
  padding: 3.5rem 2rem 2.5rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 2.5rem 1.25rem 1.5rem;
  }
`;

const Logo = styled.img`
  height: 120px;
  width: auto;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
`;

const Tagline = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  max-width: 640px;
`;

const Container = styled.section`
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 2rem 4rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 0 1.25rem 3rem;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.75rem;
`;

const Card = styled.article`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-top: 4px solid ${({ theme }) => theme.colors.accent};
  border-radius: 12px;
  padding: 1.75rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 22px rgba(0, 0, 0, 0.08);
  }
`;

const IconWrap = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.lightBlue};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;

const CardTitle = styled.h3`
  color: ${({ theme }) => theme.colors.primary};
`;

const CardText = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  margin: 0;
`;
