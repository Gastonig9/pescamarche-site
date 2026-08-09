import styled from "styled-components";

const Container = styled.section`
  max-width: 900px;
  margin: 0 auto;
  padding: 3rem 2rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 2rem 1.25rem;
  }
`;

const Title = styled.h1`
  margin-bottom: 0.5rem;
`;

const Intro = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 2.5rem;
  max-width: 640px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const CardTitle = styled.h3`
  color: ${({ theme }) => theme.colors.primary};
`;

const CardText = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  margin: 0;
`;

const WhatsappLink = styled.a`
  display: inline-block;
  margin-top: 2rem;
  padding: 0.85rem 2rem;
  background-color: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.text};
  border-radius: 999px;
  text-decoration: none;
  font-weight: 700;
`;

export function ContactPage() {
  return (
    <Container>
      <Title>Contacto</Title>
      <Intro>
        ¿Tenés dudas sobre algún producto o querés que te asesoremos?
        Escribinos, estamos para ayudarte.
      </Intro>

      <Grid>
        <Card>
          <CardTitle>Dirección</CardTitle>
          <CardText>Villa Lugano, Ciudad Autónoma de Buenos Aires</CardText>
        </Card>
        <Card>
          <CardTitle>Teléfono / WhatsApp</CardTitle>
          <CardText>4601-9578</CardText>
          <CardText>11-2834-4179</CardText>
        </Card>
        <Card>
          <CardTitle>Redes sociales</CardTitle>
          <CardText>Instagram y Facebook: @pescamarche</CardText>
        </Card>
        <Card>
          <CardTitle>Horarios</CardTitle>
          <CardText>Lunes a sábados de 9 a 19 hs</CardText>
        </Card>
      </Grid>

      <WhatsappLink
        href="https://wa.me/5491128344179"
        target="_blank"
        rel="noopener noreferrer"
      >
        Escribinos por WhatsApp
      </WhatsappLink>
    </Container>
  );
}
