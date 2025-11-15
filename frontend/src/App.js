import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import ProtectedRoute, { AdminRoute } from './components/ProtectedRoute';

// Auth Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Shared Pages
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';

// Categories Page (Admin)
import CategoryPage from './pages/CategoryPage';

// Suppliers Pages (Admin)
import SupplierPage from './pages/SupplierPage';
import SupplierCreatePage from './pages/SupplierCreatePage';
import SupplierEditPage from './pages/SupplierEditPage';

// Products Pages (Admin)
import ProductPage from './pages/ProductPage';
import ProductCreatePage from './pages/ProductCreatePage';
import ProductEditPage from './pages/ProductEditPage';

// Transactions Pages (Shared)
import TransactionsPage from './pages/TransactionsPage';
import TransactionDetailsPage from './pages/TransactionDetailsPage';
import PurchasePage from './pages/PurchasePage';
import SellPage from './pages/SellPage';

function App() {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* PROTECTED ROUTES (for MANAGER and ADMIN) */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/transactions/:id" element={<TransactionDetailsPage />} />
        <Route path="/purchase" element={<PurchasePage />} />
        <Route path="/sell" element={<SellPage />} />
      </Route>

      {/* ADMIN-ONLY ROUTES */}
      <Route
        element={
          <AdminRoute>
            <AppLayout />
          </AdminRoute>
        }
      >
        <Route path="/products" element={<ProductPage />} />
        <Route path="/products/new" element={<ProductCreatePage />} />
        <Route path="/products/:id/edit" element={<ProductEditPage />} />

        <Route path="/categories" element={<CategoryPage />} />

        <Route path="/suppliers" element={<SupplierPage />} />
        <Route path="/suppliers/new" element={<SupplierCreatePage />} />
        <Route path="/suppliers/:id/edit" element={<SupplierEditPage />} />
      </Route>

      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
