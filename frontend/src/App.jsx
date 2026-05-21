import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from '@/store/authStore';

import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';

import CatalogPage from '@/pages/customer/CatalogPage';
import CakeDetailPage from '@/pages/customer/CakeDetailPage';
import CartPage from '@/pages/customer/CartPage';
import OrderConfirmationPage from '@/pages/customer/OrderConfirmationPage';
import DashboardPage from '@/pages/customer/DashboardPage';
import SettingsPage from '@/pages/customer/SettingsPage';
import OrderHistoryPage from '@/pages/customer/OrderHistoryPage';
import OrderDetailPage from '@/pages/customer/OrderDetailPage';

import AdminCakesPage from '@/pages/admin/AdminCakesPage';
import AdminCakeDetailPage from '@/pages/admin/AdminCakeDetailPage';
import AdminOrdersPage from '@/pages/admin/AdminOrdersPage';
import AdminOrderDetailPage from '@/pages/admin/AdminOrderDetailPage';
import AdminFlavorsPage from '@/pages/admin/AdminFlavorsPage';
import AdminDecorationsPage from '@/pages/admin/AdminDecorationsPage';
import AdminCakeTypesPage from '@/pages/admin/AdminCakeTypesPage';
import NotFoundPage from '@/pages/NotFoundPage';

function ProtectedRoute({ children }) {
  const token = useAuthStore((s) => s.token);
  return token ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  if (!token) return <Navigate to="/login" replace />;
  if (user?.role !== 'ADMIN') return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected – Catalog */}
        <Route path="/" element={<ProtectedRoute><CatalogPage /></ProtectedRoute>} />
        <Route path="/cakes/:id" element={<ProtectedRoute><CakeDetailPage /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />

        {/* Protected – Customer */}
        <Route
          path="/order-confirmation"
          element={<ProtectedRoute><OrderConfirmationPage /></ProtectedRoute>}
        />
        <Route
          path="/dashboard"
          element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}
        />
        <Route
          path="/settings"
          element={<ProtectedRoute><SettingsPage /></ProtectedRoute>}
        />
        <Route
          path="/orders"
          element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>}
        />
        <Route
          path="/orders/:id"
          element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>}
        />

        {/* Protected – Admin */}
        <Route
          path="/admin"
          element={<AdminRoute><Navigate to="/admin/orders" replace /></AdminRoute>}
        />
        <Route
          path="/admin/cakes"
          element={<AdminRoute><AdminCakesPage /></AdminRoute>}
        />
        <Route
          path="/admin/cakes/:id"
          element={<AdminRoute><AdminCakeDetailPage /></AdminRoute>}
        />
        <Route
          path="/admin/orders"
          element={<AdminRoute><AdminOrdersPage /></AdminRoute>}
        />
        <Route
          path="/admin/orders/:id"
          element={<AdminRoute><AdminOrderDetailPage /></AdminRoute>}
        />

        <Route path="/admin/flavors"     element={<AdminRoute><AdminFlavorsPage /></AdminRoute>} />
        <Route path="/admin/decorations" element={<AdminRoute><AdminDecorationsPage /></AdminRoute>} />
        <Route path="/admin/cake-types"  element={<AdminRoute><AdminCakeTypesPage /></AdminRoute>} />

        {/* Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
