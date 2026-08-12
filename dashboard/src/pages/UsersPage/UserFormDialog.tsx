import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  MenuItem,
  Switch,
  TextField,
} from "@mui/material";
import type {
  CreateUserInput,
  UpdateUserInput,
  User,
} from "../../features/users/types";

interface UserFormDialogProps {
  open: boolean;
  initialValue: User | null;
  onClose: () => void;
  onSubmit: (values: CreateUserInput | UpdateUserInput) => Promise<void> | void;
}

const emptyForm = {
  name: "",
  email: "",
  password: "",
  role: "staff" as User["role"],
  active: true,
  phone: "",
};

type FormState = typeof emptyForm;

function toFormState(user: User | null): FormState {
  if (!user) return emptyForm;
  return {
    name: user.name,
    email: user.email,
    password: "",
    role: user.role,
    active: user.active,
    phone: user.phone ?? "",
  };
}

export function UserFormDialog({
  open,
  initialValue,
  onClose,
  onSubmit,
}: UserFormDialogProps) {
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
    if (initialValue) {
      await onSubmit({
        name: form.name,
        email: form.email,
        role: form.role,
        active: form.active,
        phone: form.phone || undefined,
      });
    } else {
      await onSubmit({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        active: form.active,
        phone: form.phone || undefined,
      });
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialValue ? "Editar usuario" : "Nuevo usuario"}
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
              label="Email"
              type="email"
              value={form.email}
              onChange={handleChange("email")}
              fullWidth
              required
            />
          </Grid>
          {!initialValue && (
            <Grid size={12}>
              <TextField
                label="Contraseña"
                type="password"
                value={form.password}
                onChange={handleChange("password")}
                fullWidth
                required
              />
            </Grid>
          )}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              select
              label="Rol"
              value={form.role}
              onChange={handleChange("role")}
              fullWidth
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="staff">Staff</MenuItem>
              <MenuItem value="customer">Cliente</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Teléfono"
              value={form.phone}
              onChange={handleChange("phone")}
              fullWidth
            />
          </Grid>
          <Grid size={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={form.active}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, active: e.target.checked }))
                  }
                />
              }
              label="Activo"
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
