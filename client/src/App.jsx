import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';

import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { POSPage } from './pages/POSPage';
import { ProductsPage } from './pages/ProductsPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { InventoryPage } from './pages/InventoryPage';
import { CustomersPage } from './pages/CustomersPage';
import { SuppliersPage } from './pages/SuppliersPage';
import { PurchasesPage } from './pages/PurchasesPage';
import { PurchaseNewPage } from './pages/PurchaseNewPage';
import { SalesPage } from './pages/SalesPage';
import { ReturnsPage } from './pages/ReturnsPage';
import { ExpensesPage } from './pages/ExpensesPage';
import { PaymentsPage } from './pages/PaymentsPage';
import { ReportsPage } from './pages/ReportsPage';
import { UsersPage } from './pages/UsersPage';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes inside Layout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/pos" element={<POSPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/sales" element={<SalesPage />} />
              <Route path="/returns" element={<ReturnsPage />} />
              <Route path="/customers" element={<CustomersPage />} />
              <Route path="/payments" element={<PaymentsPage />} />

              {/* Manager & Admin Routes */}
              <Route element={<ProtectedRoute allowedRoles={['Admin', 'Manager']} />}>
                <Route path="/inventory" element={<InventoryPage />} />
                <Route path="/suppliers" element={<SuppliersPage />} />
                <Route path="/purchases" element={<PurchasesPage />} />
                <Route path="/purchases/new" element={<PurchaseNewPage />} />
                <Route path="/expenses" element={<ExpensesPage />} />
                <Route path="/reports" element={<ReportsPage />} />
              </Route>

              {/* Admin Only Routes */}
              <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
                <Route path="/users" element={<UsersPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
            </Route>
          </Route>

          {/* Catch-all Redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
