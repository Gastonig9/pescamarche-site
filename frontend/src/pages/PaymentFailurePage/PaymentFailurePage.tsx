import { Link, useSearchParams } from "react-router-dom";
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
  color: ${({ theme }) => theme.colors.secondary};
`;

const Text = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 0.5rem;
`;

const Sub = styled.p`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 2rem;
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const RetryLink = styled(Link)`
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

const ShopLink = styled(Link)`
  padding: 0.75rem 2rem;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  font-weight: 600;

  &:hover {
    background: ${({ theme }) => theme.colors.background};
  }
`;

export function PaymentFailurePage() {
  const [params] = useSearchParams();
  const mpStatus = params.get("collection_status") ?? params.get("status");

  return (
    <Container>
      <Icon>❌</Icon>
      <Title>Pago no realizado</Title>
      <Text>
        No pudimos procesar tu pago. El pedido fue registrado pero está
        pendiente de pago. Podés volver a intentarlo o contactarnos.
      </Text>
      {mpStatus && (
        <Sub>
          Estado reportado por MercadoPago: <strong>{mpStatus}</strong>
        </Sub>
      )}
      <Actions>
        <RetryLink to="/carrito">Volver al carrito</RetryLink>
        <ShopLink to="/contacto">Contactarnos</ShopLink>
      </Actions>
    </Container>
  );
}
