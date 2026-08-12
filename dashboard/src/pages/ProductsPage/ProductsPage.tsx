import { useState } from "react";
import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
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
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  function handleNew() {
    setEditingProduct(null);
    setDialogOpen(true);
  }

  function handleEdit(product: Product) {
    setEditingProduct(product);
    setDialogOpen(true);
  }

  async function handleDelete(id: string) {
    if (confirm("¿Eliminar este producto?")) {
      await deleteProduct(id);
    }
  }

  async function handleSubmit(values: Partial<ProductInput>) {
    if (editingProduct) {
      const productId = editingProduct._id || editingProduct.id || "";
      await updateProduct({ id: productId, body: values });
    } else {
      await createProduct(values);
    }
    setDialogOpen(false);
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
            onClick={() => handleDelete(params.row._id || params.row.id)}
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

      <Box sx={{ height: 560, backgroundColor: "background.paper" }}>
        <DataGrid
          rows={products ?? []}
          columns={columns}
          loading={isLoading}
          disableRowSelectionOnClick
          getRowId={(row) => row._id || row.id || ""}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[10, 25, 50]}
        />
      </Box>

      <ProductFormDialog
        open={dialogOpen}
        initialValue={editingProduct}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
      />
    </Box>
  );
}
