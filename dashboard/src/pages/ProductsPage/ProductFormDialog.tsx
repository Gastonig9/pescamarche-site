import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
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
  images: [] as string[],
};

type FormState = typeof emptyForm;

function toFormState(product: Product | null): FormState {
  if (!product) return { ...emptyForm, images: [] };
  return {
    name: product.name,
    description: product.description,
    price: String(product.price),
    stock: String(product.stock),
    brand: product.brand ?? "",
    category: product.category ?? "",
    subcategory: product.subcategory ?? "",
    sku: product.sku ?? "",
    images: product.images ?? [],
  };
}

export function ProductFormDialog({
  open,
  initialValue,
  onClose,
  onSubmit,
}: ProductFormDialogProps) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setForm(toFormState(initialValue));
  }, [initialValue, open]);

  function handleChange(field: keyof Omit<FormState, "images">) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    Promise.all(
      files.map(
        (file) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          }),
      ),
    ).then((base64Images) => {
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...base64Images],
      }));
    });

    // reset so the same file can be re-selected if removed
    event.target.value = "";
  }

  function removeImage(index: number) {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
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
      images: form.images,
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

          {/* Image upload */}
          <Grid size={12}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Imágenes del producto
            </Typography>

            {/* Previews */}
            {form.images.length > 0 && (
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                  mb: 1.5,
                }}
              >
                {form.images.map((src, i) => (
                  <Box
                    key={i}
                    sx={{ position: "relative", width: 80, height: 80 }}
                  >
                    <Box
                      component="img"
                      src={src}
                      alt={`imagen ${i + 1}`}
                      sx={{
                        width: 80,
                        height: 80,
                        objectFit: "cover",
                        borderRadius: 1,
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => removeImage(i)}
                      sx={{
                        position: "absolute",
                        top: -8,
                        right: -8,
                        bgcolor: "error.main",
                        color: "#fff",
                        width: 20,
                        height: 20,
                        fontSize: "0.7rem",
                        "&:hover": { bgcolor: "error.dark" },
                      }}
                    >
                      ✕
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <Button
              variant="outlined"
              size="small"
              onClick={() => fileInputRef.current?.click()}
            >
              {form.images.length > 0
                ? "Agregar más imágenes"
                : "Seleccionar imágenes"}
            </Button>
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
