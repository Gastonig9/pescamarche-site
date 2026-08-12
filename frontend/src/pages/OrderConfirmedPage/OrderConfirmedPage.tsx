import { Link } from "react-router-dom";
import styled from "styled-components";

const Container = styled.section`
  max-width: 680px;
  margin: 0 auto;
  padding: 5rem 2rem;
  text-align: center;
`;

const Icon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const Text = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 2rem;
`;

const BackLink = styled(Link)`
  padding: 0.75rem 2rem;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: #fff;
  text-decoration: none;
  font-weight: 600;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

export function OrderConfirmedPage() {
  return (
    <Container>
      <Icon>✅</Icon>
      <Title>¡Pedido confirmado!</Title>
      <Text>
        Recibimos tu pedido correctamente. Te contactaremos a la brevedad para
        coordinar el pago y la entrega.
      </Text>
      <BackLink to="/productos">Seguir comprando</BackLink>
    </Container>
  );
}
