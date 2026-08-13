import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  MenuItem,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetProductsQuery,
  useUpdateProductMutation,
} from "../../features/products/productsApi";
import type { Product, ProductInput } from "../../features/products/types";
import { ProductFormDialog } from "./ProductFormDialog";

export function ProductsPage() {
  const { data: products, isLoading } = useGetProductsQuery();
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [dialogError, setDialogError] = useState("");
  const [snackbar, setSnackbar] = useState<{
    msg: string;
    severity: "success" | "error";
  } | null>(null);

  const [search, setSearch] = useState("");
  const [filterBrand, setFilterBrand] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const brands = useMemo(
    () =>
      [
        ...new Set(products?.map((p) => p.brand).filter(Boolean) as string[]),
      ].sort(),
    [products],
  );
  const categories = useMemo(
    () =>
      [
        ...new Set(
          products?.map((p) => p.category).filter(Boolean) as string[],
        ),
      ].sort(),
    [products],
  );

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    const q = search.toLowerCase();
    return products.filter((p) => {
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.sku ?? "").toLowerCase().includes(q);
      const matchBrand = !filterBrand || p.brand === filterBrand;
      const matchCategory = !filterCategory || p.category === filterCategory;
      return matchSearch && matchBrand && matchCategory;
    });
  }, [products, search, filterBrand, filterCategory]);

  function handleNew() {
    setEditingProduct(null);
    setDialogError("");
    setDialogOpen(true);
  }

  function handleEdit(product: Product) {
    setEditingProduct(product);
    setDialogError("");
    setDialogOpen(true);
  }

  async function handleDelete(id: string) {
    if (confirm("¿Eliminar este producto?")) {
      await deleteProduct(id);
    }
  }

  async function handleSubmit(values: Partial<ProductInput>) {
    setDialogError("");
    try {
      if (editingProduct) {
        const productId = editingProduct._id || editingProduct.id || "";
        await updateProduct({ id: productId, body: values }).unwrap();
      } else {
        await createProduct(values).unwrap();
      }
      setDialogOpen(false);
    } catch (err: unknown) {
      const message = (err as { data?: { message?: string | string[] } })?.data
        ?.message;
      const text = Array.isArray(message)
        ? message.join(" ")
        : (message ?? "Ocurrió un error al guardar.");
      setDialogError(text);
    }
  }

  const columns: GridColDef<Product>[] = [
    { field: "sku", headerName: "SKU", width: 120 },
    { field: "name", headerName: "Nombre", flex: 1, minWidth: 180 },
    { field: "brand", headerName: "Marca", width: 130 },
    { field: "category", headerName: "Categoría", width: 130 },
    {
      field: "price",
      headerName: "Precio",
      width: 110,
      valueFormatter: (value: number) => `$${value?.toFixed(2)}`,
    },
    { field: "stock", headerName: "Stock", width: 90 },
    {
      field: "actions",
      headerName: "Acciones",
      width: 110,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5}>
          <IconButton size="small" onClick={() => handleEdit(params.row)}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() =>
              handleDelete(params.row._id || (params.row.id as any))
            }
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <Box>
      <Stack
        direction="row"
        sx={{ justifyContent: "space-between", alignItems: "center", mb: 3 }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Productos
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleNew}>
          Nuevo producto
        </Button>
      </Stack>

      <Stack direction="row" spacing={1.5} sx={{ mb: 2, flexWrap: "wrap" }}>
        <TextField
          size="small"
          placeholder="Buscar por nombre o SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
          sx={{ flexGrow: 1, minWidth: 260 }}
        />
        <TextField
          select
          size="small"
          label="Marca"
          value={filterBrand}
          onChange={(e) => setFilterBrand(e.target.value)}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="">Todas</MenuItem>
          {brands.map((b) => (
            <MenuItem key={b} value={b}>
              {b}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          size="small"
          label="Categoría"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="">Todas</MenuItem>
          {categories.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      <Box sx={{ height: 560, backgroundColor: "background.paper" }}>
        <DataGrid
          rows={filteredProducts}
          columns={columns}
          loading={isLoading}
          disableRowSelectionOnClick
          getRowId={(row) => row._id || row.id || ""}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          pageSizeOptions={[10, 25, 50]}
        />
      </Box>

      <ProductFormDialog
        open={dialogOpen}
        initialValue={editingProduct}
        loading={isCreating || isUpdating}
        error={dialogError}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
      />

      <Snackbar
        open={Boolean(snackbar)}
        autoHideDuration={4000}
        onClose={() => setSnackbar(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar?.severity} onClose={() => setSnackbar(null)}>
          {snackbar?.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
