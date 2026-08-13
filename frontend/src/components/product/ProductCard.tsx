import { Link } from "react-router-dom";
import styled from "styled-components";
import type { Product } from "../../features/products/types";
import { useAppDispatch } from "../../app/hooks";
import { addItem } from "../../features/cart/cartSlice";
import fallbackImg from "../../assets/pescamarche-logo-NoPng.png";

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

const CardLink = styled(Link)`
  display: block;
  text-decoration: none;
  color: inherit;

  &:hover img {
    opacity: 0.92;
  }
`;

const Image = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  background-color: ${({ theme }) => theme.colors.background};
  transition: opacity 0.15s;
`;

const Body = styled.div`
  padding: 0.85rem 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const Name = styled.h3`
  font-size: 1rem;
`;

const Price = styled.span`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.05rem;
`;

const Footer = styled.div`
  padding: 0.75rem 1rem 1rem;
`;

const AddToCartBtn = styled.button`
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
  const productId = product._id || product.id;

  function handleAddToCart() {
    dispatch(
      addItem({
        productId,
        name: product.name,
        price: product.price,
        image: product.images[0] || "",
        quantity: 1,
      }),
    );
  }

  return (
    <Card>
      <CardLink to={`/productos/${productId}`}>
        <Image src={product.images[0] || fallbackImg} alt={product.name} />
        <Body>
          <Name>{product.name}</Name>
          <Price>${product.price.toFixed(2)}</Price>
        </Body>
      </CardLink>
      <Footer>
        <AddToCartBtn onClick={handleAddToCart}>
          Agregar al carrito
        </AddToCartBtn>
      </Footer>
    </Card>
  );
}
