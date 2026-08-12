import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { clearCart } from "../../features/cart/cartSlice";
import { useCreateOrderMutation } from "../../features/orders/ordersApi";

const Container = styled.section`
  max-width: 680px;
  margin: 0 auto;
  padding: 3rem 2rem;
`;

const Title = styled.h1`
  margin-bottom: 2rem;
`;

const Section = styled.fieldset`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;

  legend {
    font-weight: 600;
    padding: 0 0.5rem;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textLight};
`;

const Input = styled.input`
  padding: 0.55rem 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  font-size: 0.95rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Select = styled.select`
  padding: 0.55rem 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  font-size: 0.95rem;
  background: white;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Textarea = styled.textarea`
  padding: 0.55rem 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  font-size: 0.95rem;
  resize: vertical;
  min-height: 80px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Summary = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
  padding: 1.25rem 1.5rem;
  margin-bottom: 1.5rem;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.4rem 0;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.textLight};

  &:last-child {
    font-weight: 700;
    font-size: 1.1rem;
    color: ${({ theme }) => theme.colors.primary};
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    margin-top: 0.5rem;
    padding-top: 0.75rem;
  }
`;

const Error = styled.p`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const BackLink = styled(Link)`
  padding: 0.65rem 1.25rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.95rem;

  &:hover {
    background: ${({ theme }) => theme.colors.background};
  }
`;

const SubmitBtn = styled.button`
  padding: 0.65rem 2rem;
  border: none;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const SHIPPING_METHODS = [
  { value: "retiro_en_tienda", label: "Retiro en tienda (gratis)", cost: 0 },
  { value: "envio_correo", label: "Correo Argentino", cost: 1500 },
  { value: "envio_envionube", label: "EnvíoNube", cost: 1800 },
];

export function CheckoutPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const items = useAppSelector((state) => state.cart.items);
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [shippingMethod, setShippingMethod] = useState(
    SHIPPING_METHODS[0].value,
  );
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const selectedShipping = SHIPPING_METHODS.find(
    (m) => m.value === shippingMethod,
  )!;
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const total = subtotal + selectedShipping.cost;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (items.length === 0) {
      setError("El carrito está vacío.");
      return;
    }

    try {
      const isPickup = shippingMethod === "retiro_en_tienda";
      await createOrder({
        customer: { name, email, phone: phone || undefined },
        items: items.map((i) => ({
          product: i.productId,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          subtotal: i.price * i.quantity,
        })),
        shippingAddress: {
          street: isPickup ? "Retiro en tienda" : street,
          city: isPickup ? "Villa Lugano" : city,
          province: isPickup ? "Buenos Aires" : province,
          postalCode: isPickup ? "1439" : postalCode,
        },
        shippingMethod: selectedShipping.label,
        shippingCost: selectedShipping.cost,
        total,
        notes: notes || undefined,
      }).unwrap();

      dispatch(clearCart());
      navigate("/pedido-confirmado");
    } catch {
      setError("Ocurrió un error al procesar el pedido. Intentá nuevamente.");
    }
  }

  if (items.length === 0) {
    return (
      <Container>
        <Title>Checkout</Title>
        <p>
          Tu carrito está vacío. <Link to="/productos">Ver productos</Link>
        </p>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Finalizar compra</Title>

      <Summary>
        {items.map((i) => (
          <SummaryRow key={i.productId}>
            <span>
              {i.name} × {i.quantity}
            </span>
            <span>${(i.price * i.quantity).toFixed(2)}</span>
          </SummaryRow>
        ))}
        <SummaryRow>
          <span>Envío</span>
          <span>
            {selectedShipping.cost === 0
              ? "Gratis"
              : `$${selectedShipping.cost.toFixed(2)}`}
          </span>
        </SummaryRow>
        <SummaryRow>
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </SummaryRow>
      </Summary>

      <form onSubmit={handleSubmit}>
        <Section>
          <legend>Datos del comprador</legend>
          <Row>
            <Field>
              <Label htmlFor="name">Nombre completo *</Label>
              <Input
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Field>
            <Field>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
          </Row>
          <Field style={{ marginTop: "1rem" }}>
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </Field>
        </Section>

        <Section>
          <legend>Envío</legend>
          <Field style={{ marginBottom: "1rem" }}>
            <Label htmlFor="shippingMethod">Método de envío *</Label>
            <Select
              id="shippingMethod"
              value={shippingMethod}
              onChange={(e) => setShippingMethod(e.target.value)}
            >
              {SHIPPING_METHODS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </Select>
          </Field>

          {shippingMethod !== "retiro_en_tienda" && (
            <>
              <Field style={{ marginBottom: "1rem" }}>
                <Label htmlFor="street">Calle y número *</Label>
                <Input
                  id="street"
                  required={shippingMethod !== "retiro_en_tienda"}
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                />
              </Field>
              <Row>
                <Field>
                  <Label htmlFor="city">Ciudad *</Label>
                  <Input
                    id="city"
                    required={shippingMethod !== "retiro_en_tienda"}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </Field>
                <Field>
                  <Label htmlFor="province">Provincia *</Label>
                  <Input
                    id="province"
                    required={shippingMethod !== "retiro_en_tienda"}
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                  />
                </Field>
              </Row>
              <Field style={{ marginTop: "1rem" }}>
                <Label htmlFor="postalCode">Código postal *</Label>
                <Input
                  id="postalCode"
                  required={shippingMethod !== "retiro_en_tienda"}
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </Field>
            </>
          )}
        </Section>

        <Section>
          <legend>Notas del pedido (opcional)</legend>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Aclaraciones, referencias de entrega..."
          />
        </Section>

        {error && <Error>{error}</Error>}

        <Actions>
          <BackLink to="/carrito">Volver al carrito</BackLink>
          <SubmitBtn type="submit" disabled={isLoading}>
            {isLoading ? "Procesando..." : "Confirmar pedido"}
          </SubmitBtn>
        </Actions>
      </form>
    </Container>
  );
}
