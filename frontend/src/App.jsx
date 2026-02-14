import React, { Suspense, lazy, useContext } from "react";
import { Routes, Route } from "react-router-dom";
import { Loader2 } from "lucide-react";

import Header from "./layout/Header";
import Footer from "./layout/Footer";
import PublicRoute from "./routes/PublicRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import { AuthContext } from "./context/AuthContext";
import OrderSuccess from "./components/OrderSuccess";


const Home = lazy(() => import("./pages/Home"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const WishListPage = lazy(() => import("./pages/WishListPage"));
const ProductDetailsPage = lazy(() => import("./pages/ProductDetailPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const PaymentFailure = lazy(() => import("./pages/PaymentFailure"));
const ErrorPage = lazy(() => import("./pages/ErrorPage"));



const PageLoader = () => (
  <div className="w-full h-[60vh] flex items-center justify-center">
    <Loader2 size={42} className="animate-spin text-[#DB4444]" />
  </div>
);

const App = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        <Suspense fallback={<PageLoader />}>
          <Routes>

            {/* PUBLIC ROUTES */}
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/products/:id" element={<ProductDetailsPage />} />

            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <AuthPage />
                </PublicRoute>
              }
            />

            {/* PROTECTED USER ROUTES */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/wishlist"
              element={
                <ProtectedRoute>
                  <WishListPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />

            {/* PAYMENT ROUTES */}
            <Route
              path="/payment-success"
              element={
                <ProtectedRoute>
                  <PaymentSuccess />
                </ProtectedRoute>
              }
            />
          <Route path="/order-success" element={<OrderSuccess />} />
            <Route
              path="/payment-failure"
              element={
                <ProtectedRoute>
                  <PaymentFailure />
                </ProtectedRoute>
              }
            />

            <Route
              path="/order-success"
              element={
                <ProtectedRoute>
                  <PaymentSuccess />
                </ProtectedRoute>
              }
            />

            {/* ADMIN ROUTE */}
            {user?.isAdmin && (
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminPage />
                  </ProtectedRoute>
                }
              />
            )}

            {/* 404 */}
            <Route path="*" element={<ErrorPage />} />

          </Routes>
        </Suspense>
      </main>

      <Footer />
    </div>
  );
};

export default App;
