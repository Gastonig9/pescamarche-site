import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  IconButton,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  useCreateUserMutation,
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../features/users/usersApi";
import type {
  CreateUserInput,
  UpdateUserInput,
  User,
} from "../../features/users/types";
import { UserFormDialog } from "./UserFormDialog";

export function UsersPage() {
  const { data: users, isLoading } = useGetUsersQuery();
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [dialogError, setDialogError] = useState("");
  const [snackbar, setSnackbar] = useState<{
    msg: string;
    severity: "success" | "error";
  } | null>(null);

  function handleNew() {
    setEditingUser(null);
    setDialogError("");
    setDialogOpen(true);
  }

  function handleEdit(user: User) {
    setEditingUser(user);
    setDialogError("");
    setDialogOpen(true);
  }

  async function handleDelete(id: string) {
    if (confirm("¿Eliminar este usuario?")) {
      try {
        await deleteUser(id).unwrap();
        setSnackbar({ msg: "Usuario eliminado.", severity: "success" });
      } catch {
        setSnackbar({
          msg: "No se pudo eliminar el usuario.",
          severity: "error",
        });
      }
    }
  }

  async function handleSubmit(values: CreateUserInput | UpdateUserInput) {
    setDialogError("");
    try {
      if (editingUser) {
        const userId = editingUser._id || editingUser.id || "";
        await updateUser({
          id: userId,
          body: values as UpdateUserInput,
        }).unwrap();
        setSnackbar({
          msg: "Usuario actualizado correctamente.",
          severity: "success",
        });
      } else {
        await createUser(values as CreateUserInput).unwrap();
        setSnackbar({
          msg: "Usuario creado correctamente.",
          severity: "success",
        });
      }
      setDialogOpen(false);
    } catch (err: unknown) {
      const message = (err as { data?: { message?: string | string[] } })?.data
        ?.message;
      const text = Array.isArray(message)
        ? message.join(" ")
        : (message ?? "Ocurrió un error. Revisá los datos e intentá de nuevo.");
      setDialogError(text);
    }
  }

  const columns: GridColDef<User>[] = [
    { field: "name", headerName: "Nombre", flex: 1, minWidth: 160 },
    { field: "email", headerName: "Email", flex: 1, minWidth: 200 },
    {
      field: "role",
      headerName: "Rol",
      width: 120,
      renderCell: (params) => <Chip size="small" label={params.value} />,
    },
    {
      field: "active",
      headerName: "Activo",
      width: 100,
      renderCell: (params) => (params.value ? "Sí" : "No"),
    },
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
            onClick={() => handleDelete(params.row._id || params.row.id || "")}
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
          Usuarios
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleNew}>
          Nuevo usuario
        </Button>
      </Stack>

      <Box sx={{ height: 560, backgroundColor: "background.paper" }}>
        <DataGrid
          rows={users ?? []}
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

      <UserFormDialog
        open={dialogOpen}
        initialValue={editingUser}
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
