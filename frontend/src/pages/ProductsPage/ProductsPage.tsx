import styled from "styled-components";
import { useGetProductsQuery } from "../../features/products/productsApi";
import { ProductCard } from "../../components/product/ProductCard";

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

export function ProductsPage() {
  const { data: products, isLoading, isError } = useGetProductsQuery();

  return (
    <Container>
      <Title>Nuestros productos</Title>

      {isLoading && <StateMessage>Cargando productos...</StateMessage>}
      {isError && (
        <StateMessage>
          No se pudieron cargar los productos. Intentá nuevamente más tarde.
        </StateMessage>
      )}
      {!isLoading && !isError && products?.length === 0 && (
        <StateMessage>Todavía no hay productos cargados.</StateMessage>
      )}

      {products && products.length > 0 && (
        <Grid>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Grid>
      )}
    </Container>
  );
}
