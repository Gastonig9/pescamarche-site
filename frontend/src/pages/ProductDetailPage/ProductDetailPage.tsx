import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { keyframes } from "styled-components";
import styled from "styled-components";
import {
  useGetProductByIdQuery,
  useGetRelatedProductsQuery,
} from "../../features/products/productsApi";
import { useAppDispatch } from "../../app/hooks";
import { addItem } from "../../features/cart/cartSlice";
import { ProductCard } from "../../components/product/ProductCard";
import fallbackImg from "../../assets/pescamarche-logo-NoPng.png";

/* ─── Animations ─────────────────────────────────────────────────────────── */
const spin = keyframes`to { transform: rotate(360deg); }`;

/* ─── Layout ─────────────────────────────────────────────────────────────── */
const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 3rem 2rem;
`;

const Breadcrumb = styled.nav`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 2rem;

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }

  span {
    margin: 0 0.4rem;
  }
`;

const Detail = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: start;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

/* ─── Gallery ─────────────────────────────────────────────────────────────── */
const Gallery = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const MainImage = styled.img`
  width: 100%;
  max-height: 420px;
  object-fit: contain;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
  padding: 1rem;
`;

const Thumbnails = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const Thumb = styled.img<{ $active: boolean }>`
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 4px;
  border: 2px solid
    ${({ theme, $active }) =>
      $active ? theme.colors.primary : theme.colors.border};
  cursor: pointer;
  transition: border-color 0.15s;
`;

/* ─── Info ────────────────────────────────────────────────────────────────── */
const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ProductName = styled.h1`
  font-size: 1.75rem;
  line-height: 1.25;
`;

const Price = styled.p`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const Description = styled.p`
  font-size: 0.95rem;
  line-height: 1.65;
  color: ${({ theme }) => theme.colors.text};
`;

const Meta = styled.dl`
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 1.5rem;
  row-gap: 0.4rem;
  font-size: 0.88rem;

  dt {
    color: ${({ theme }) => theme.colors.textLight};
    font-weight: 600;
  }
  dd {
    margin: 0;
  }
`;

const StockBadge = styled.span<{ $inStock: boolean }>`
  display: inline-block;
  padding: 0.2rem 0.65rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${({ $inStock }) => ($inStock ? "#e6f4ea" : "#fdecea")};
  color: ${({ $inStock }) => ($inStock ? "#2e7d32" : "#c62828")};
`;

const AddToCartBtn = styled.button`
  padding: 0.85rem 2rem;
  border: none;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  align-self: flex-start;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const AddedMsg = styled.span`
  font-size: 0.85rem;
  color: #2e7d32;
  margin-left: 0.75rem;
`;

/* ─── Related ─────────────────────────────────────────────────────────────── */
const RelatedSection = styled.section`
  margin-top: 4rem;
  padding-top: 2.5rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const RelatedTitle = styled.h2`
  margin-bottom: 1.5rem;
  font-size: 1.4rem;
`;

const RelatedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 1.25rem;
`;

/* ─── States ──────────────────────────────────────────────────────────────── */
const Spinner = styled.div`
  width: 42px;
  height: 42px;
  border: 4px solid ${({ theme }) => theme.colors.border};
  border-top-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 0.75s linear infinite;
  margin: 5rem auto;
`;

const ErrorMsg = styled.p`
  color: ${({ theme }) => theme.colors.secondary};
  padding: 3rem 0;
  text-align: center;
`;

/* ─── Component ───────────────────────────────────────────────────────────── */
export function ProductDetailPage() {
  const { id = "" } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded] = useState(false);

  const {
    data: product,
    isLoading,
    isError,
  } = useGetProductByIdQuery(id, {
    skip: !id,
  });
  const { data: related } = useGetRelatedProductsQuery(id, { skip: !id });

  if (isLoading) return <Spinner />;
  if (isError || !product)
    return (
      <ErrorMsg>
        No se pudo cargar el producto.{" "}
        <Link to="/productos">Volver al catálogo</Link>
      </ErrorMsg>
    );

  const images = product.images?.length ? product.images : [fallbackImg];

  function handleAddToCart() {
    dispatch(
      addItem({
        productId: product!.id,
        name: product!.name,
        price: product!.price,
        image: images[0],
        quantity: 1,
      }),
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <Container>
      <Breadcrumb>
        <Link to="/productos">Productos</Link>
        <span>›</span>
        {product.name}
      </Breadcrumb>

      <Detail>
        {/* Gallery */}
        <Gallery>
          <MainImage src={images[activeImg]} alt={product.name} />
          {images.length > 1 && (
            <Thumbnails>
              {images.map((src, i) => (
                <Thumb
                  key={i}
                  src={src}
                  alt=""
                  $active={i === activeImg}
                  onClick={() => setActiveImg(i)}
                />
              ))}
            </Thumbnails>
          )}
        </Gallery>

        {/* Info */}
        <Info>
          <ProductName>{product.name}</ProductName>
          <Price>${product.price.toFixed(2)}</Price>

          <Description>{product.description}</Description>

          <Meta>
            {product.brand && (
              <>
                <dt>Marca</dt>
                <dd>{product.brand}</dd>
              </>
            )}
            {product.category && (
              <>
                <dt>Categoría</dt>
                <dd>{product.category}</dd>
              </>
            )}
            {product.subcategory && (
              <>
                <dt>Subcategoría</dt>
                <dd>{product.subcategory}</dd>
              </>
            )}
            {product.sku && (
              <>
                <dt>SKU</dt>
                <dd>{product.sku}</dd>
              </>
            )}
            <>
              <dt>Stock</dt>
              <dd>
                <StockBadge $inStock={(product.stock ?? 0) > 0}>
                  {(product.stock ?? 0) > 0
                    ? `${product.stock} disponibles`
                    : "Sin stock"}
                </StockBadge>
              </dd>
            </>
          </Meta>

          <div>
            <AddToCartBtn
              onClick={handleAddToCart}
              disabled={(product.stock ?? 0) === 0}
            >
              {(product.stock ?? 0) === 0 ? "Sin stock" : "Agregar al carrito"}
            </AddToCartBtn>
            {added && <AddedMsg>✓ Agregado</AddedMsg>}
          </div>
        </Info>
      </Detail>

      {/* Related products */}
      {related && related.length > 0 && (
        <RelatedSection>
          <RelatedTitle>Productos relacionados</RelatedTitle>
          <RelatedGrid>
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </RelatedGrid>
        </RelatedSection>
      )}
    </Container>
  );
}
