import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import SellerRequest from './pages/SellerRequest';
import AdminDashboard from './pages/AdminDashboard';
import AdminRequests from './pages/AdminRequests';
import AdminOrders from './pages/AdminOrders';
import AdminSellers from './pages/AdminSellers';
import AdminCreateOrder from './pages/AdminCreateOrder';
import SellerDashboard from './pages/SellerDashboard';
import CreateOrder from './pages/CreateOrder';
import SellerOrders from './pages/SellerOrders';
import Messages from './pages/Messages';
function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/seller-request" element={<SellerRequest />} />
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route element={<Layout role="admin" />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/requests" element={<AdminRequests />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/sellers" element={<AdminSellers />} />
            <Route path="/admin/create-order" element={<AdminCreateOrder />} />
            <Route path="/admin/messages" element={<Messages />} />
          </Route>
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['seller']} />}>
          <Route element={<Layout role="seller" />}>
            <Route path="/seller/dashboard" element={<SellerDashboard />} />
            <Route path="/seller/create-order" element={<CreateOrder />} />
            <Route path="/seller/orders" element={<SellerOrders />} />
            <Route path="/seller/messages" element={<Messages />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
export default App;