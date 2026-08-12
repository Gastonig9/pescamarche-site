import styled from "styled-components";
import type { Product } from "../../features/products/types";

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

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card>
      <Image src={product.images[0] || "/favicon.svg"} alt={product.name} />
      <Body>
        <Name>{product.name}</Name>
        <Description>{product.description}</Description>
        <Price>${product.price.toFixed(2)}</Price>
      </Body>
    </Card>
  );
}
