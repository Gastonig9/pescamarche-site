import { createBrowserRouter } from "react-router-dom";
import { RequireAuth } from "../components/auth/RequireAuth";
import { RequireRole } from "../components/auth/RequireRole";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { LoginPage } from "../pages/LoginPage/LoginPage";
import { HomePage } from "../pages/HomePage/HomePage";
import { ProductsPage } from "../pages/ProductsPage/ProductsPage";
import { OrdersPage } from "../pages/OrdersPage/OrdersPage";
import { UsersPage } from "../pages/UsersPage/UsersPage";
import { SettingsPage } from "../pages/SettingsPage/SettingsPage";
import { NotificationsPage } from "../pages/NotificationsPage/NotificationsPage";

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  {
    element: <RequireAuth />,
    children: [
      {
        path: "/",
        element: <DashboardLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: "productos", element: <ProductsPage /> },
          { path: "pedidos", element: <OrdersPage /> },
          { path: "notificaciones", element: <NotificationsPage /> },
          {
            element: <RequireRole roles={["admin"]} />,
            children: [
              { path: "usuarios", element: <UsersPage /> },
              { path: "configuracion", element: <SettingsPage /> },
            ],
          },
        ],
      },
    ],
  },
]);
