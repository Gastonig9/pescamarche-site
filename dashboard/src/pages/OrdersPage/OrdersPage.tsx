import { useState } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import {
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
} from "../../features/orders/ordersApi";
import type {
  Order,
  OrderStatus,
  ShippingStatus,
} from "../../features/orders/types";

const statusOptions: { value: OrderStatus; label: string }[] = [
  { value: "pending", label: "Pendiente" },
  { value: "paid", label: "Pagado" },
  { value: "processing", label: "En proceso" },
  { value: "completed", label: "Completado" },
  { value: "cancelled", label: "Cancelado" },
];

const shippingStatusOptions: { value: ShippingStatus; label: string }[] = [
  { value: "pending", label: "Pendiente" },
  { value: "preparing", label: "Preparando" },
  { value: "shipped", label: "Enviado" },
  { value: "delivered", label: "Entregado" },
];

export function OrdersPage() {
  const { data: orders, isLoading } = useGetOrdersQuery();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState<OrderStatus>("pending");
  const [shippingStatus, setShippingStatus] =
    useState<ShippingStatus>("pending");

  function openOrder(order: Order) {
    setSelectedOrder(order);
    setStatus(order.status);
    setShippingStatus(order.shippingStatus);
  }

  async function handleSave() {
    if (!selectedOrder) return;
    const orderId = selectedOrder._id || selectedOrder.id || "";
    await updateOrderStatus({
      id: orderId,
      body: { status, shippingStatus },
    });
    setSelectedOrder(null);
  }

  const columns: GridColDef<Order>[] = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "customer",
      headerName: "Cliente",
      flex: 1,
      minWidth: 160,
      valueGetter: (_value, row) => row.customer?.name,
    },
    {
      field: "total",
      headerName: "Total",
      width: 110,
      valueFormatter: (value: number) => `$${value?.toFixed(2)}`,
    },
    {
      field: "status",
      headerName: "Estado",
      width: 140,
      renderCell: (params) => (
        <Chip
          size="small"
          label={params.value}
          color="primary"
          variant="outlined"
        />
      ),
    },
    {
      field: "shippingStatus",
      headerName: "Envío",
      width: 140,
      renderCell: (params) => (
        <Chip
          size="small"
          label={params.value}
          color="secondary"
          variant="outlined"
        />
      ),
    },
    {
      field: "actions",
      headerName: "",
      width: 130,
      sortable: false,
      renderCell: (params) => (
        <Button size="small" onClick={() => openOrder(params.row)}>
          Gestionar
        </Button>
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Pedidos
      </Typography>

      <Box sx={{ height: 560, backgroundColor: "background.paper" }}>
        <DataGrid
          rows={orders ?? []}
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

      <Dialog
        open={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Pedido #{selectedOrder?.id}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Cliente: {selectedOrder?.customer.name} (
              {selectedOrder?.customer.email})
            </Typography>
            <TextField
              select
              label="Estado del pedido"
              value={status}
              onChange={(e) => setStatus(e.target.value as OrderStatus)}
              fullWidth
            >
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Estado del envío"
              value={shippingStatus}
              onChange={(e) =>
                setShippingStatus(e.target.value as ShippingStatus)
              }
              fullWidth
            >
              {shippingStatusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedOrder(null)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
