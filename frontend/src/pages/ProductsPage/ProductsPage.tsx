import { useState } from "react";
import { keyframes } from "styled-components";
import styled from "styled-components";
import { useGetProductsQuery } from "../../features/products/productsApi";
import { ProductCard } from "../../components/product/ProductCard";

const PAGE_SIZE = 8;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Container = styled.section`
  max-width: 1100px;
  margin: 0 auto;
  padding: 3rem 2rem;
`;

const Title = styled.h1`
  margin-bottom: 2rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
`;

const StateMessage = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
`;

const Spinner = styled.div`
  width: 42px;
  height: 42px;
  border: 4px solid ${({ theme }) => theme.colors.border};
  border-top-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 0.75s linear infinite;
  margin: 4rem auto;
`;

const LoadMoreWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2.5rem;
`;

const LoadMoreBtn = styled.button`
  padding: 0.75rem 2.5rem;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: 999px;
  background: transparent;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: #fff;
  }
`;

export function ProductsPage() {
  const { data: products, isLoading, isError } = useGetProductsQuery();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const visible = products?.slice(0, visibleCount) ?? [];
  const hasMore = (products?.length ?? 0) > visibleCount;

  return (
    <Container>
      <Title>Nuestros productos</Title>

      {isLoading && <Spinner />}
      {isError && (
        <StateMessage>
          No se pudieron cargar los productos. Intentá nuevamente más tarde.
        </StateMessage>
      )}
      {!isLoading && !isError && products?.length === 0 && (
        <StateMessage>Todavía no hay productos cargados.</StateMessage>
      )}

      {visible.length > 0 && (
        <Grid>
          {visible.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Grid>
      )}

      {hasMore && (
        <LoadMoreWrapper>
          <LoadMoreBtn onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}>
            Ver más
          </LoadMoreBtn>
        </LoadMoreWrapper>
      )}
    </Container>
  );
}
