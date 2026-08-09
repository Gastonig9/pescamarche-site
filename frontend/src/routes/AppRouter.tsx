import { createBrowserRouter } from "react-router-dom";
import { Layout } from "../components/layout/Layout";
import { LandingPage } from "../pages/LandingPage/LandingPage";
import { ProductsPage } from "../pages/ProductsPage/ProductsPage";
import { AboutPage } from "../pages/AboutPage/AboutPage";
import { FaqPage } from "../pages/FaqPage/FaqPage";
import { ContactPage } from "../pages/ContactPage/ContactPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "productos", element: <ProductsPage /> },
      { path: "quienes-somos", element: <AboutPage /> },
      { path: "preguntas-frecuentes", element: <FaqPage /> },
      { path: "contacto", element: <ContactPage /> },
    ],
  },
]);
