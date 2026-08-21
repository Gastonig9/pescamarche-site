import { Link } from "react-router-dom";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  removeItem,
  updateQuantity,
  clearCart,
} from "../../features/cart/cartSlice";
import defaultImg from "../../assets/pescamarche-logo-NoPng.png";

const Container = styled.section`
  max-width: 860px;
  margin: 0 auto;
  padding: 3rem 2rem;
`;

const Title = styled.h1`
  margin-bottom: 2rem;
`;

const Empty = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
`;

const Th = styled.th`
  text-align: left;
  padding: 0.75rem 1rem;
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

const Td = styled.td`
  padding: 0.75rem 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  vertical-align: middle;
`;

const Thumbnail = styled.img`
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 4px;
`;

const QuantityInput = styled.input`
  width: 60px;
  padding: 0.35rem 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  font-size: 0.95rem;
`;

const RemoveBtn = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.secondary};
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0.25rem 0.5rem;

  &:hover {
    text-decoration: underline;
  }
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Total = styled.p`
  font-size: 1.3rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;
`;

const ClearBtn = styled.button`
  padding: 0.65rem 1.25rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  background: none;
  cursor: pointer;
  font-size: 0.95rem;
`;

const CheckoutLink = styled(Link)`
  padding: 0.65rem 1.5rem;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: #fff;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

export function CartPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (items.length === 0) {
    return (
      <Container>
        <Title>Carrito de compras</Title>
        <Empty>Tu carrito está vacío.</Empty>
        <Link to="/productos">Ver productos</Link>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Carrito de compras</Title>

      <Table>
        <thead>
          <tr>
            <Th>Producto</Th>
            <Th>Nombre</Th>
            <Th>Precio</Th>
            <Th>Cantidad</Th>
            <Th>Subtotal</Th>
            <Th></Th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.productId}>
              <Td>
                <Thumbnail src={item.image || defaultImg} alt={item.name} />
              </Td>
              <Td>{item.name}</Td>
              <Td>${item.price.toFixed(2)}</Td>
              <Td>
                <QuantityInput
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => {
                    const qty = parseInt(e.target.value, 10);
                    if (qty >= 1) {
                      dispatch(
                        updateQuantity({
                          productId: item.productId,
                          quantity: qty,
                        }),
                      );
                    }
                  }}
                />
              </Td>
              <Td>${(item.price * item.quantity).toFixed(2)}</Td>
              <Td>
                <RemoveBtn onClick={() => dispatch(removeItem(item.productId))}>
                  Eliminar
                </RemoveBtn>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Footer>
        <Total>Total: ${total.toFixed(2)}</Total>
        <Actions>
          <ClearBtn onClick={() => dispatch(clearCart())}>
            Vaciar carrito
          </ClearBtn>
          <CheckoutLink to="/checkout">Finalizar compra</CheckoutLink>
        </Actions>
      </Footer>
    </Container>
  );
}
