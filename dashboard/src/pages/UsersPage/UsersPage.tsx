import { useState } from "react";
import {
  Box,
  Button,
  Chip,
  IconButton,
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
  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  function handleNew() {
    setEditingUser(null);
    setDialogOpen(true);
  }

  function handleEdit(user: User) {
    setEditingUser(user);
    setDialogOpen(true);
  }

  async function handleDelete(id: string) {
    if (confirm("¿Eliminar este usuario?")) {
      await deleteUser(id);
    }
  }

  async function handleSubmit(values: CreateUserInput | UpdateUserInput) {
    if (editingUser) {
      const userId = editingUser._id || editingUser.id || "";
      await updateUser({ id: userId, body: values as UpdateUserInput });
    } else {
      await createUser(values as CreateUserInput);
    }
    setDialogOpen(false);
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
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
      />
    </Box>
  );
}
