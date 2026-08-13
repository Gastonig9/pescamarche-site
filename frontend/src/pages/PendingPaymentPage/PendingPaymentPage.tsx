import { Link, useSearchParams } from "react-router-dom";
import styled from "styled-components";

const Container = styled.section`
  max-width: 680px;
  margin: 0 auto;
  padding: 4rem 2rem;
  text-align: center;
`;

const Icon = styled.div`
  font-size: 3.5rem;
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const Sub = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 2rem;
`;

const InfoCard = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  padding: 2rem;
  margin-bottom: 2rem;
  text-align: left;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }

  span:first-child {
    color: ${({ theme }) => theme.colors.textLight};
    font-size: 0.9rem;
  }
  span:last-child {
    font-weight: 700;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const AliasCode = styled.p`
  font-size: 1.6rem;
  font-weight: 700;
  letter-spacing: 3px;
  color: ${({ theme }) => theme.colors.primary};
  margin: 0;
`;

const Note = styled.p`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textLight};
  margin: 1.5rem 0 0;
  line-height: 1.6;
`;

const BackLink = styled(Link)`
  display: inline-block;
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

const ALIAS = "gastonig.mp";

export function PendingPaymentPage() {
  const [params] = useSearchParams();
  const orderId = params.get("orderId") ?? "";
  const total = params.get("total") ?? "0";
  const shortId = orderId.slice(-6).toUpperCase();

  return (
    <Container>
      <Icon>⏳</Icon>
      <Title>Pedido registrado</Title>
      <Sub>
        Tu pedido fue generado. Solo falta confirmar el pago con la
        transferencia.
      </Sub>

      <InfoCard>
        <Row>
          <span>Número de pedido</span>
          <span>#{shortId}</span>
        </Row>
        <Row>
          <span>Total a transferir</span>
          <span>${parseFloat(total).toFixed(2)}</span>
        </Row>
        <Row>
          <span>Alias de MercadoPago</span>
          <AliasCode>{ALIAS}</AliasCode>
        </Row>
        <Row>
          <span>Concepto / referencia</span>
          <span>Pedido #{shortId}</span>
        </Row>
      </InfoCard>

      <Note>
        Una vez que realices la transferencia, el equipo de Pescamarche la
        verificará y actualizará el estado de tu pedido. Recibirás un correo de
        confirmación cuando el pago sea acreditado.
        <br />
        <br />
        ¿Dudas? Escribinos al{" "}
        <a href="/contacto" style={{ color: "inherit" }}>
          formulario de contacto
        </a>
        .
      </Note>

      <BackLink to="/productos">Seguir comprando</BackLink>
    </Container>
  );
}
