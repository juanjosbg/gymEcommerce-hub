import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import NotFound from "./pages/NotFound";
import Faqs from "./pages/faqs/page";
import Contact from "./pages/contact/page";
import ProductsPage from "./pages/producto/page";
import SingleProductPage from "./pages/producto/[productId]/page";
import WishlistPage from "./pages/wishlist/page";
import ProfilePage from "./pages/profile/page";
import { Header } from "./components/Header";
import AdminPage from "./pages/admin/page";

import AdminProductosPage from "./pages/admin/pages/productos/page";
import AdminOrdenesPage from "./pages/admin/pages/ordenes/page";
import AdminStockPage from "./pages/admin/pages/stock/page";
import GlobalLoadingOverlay from "./components/Load/GlobalLoadingOverlay";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <GlobalLoadingOverlay />
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Header />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/register" element={<Register />} />
                <Route
                  path="/auth/forgot-password"
                  element={<ForgotPassword />}
                />
                <Route
                  path="/auth/reset-password"
                  element={<ResetPassword />}
                />
                <Route path="/faqs" element={<Faqs />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/producto" element={<ProductsPage />} />
                <Route
                  path="/producto/:productId"
                  element={<SingleProductPage />}
                />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route
                  path="/products"
                  element={<Navigate to="/producto" replace />}
                />
                <Route path="/profile" element={<ProfilePage />} />
                
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/admin/productos" element={<AdminProductosPage />} />
                <Route path="/admin/ordenes" element={<AdminOrdenesPage />} />{" "}
                <Route path="/admin/stock" element={<AdminStockPage />} />


                <Route path="*" element={<NotFound />} />
              </Routes>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
