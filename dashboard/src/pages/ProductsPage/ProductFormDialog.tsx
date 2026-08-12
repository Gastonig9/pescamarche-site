import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material";
import type { Product, ProductInput } from "../../features/products/types";

interface ProductFormDialogProps {
  open: boolean;
  initialValue: Product | null;
  onClose: () => void;
  onSubmit: (values: Partial<ProductInput>) => Promise<void> | void;
}

const emptyForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  brand: "",
  category: "",
  subcategory: "",
  sku: "",
  images: "",
};

type FormState = typeof emptyForm;

function toFormState(product: Product | null): FormState {
  if (!product) return emptyForm;
  return {
    name: product.name,
    description: product.description,
    price: String(product.price),
    stock: String(product.stock),
    brand: product.brand ?? "",
    category: product.category ?? "",
    subcategory: product.subcategory ?? "",
    sku: product.sku ?? "",
    images: product.images?.join(", ") ?? "",
  };
}

export function ProductFormDialog({
  open,
  initialValue,
  onClose,
  onSubmit,
}: ProductFormDialogProps) {
  const [form, setForm] = useState<FormState>(emptyForm);

  useEffect(() => {
    setForm(toFormState(initialValue));
  }, [initialValue, open]);

  function handleChange(field: keyof FormState) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };
  }

  async function handleSubmit() {
    await onSubmit({
      name: form.name,
      description: form.description,
      price: Number(form.price) || 0,
      stock: Number(form.stock) || 0,
      brand: form.brand || undefined,
      category: form.category || undefined,
      subcategory: form.subcategory || undefined,
      sku: form.sku || undefined,
      images: form.images
        .split(",")
        .map((url) => url.trim())
        .filter(Boolean),
    });
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialValue ? "Editar producto" : "Nuevo producto"}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid size={12}>
            <TextField
              label="Nombre"
              value={form.name}
              onChange={handleChange("name")}
              fullWidth
              required
            />
          </Grid>
          <Grid size={12}>
            <TextField
              label="Descripción"
              value={form.description}
              onChange={handleChange("description")}
              fullWidth
              multiline
              minRows={3}
              required
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 4 }}>
            <TextField
              label="Precio"
              type="number"
              value={form.price}
              onChange={handleChange("price")}
              fullWidth
              required
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 4 }}>
            <TextField
              label="Stock"
              type="number"
              value={form.stock}
              onChange={handleChange("stock")}
              fullWidth
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="SKU"
              value={form.sku}
              onChange={handleChange("sku")}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Marca"
              value={form.brand}
              onChange={handleChange("brand")}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Categoría"
              value={form.category}
              onChange={handleChange("category")}
              fullWidth
            />
          </Grid>
          <Grid size={12}>
            <TextField
              label="Subcategoría"
              value={form.subcategory}
              onChange={handleChange("subcategory")}
              fullWidth
            />
          </Grid>
          <Grid size={12}>
            <TextField
              label="Imágenes (URLs separadas por coma)"
              value={form.images}
              onChange={handleChange("images")}
              fullWidth
              multiline
              minRows={2}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
