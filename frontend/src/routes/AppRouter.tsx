import { createBrowserRouter } from "react-router-dom";
import { Layout } from "../components/layout/Layout";
import { LandingPage } from "../pages/LandingPage/LandingPage";
import { ProductsPage } from "../pages/ProductsPage/ProductsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "productos", element: <ProductsPage /> },
    ],
  },
]);
