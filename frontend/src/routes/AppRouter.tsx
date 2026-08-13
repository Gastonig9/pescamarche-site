import { createBrowserRouter } from "react-router-dom";
import { Layout } from "../components/layout/Layout";
import { LandingPage } from "../pages/LandingPage/LandingPage";
import { ProductsPage } from "../pages/ProductsPage/ProductsPage";
import { ProductDetailPage } from "../pages/ProductDetailPage/ProductDetailPage";
import { AboutPage } from "../pages/AboutPage/AboutPage";
import { FaqPage } from "../pages/FaqPage/FaqPage";
import { ContactPage } from "../pages/ContactPage/ContactPage";
import { CartPage } from "../pages/CartPage/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage/CheckoutPage";
import { OrderConfirmedPage } from "../pages/OrderConfirmedPage/OrderConfirmedPage";
import { PaymentFailurePage } from "../pages/PaymentFailurePage/PaymentFailurePage";
import { PendingPaymentPage } from "../pages/PendingPaymentPage/PendingPaymentPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "productos", element: <ProductsPage /> },
      { path: "productos/:id", element: <ProductDetailPage /> },
      { path: "quienes-somos", element: <AboutPage /> },
      { path: "preguntas-frecuentes", element: <FaqPage /> },
      { path: "contacto", element: <ContactPage /> },
      { path: "carrito", element: <CartPage /> },
      { path: "checkout", element: <CheckoutPage /> },
      { path: "pedido-confirmado", element: <OrderConfirmedPage /> },
      { path: "pago-fallido", element: <PaymentFailurePage /> },
      { path: "pedido-pendiente", element: <PendingPaymentPage /> },
    ],
  },
]);
