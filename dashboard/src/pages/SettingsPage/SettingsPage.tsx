import { useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  Snackbar,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import AddIcon from "@mui/icons-material/Add";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import {
  useGetLocationsCountQuery,
  useGetLocationsQuery,
  useBulkImportLocationsMutation,
  useClearLocationsMutation,
} from "../../features/locations/locationsApi";
import {
  useGetProductsQuery,
  useBulkImportProductsMutation,
  useClearProductsMutation,
} from "../../features/products/productsApi";
import {
  useGetNotificationTemplatesQuery,
  useCreateNotificationTemplateMutation,
  useUpdateNotificationTemplateMutation,
  useDeleteNotificationTemplateMutation,
} from "../../features/notifications/notificationsApi";
import type { LocationBulkResult } from "../../features/locations/types";
import type { BulkImportResult } from "../../features/products/productsApi";

const locationColumns: GridColDef[] = [
  {
    field: "jurisdiccionProvincia",
    headerName: "Jurisdicción / Provincia",
    flex: 1,
    minWidth: 150,
  },
  { field: "zona", headerName: "Zona", width: 150 },
  {
    field: "partidoComuna",
    headerName: "Partido / Comuna",
    flex: 1,
    minWidth: 150,
  },
  {
    field: "barrioLocalidad",
    headerName: "Barrio / Localidad",
    flex: 1,
    minWidth: 150,
  },
  { field: "codigoPostal", headerName: "Código Postal", width: 120 },
];

interface ImportCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  excelColumns: string;
  count: number;
  importResult: LocationBulkResult | BulkImportResult | null;
  onImportResultClose: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  isClearing: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  children?: React.ReactNode;
}

function ImportCard({
  icon,
  title,
  description,
  excelColumns,
  count,
  importResult,
  onImportResultClose,
  onImport,
  onClear,
  isClearing,
  fileInputRef,
  children,
}: ImportCardProps) {
  return (
    <Card variant="outlined">
      <CardHeader
        avatar={icon}
        title={
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        }
        action={
          <Chip
            label={`${count} registro${count !== 1 ? "s" : ""}`}
            size="small"
            color={count > 0 ? "primary" : "default"}
            sx={{ mt: 1.5 }}
          />
        }
      />
      <Divider />
      <CardContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description} Columnas del Excel: <em>{excelColumns}</em>.
          {count > 0 && " Usá 'Limpiar todo' antes de reimportar desde cero."}
        </Typography>

        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            style={{ display: "none" }}
            onChange={onImport}
          />
          <Button
            variant="contained"
            size="small"
            startIcon={<UploadFileIcon />}
            onClick={() => fileInputRef.current?.click()}
          >
            Importar Excel
          </Button>
          <Button
            variant="outlined"
            size="small"
            color="error"
            startIcon={<DeleteSweepIcon />}
            onClick={onClear}
            disabled={isClearing || count === 0}
          >
            {isClearing ? "Limpiando..." : "Limpiar todo"}
          </Button>
        </Stack>

        {importResult && (
          <Alert
            severity={importResult.errors.length > 0 ? "warning" : "success"}
            onClose={onImportResultClose}
            sx={{ mt: 2 }}
          >
            {importResult.created} registro
            {importResult.created !== 1 ? "s" : ""} importado
            {importResult.created !== 1 ? "s" : ""}.
            {importResult.skipped > 0 &&
              ` ${importResult.skipped} fila${importResult.skipped !== 1 ? "s" : ""} omitida${importResult.skipped !== 1 ? "s" : ""}.`}
            {importResult.errors.length > 0 && (
              <ul style={{ margin: "4px 0 0", paddingLeft: 18 }}>
                {importResult.errors.slice(0, 5).map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
                {importResult.errors.length > 5 && (
                  <li>...y {importResult.errors.length - 5} más.</li>
                )}
              </ul>
            )}
          </Alert>
        )}

        {children}
      </CardContent>
    </Card>
  );
}

