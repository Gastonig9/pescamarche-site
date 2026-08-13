import { useState } from "react";
import {
  Link as RouterLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import GroupIcon from "@mui/icons-material/Group";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logout } from "../../features/auth/authSlice";
import logo from "../../assets/pescamarche-logo.png";

const DRAWER_WIDTH = 240;

const navItems = [
  { label: "Inicio", to: "/", icon: <HomeIcon />, roles: null },
  {
    label: "Productos",
    to: "/productos",
    icon: <Inventory2Icon />,
    roles: null,
  },
  {
    label: "Pedidos",
    to: "/pedidos",
    icon: <LocalShippingIcon />,
    roles: null,
  },
  { label: "Usuarios", to: "/usuarios", icon: <GroupIcon />, roles: ["admin"] },
];

export function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const sessionExpired = useAppSelector((state) => state.auth.sessionExpired);
  // Filter nav items by role; null means visible to everyone
  const visibleNavItems = navItems.filter(
    (item) => !item.roles || item.roles.includes(user?.role ?? ""),
  );

  function handleLogout() {
    setAnchorEl(null);
    dispatch(logout());
    navigate("/login", { replace: true });
  }

  function handleSessionExpiredLogin() {
    dispatch(logout());
    navigate("/login", { replace: true });
  }

  const drawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Toolbar sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box
          component="img"
          src={logo}
          alt="Pesca Marché"
          sx={{ height: 36 }}
        />
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 700 }}
          color="primary"
        >
          Pescamarche
        </Typography>
      </Toolbar>
      <List sx={{ flex: 1 }}>
        {visibleNavItems.map((item) => (
          <ListItemButton
            key={item.to}
            component={RouterLink}
            to={item.to}
            selected={location.pathname === item.to}
            onClick={() => setMobileOpen(false)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileOpen(true)}
            sx={{ display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" component="div">
            Panel de gestión
          </Typography>

          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: "warning.main" }}>
              {user?.name?.[0]?.toUpperCase() ?? "U"}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem disabled>{user?.name ?? "Usuario"}</MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Cerrar sesión
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": { width: DRAWER_WIDTH },
          }}
        >
          {drawerContent}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: "100vh",
          backgroundColor: "background.default",
        }}
      >
        <Toolbar />
        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>

      {/* Session expired — forces re-login, no dismiss */}
      <Dialog open={sessionExpired} disableEscapeKeyDown>
        <DialogTitle>Sesión expirada</DialogTitle>
        <DialogContent>
          <Typography>
            Tu sesión ha expirado o no tenés permisos para esta acción. Por
            favor, volvé a iniciar sesión.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={handleSessionExpiredLogin}
            autoFocus
          >
            Ir al login
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
