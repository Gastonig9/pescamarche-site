import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { keyframes } from "styled-components";
import styled from "styled-components";
import { useGetProductsQuery } from "../../features/products/productsApi";
import { ProductCard } from "../../components/product/ProductCard";
import fallbackImg from "../../assets/pescamarche-logo-NoPng.png";

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
  margin-bottom: 1.5rem;
`;

/* ─── Search ──────────────────────────────────────────────────────────────── */
const SearchWrapper = styled.div`
  position: relative;
  margin-bottom: 1rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 1rem;
  box-sizing: border-box;
  transition: border-color 0.15s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 0.9rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1rem;
  pointer-events: none;
`;

const Suggestions = styled.ul`
  position: absolute;
  z-index: 200;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  list-style: none;
  margin: 0;
  padding: 0.4rem 0;
  max-height: 380px;
  overflow-y: auto;
`;

const SuggestionItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 1rem;
  cursor: pointer;
  transition: background 0.1s;

  &:hover {
    background: ${({ theme }) => theme.colors.background};
  }
`;

const SuggestionImg = styled.img`
  width: 44px;
  height: 44px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  flex-shrink: 0;
`;

const SuggestionName = styled.span`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.3;
`;

const SuggestionPrice = styled.span`
  margin-left: auto;
  font-size: 0.85rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  white-space: nowrap;
`;

const NoSuggestions = styled.li`
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textLight};
`;
const FilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: flex-end;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 1rem 1.25rem;
  margin-bottom: 1.75rem;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  min-width: 140px;
`;

const FilterLabel = styled.label`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textLight};
  text-transform: uppercase;
  letter-spacing: 0.4px;
`;

const FilterInput = styled.input`
  padding: 0.45rem 0.65rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  font-size: 0.9rem;
  width: 100%;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const FilterSelect = styled.select`
  padding: 0.45rem 0.65rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  font-size: 0.9rem;
  background: white;
  width: 100%;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  span {
    color: ${({ theme }) => theme.colors.textLight};
    font-size: 0.85rem;
  }
  input {
    width: 90px;
  }
`;

const ClearBtn = styled.button`
  padding: 0.45rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  background: none;
  font-size: 0.85rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textLight};
  align-self: flex-end;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ResultCount = styled.p`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 1.25rem;
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
  const navigate = useNavigate();

  // ── Search state ──
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const suggestions = useMemo(() => {
    if (!query.trim() || !products) return [];
    const q = query.toLowerCase();
    return products.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 8);
  }, [query, products]);

  function handleSuggestionClick(id: string) {
    setQuery("");
    setShowSuggestions(false);
    navigate(`/productos/${id}`);
  }

  // ── Filter state ──
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Derive unique sorted values from loaded products
  const categories = useMemo(
    () =>
      [
        ...new Set(
          products?.map((p) => p.category).filter(Boolean) as string[],
        ),
      ].sort(),
    [products],
  );
  const brands = useMemo(
    () =>
      [
        ...new Set(products?.map((p) => p.brand).filter(Boolean) as string[]),
      ].sort(),
    [products],
  );

  const filtered = useMemo(() => {
    if (!products) return [];
    return products.filter((p) => {
      if (minPrice !== "" && p.price < Number(minPrice)) return false;
      if (maxPrice !== "" && p.price > Number(maxPrice)) return false;
      if (category && p.category !== category) return false;
      if (brand && p.brand !== brand) return false;
      return true;
    });
  }, [products, minPrice, maxPrice, category, brand]);

  const isFiltered =
    minPrice !== "" || maxPrice !== "" || category !== "" || brand !== "";

  // Reset page when filters change
  const handleFilterChange =
    (setter: (v: string) => void) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setter(e.target.value);
      setVisibleCount(PAGE_SIZE);
    };

  function clearFilters() {
    setMinPrice("");
    setMaxPrice("");
    setCategory("");
    setBrand("");
    setVisibleCount(PAGE_SIZE);
  }

  const visible = filtered.slice(0, visibleCount);
  const hasMore = filtered.length > visibleCount;

  return (
    <Container>
      <Title>Nuestros productos</Title>

      {products && products.length > 0 && (
        <SearchWrapper ref={searchRef}>
          <SearchIcon>🔍</SearchIcon>
          <SearchInput
            type="search"
            placeholder="Buscar por nombre de producto..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => query.trim() && setShowSuggestions(true)}
            autoComplete="off"
          />
          {showSuggestions && query.trim() && (
            <Suggestions>
              {suggestions.length === 0 ? (
                <NoSuggestions>Sin resultados para "{query}"</NoSuggestions>
              ) : (
                suggestions.map((p) => (
                  <SuggestionItem
                    key={p._id || p.id}
                    onMouseDown={() => handleSuggestionClick(p._id || p.id)}
                  >
                    <SuggestionImg
                      src={p.images?.[0] || fallbackImg}
                      alt={p.name}
                    />
                    <SuggestionName>{p.name}</SuggestionName>
                    <SuggestionPrice>${p.price.toFixed(2)}</SuggestionPrice>
                  </SuggestionItem>
                ))
              )}
            </Suggestions>
          )}
        </SearchWrapper>
      )}

      {/* Filters — shown only once products are loaded */}
      {products && products.length > 0 && (
        <FilterBar>
          <FilterGroup>
            <FilterLabel>Precio</FilterLabel>
            <PriceRow>
              <FilterInput
                type="number"
                min={0}
                placeholder="Desde"
                value={minPrice}
                onChange={handleFilterChange(setMinPrice)}
              />
              <span>—</span>
              <FilterInput
                type="number"
                min={0}
                placeholder="Hasta"
                value={maxPrice}
                onChange={handleFilterChange(setMaxPrice)}
              />
            </PriceRow>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Categoría</FilterLabel>
            <FilterSelect
              value={category}
              onChange={handleFilterChange(setCategory)}
            >
              <option value="">Todas</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Marca</FilterLabel>
            <FilterSelect value={brand} onChange={handleFilterChange(setBrand)}>
              <option value="">Todas</option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </FilterSelect>
          </FilterGroup>

          {isFiltered && <ClearBtn onClick={clearFilters}>✕ Limpiar</ClearBtn>}
        </FilterBar>
      )}

      {isLoading && <Spinner />}
      {isError && (
        <StateMessage>
          No se pudieron cargar los productos. Intentá nuevamente más tarde.
        </StateMessage>
      )}
      {!isLoading && !isError && products?.length === 0 && (
        <StateMessage>Todavía no hay productos cargados.</StateMessage>
      )}
      {!isLoading && !isError && isFiltered && filtered.length === 0 && (
        <StateMessage>
          No hay productos que coincidan con los filtros seleccionados.
        </StateMessage>
      )}

      {visible.length > 0 && (
        <>
          {isFiltered && (
            <ResultCount>
              {filtered.length} producto{filtered.length !== 1 ? "s" : ""}{" "}
              encontrado{filtered.length !== 1 ? "s" : ""}
            </ResultCount>
          )}
          <Grid>
            {visible.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </Grid>
        </>
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