export function SettingsPage() {
  const { data: products } = useGetProductsQuery();
  const [bulkImportProducts] = useBulkImportProductsMutation();
  const [clearProducts, { isLoading: isClearingProducts }] =
    useClearProductsMutation();
  const productFileRef = useRef<HTMLInputElement>(null);
  const [productImportResult, setProductImportResult] =
    useState<BulkImportResult | null>(null);

  const { data: locationsCount } = useGetLocationsCountQuery();
  const { data: locations, isLoading: loadingLocations } =
    useGetLocationsQuery();
  const [bulkImportLocations] = useBulkImportLocationsMutation();
  const [clearLocations, { isLoading: isClearingLocations }] =
    useClearLocationsMutation();
  const locationFileRef = useRef<HTMLInputElement>(null);
  const [locationImportResult, setLocationImportResult] =
    useState<LocationBulkResult | null>(null);

  // Notification templates
  const { data: templates } = useGetNotificationTemplatesQuery();
  const [createTemplate] = useCreateNotificationTemplateMutation();
  const [updateTemplate] = useUpdateNotificationTemplateMutation();
  const [deleteTemplate] = useDeleteNotificationTemplateMutation();
  const [newTpl, setNewTpl] = useState({
    type: "",
    label: "",
    icon: "🔔",
    description: "",
  });
  const [addingTpl, setAddingTpl] = useState(false);

  const [snackbar, setSnackbar] = useState<{
    msg: string;
    severity: "success" | "error";
  } | null>(null);

  const [confirmDialog, setConfirmDialog] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  async function handleProductImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    const formData = new FormData();
    formData.append("file", file);
    try {
      const result = await bulkImportProducts(formData).unwrap();
      setProductImportResult(result);
    } catch {
      setSnackbar({
        msg: "Error al procesar el archivo de productos.",
        severity: "error",
      });
    }
  }

  async function handleProductClear() {
    const count = products?.length ?? 0;
    setConfirmDialog({
      title: "Limpiar productos",
      message: `¿Eliminar los ${count} productos cargados? Esta acción no se puede deshacer.`,
      onConfirm: async () => {
        setConfirmDialog(null);
        try {
          const result = await clearProducts().unwrap();
          setSnackbar({
            msg: `Se eliminaron ${result.deleted} productos.`,
            severity: "success",
          });
        } catch {
          setSnackbar({
            msg: "No se pudieron eliminar los productos.",
            severity: "error",
          });
        }
      },
    });
  }

  async function handleLocationImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    const formData = new FormData();
    formData.append("file", file);
    try {
      const result = await bulkImportLocations(formData).unwrap();
      setLocationImportResult(result);
    } catch {
      setSnackbar({
        msg: "Error al procesar el archivo de localidades.",
        severity: "error",
      });
    }
  }

  async function handleLocationClear() {
    const count = locationsCount ?? 0;
    setConfirmDialog({
      title: "Limpiar localidades",
      message: `¿Eliminar las ${count} localidades cargadas? Esta acción no se puede deshacer.`,
      onConfirm: async () => {
        setConfirmDialog(null);
        try {
          const result = await clearLocations().unwrap();
          setSnackbar({
            msg: `Se eliminaron ${result.deleted} localidades.`,
            severity: "success",
          });
        } catch {
          setSnackbar({
            msg: "No se pudieron eliminar las localidades.",
            severity: "error",
          });
        }
      },
    });
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Configuración
      </Typography>

      <Stack spacing={3}>
        <ImportCard
          icon={<Inventory2Icon color="primary" />}
          title="Importación de Productos"
          description="Cargá el catálogo completo desde un archivo Excel."
          excelColumns="Nombre, Descripción, Precio, Stock, SKU, Marca, Categoría, Subcategoría"
          count={products?.length ?? 0}
          importResult={productImportResult}
          onImportResultClose={() => setProductImportResult(null)}
          onImport={handleProductImport}
          onClear={handleProductClear}
          isClearing={isClearingProducts}
          fileInputRef={productFileRef}
        />

        <ImportCard
          icon={<LocationOnIcon color="primary" />}
          title="Localidades y Barrios (AMBA + CABA)"
          description="Base de localidades para la gestión de envíos."
          excelColumns="Jurisdicción / Provincia, Zona, Partido / Comuna, Barrio / Localidad, Código Postal (CPA / CP)"
          count={locationsCount ?? 0}
          importResult={locationImportResult}
          onImportResultClose={() => setLocationImportResult(null)}
          onImport={handleLocationImport}
          onClear={handleLocationClear}
          isClearing={isClearingLocations}
          fileInputRef={locationFileRef}
        >
          {(locationsCount ?? 0) > 0 && (
            <Box sx={{ height: 400, mt: 2 }}>
              <DataGrid
                rows={locations ?? []}
                columns={locationColumns}
                loading={loadingLocations}
                disableRowSelectionOnClick
                getRowId={(row) => row._id || row.id || ""}
                initialState={{
                  pagination: { paginationModel: { pageSize: 25 } },
                }}
                pageSizeOptions={[25, 50, 100]}
                density="compact"
              />
            </Box>
          )}
        </ImportCard>
      </Stack>

      {/* Notification templates */}
      <Card variant="outlined" sx={{ mt: 3 }}>
        <CardHeader
          avatar={<NotificationsIcon color="primary" />}
          title={
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Tipos de notificaciones
            </Typography>
          }
          action={
            <Button
              size="small"
              startIcon={<AddIcon />}
              onClick={() => setAddingTpl(true)}
              sx={{ mt: 1 }}
            >
              Nuevo tipo
            </Button>
          }
        />
        <Divider />
        <CardContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Activá o desactivá cada tipo de notificación. Las desactivadas no se
            generarán aunque ocurra el evento.
          </Typography>

          {addingTpl && (
            <Stack
              direction="row"
              spacing={1}
              sx={{ mb: 2, flexWrap: "wrap", alignItems: "flex-end" }}
            >
              <TextField
                size="small"
                label="Emoji"
                value={newTpl.icon}
                onChange={(e) =>
                  setNewTpl((p) => ({ ...p, icon: e.target.value }))
                }
                sx={{ width: 70 }}
              />
              <TextField
                size="small"
                label="Tipo (key)"
                value={newTpl.type}
                onChange={(e) =>
                  setNewTpl((p) => ({ ...p, type: e.target.value }))
                }
                sx={{ width: 160 }}
              />
              <TextField
                size="small"
                label="Etiqueta"
                value={newTpl.label}
                onChange={(e) =>
                  setNewTpl((p) => ({ ...p, label: e.target.value }))
                }
                sx={{ width: 180 }}
              />
              <TextField
                size="small"
                label="Descripción"
                value={newTpl.description}
                onChange={(e) =>
                  setNewTpl((p) => ({ ...p, description: e.target.value }))
                }
                sx={{ flexGrow: 1, minWidth: 200 }}
              />
              <Button
                size="small"
                variant="contained"
                disabled={!newTpl.type || !newTpl.label}
                onClick={async () => {
                  await createTemplate(newTpl);
                  setNewTpl({
                    type: "",
                    label: "",
                    icon: "🔔",
                    description: "",
                  });
                  setAddingTpl(false);
                }}
              >
                Guardar
              </Button>
              <Button size="small" onClick={() => setAddingTpl(false)}>
                Cancelar
              </Button>
            </Stack>
          )}

          <Stack spacing={1}>
            {(templates ?? []).map((tpl) => (
              <Stack
                key={tpl._id}
                direction="row"
                sx={{
                  alignItems: "center",
                  p: 1.25,
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography sx={{ fontSize: 20, mr: 1.5 }}>
                  {tpl.icon}
                </Typography>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {tpl.label}
                    <Chip
                      label={tpl.type}
                      size="small"
                      variant="outlined"
                      sx={{ ml: 1, fontSize: 10, height: 18 }}
                    />
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {tpl.description}
                  </Typography>
                </Box>
                <FormControlLabel
                  control={
                    <Switch
                      size="small"
                      checked={tpl.enabled}
                      onChange={(e) =>
                        updateTemplate({
                          id: tpl._id,
                          body: { enabled: e.target.checked },
                        })
                      }
                    />
                  }
                  label={tpl.enabled ? "Activa" : "Inactiva"}
                  sx={{ mr: 1 }}
                />
                <Tooltip title="Eliminar">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => deleteTemplate(tpl._id)}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            ))}
          </Stack>
        </CardContent>
      </Card>

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

      <Dialog
        open={Boolean(confirmDialog)}
        onClose={() => setConfirmDialog(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>{confirmDialog?.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{confirmDialog?.message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(null)}>Cancelar</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => confirmDialog?.onConfirm()}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
