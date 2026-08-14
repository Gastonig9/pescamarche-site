import {
  Alert,
  Box,
  Button,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";
import { useState } from "react";
import {
  useGetNotificationsQuery,
  useMarkReadMutation,
  useMarkAllReadMutation,
  useDeleteNotificationMutation,
  useGetUnreadCountQuery,
} from "../../features/notifications/notificationsApi";
import { useNavigate } from "react-router-dom";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Ahora";
  if (m < 60) return `Hace ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `Hace ${h} h`;
  const d = Math.floor(h / 24);
  return `Hace ${d} d`;
}

export function NotificationsPage() {
  const navigate = useNavigate();
  const { data: notifications, isLoading } = useGetNotificationsQuery();
  const { data: unread } = useGetUnreadCountQuery(undefined, {
    pollingInterval: 10_000,
  });
  const [markRead] = useMarkReadMutation();
  const [markAllRead] = useMarkAllReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();
  const [snackbar, setSnackbar] = useState("");

  async function handleMarkAllRead() {
    await markAllRead();
    setSnackbar("Todas las notificaciones marcadas como leídas.");
  }

  async function handleDelete(id: string) {
    await deleteNotification(id);
  }

  async function handleClick(id: string, read: boolean, link?: string) {
    if (!read) await markRead(id);
    if (link) navigate(link);
  }

  const unreadCount = unread?.count ?? 0;

  return (
    <Box>
      <Stack
        direction="row"
        sx={{ justifyContent: "space-between", alignItems: "center", mb: 3 }}
      >
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Notificaciones
          </Typography>
          {unreadCount > 0 && (
            <Chip
              label={`${unreadCount} sin leer`}
              color="error"
              size="small"
            />
          )}
        </Stack>
        {unreadCount > 0 && (
          <Button startIcon={<DoneAllIcon />} onClick={handleMarkAllRead}>
            Marcar todo como leído
          </Button>
        )}
      </Stack>

      {isLoading && <Typography color="text.secondary">Cargando...</Typography>}

      {!isLoading && (!notifications || notifications.length === 0) && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h2">🎉</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            No hay notificaciones
          </Typography>
        </Box>
      )}

      {notifications && notifications.length > 0 && (
        <List
          sx={{
            bgcolor: "background.paper",
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            p: 0,
          }}
        >
          {notifications.map((n, i) => (
            <ListItem
              key={n._id}
              divider={i < notifications.length - 1}
              sx={{
                borderLeft: n.read ? "4px solid transparent" : "4px solid",
                borderLeftColor: n.read ? "transparent" : "primary.main",
                bgcolor: n.read ? "transparent" : "action.hover",
                cursor: n.link ? "pointer" : "default",
                "&:hover": { bgcolor: "action.selected" },
                gap: 1,
              }}
              onClick={() => handleClick(n._id, n.read, n.link)}
              secondaryAction={
                <Stack direction="row" spacing={0.5}>
                  {!n.read && (
                    <Tooltip title="Marcar como leída">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          markRead(n._id);
                        }}
                      >
                        <CheckCircleOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Eliminar">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(n._id);
                      }}
                    >
                      <DeleteOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              }
            >
              {/* Unread dot */}
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: n.read ? "transparent" : "primary.main",
                  flexShrink: 0,
                  mt: 0.5,
                }}
              />
              <ListItemText
                primary={
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ alignItems: "center" }}
                  >
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: n.read ? 400 : 700 }}
                    >
                      {n.title}
                    </Typography>
                    <Chip
                      label={n.type}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: 10, height: 18 }}
                    />
                  </Stack>
                }
                secondary={
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{ alignItems: "center", mt: 0.25 }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {n.body}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.disabled"
                      sx={{ whiteSpace: "nowrap" }}
                    >
                      {timeAgo(n.createdAt)}
                    </Typography>
                  </Stack>
                }
              />
            </ListItem>
          ))}
        </List>
      )}

      <Snackbar
        open={Boolean(snackbar)}
        autoHideDuration={3000}
        onClose={() => setSnackbar("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setSnackbar("")}>
          {snackbar}
        </Alert>
      </Snackbar>
    </Box>
  );
}
