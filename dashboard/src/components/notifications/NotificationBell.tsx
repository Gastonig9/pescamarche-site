import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Badge,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Popover,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkReadMutation,
  useMarkAllReadMutation,
  useDeleteNotificationMutation,
} from "../../features/notifications/notificationsApi";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Ahora";
  if (m < 60) return `Hace ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `Hace ${h} h`;
  return `Hace ${Math.floor(h / 24)} d`;
}

export function NotificationBell() {
  const navigate = useNavigate();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const open = Boolean(anchor);

  // Poll unread count every 10 seconds
  const { data: unread } = useGetUnreadCountQuery(undefined, {
    pollingInterval: 10_000,
  });

  // Fetch full list only when popover is open
  const { data: notifications, isLoading } = useGetNotificationsQuery(
    undefined,
    { skip: !open },
  );

  const [markRead] = useMarkReadMutation();
  const [markAllRead] = useMarkAllReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  function handleOpen(e: React.MouseEvent<HTMLElement>) {
    setAnchor(e.currentTarget);
  }

  function handleClose() {
    setAnchor(null);
  }

  async function handleClick(id: string, link?: string) {
    await markRead(id);
    if (link) {
      handleClose();
      navigate(link);
    }
  }

  const count = unread?.count ?? 0;

  return (
    <>
      <Tooltip title="Notificaciones">
        <IconButton color="inherit" onClick={handleOpen}>
          <Badge
            badgeContent={count > 0 ? count : undefined}
            color="error"
            max={99}
          >
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      <Popover
        open={open}
        anchorEl={anchor}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { width: 380, maxHeight: 520 } } }}
      >
        {/* Header */}
        <Stack
          direction="row"
          sx={{
            px: 2,
            py: 1.25,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Notificaciones
            {count > 0 && (
              <Typography
                component="span"
                sx={{
                  ml: 1,
                  fontSize: 12,
                  color: "error.main",
                  fontWeight: 700,
                }}
              >
                ({count} sin leer)
              </Typography>
            )}
          </Typography>
          {count > 0 && (
            <Button
              size="small"
              startIcon={<DoneAllIcon fontSize="small" />}
              onClick={() => markAllRead()}
              sx={{ fontSize: 11 }}
            >
              Leer todo
            </Button>
          )}
        </Stack>
        <Divider />

        {/* List */}
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress size={28} />
          </Box>
        ) : !notifications || notifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Sin notificaciones 🎉
            </Typography>
          </Box>
        ) : (
          <List disablePadding sx={{ maxHeight: 420, overflow: "auto" }}>
            {notifications.map((n, i) => (
              <Box key={n._id}>
                {i > 0 && <Divider component="li" />}
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    cursor: n.link ? "pointer" : "default",
                    bgcolor: n.read ? "transparent" : "primary.50",
                    "&:hover": { bgcolor: "action.hover" },
                    pr: 1,
                  }}
                  onClick={() => handleClick(n._id, n.link)}
                  secondaryAction={
                    <Tooltip title="Eliminar">
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(n._id);
                        }}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  }
                >
                  <ListItemText
                    primary={
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ alignItems: "center" }}
                      >
                        {!n.read && (
                          <Box
                            sx={{
                              width: 7,
                              height: 7,
                              borderRadius: "50%",
                              bgcolor: "primary.main",
                              flexShrink: 0,
                            }}
                          />
                        )}
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: n.read ? 400 : 700 }}
                          noWrap
                        >
                          {n.title}
                        </Typography>
                      </Stack>
                    }
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.secondary"
                          sx={{ display: "block", fontSize: 12 }}
                        >
                          {n.body}
                        </Typography>
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.disabled"
                        >
                          {timeAgo(n.createdAt)}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              </Box>
            ))}
          </List>
        )}
      </Popover>
    </>
  );
}
