import styled from "styled-components";
import type { Product } from "../../features/products/types";
import { useAppDispatch } from "../../app/hooks";
import { addItem } from "../../features/cart/cartSlice";

const Card = styled.article`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Body = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
`;

const Name = styled.h3`
  font-size: 1.1rem;
`;

const Description = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textLight};
  flex: 1;
`;

const Price = styled.span`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.1rem;
`;

const AddToCartBtn = styled.button`
  margin-top: 0.75rem;
  width: 100%;
  padding: 0.55rem 1rem;
  border: none;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();

  function handleAddToCart() {
    dispatch(
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0] || "",
        quantity: 1,
      }),
    );
  }

  return (
    <Card>
      <Image src={product.images[0] || "/favicon.svg"} alt={product.name} />
      <Body>
        <Name>{product.name}</Name>
        <Description>{product.description}</Description>
        <Price>${product.price.toFixed(2)}</Price>
        <AddToCartBtn onClick={handleAddToCart}>
          Agregar al carrito
        </AddToCartBtn>
      </Body>
    </Card>
  );
}
