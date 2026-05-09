import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layouts
import UserLayout from "../layouts/ClientLayout";
import AdminLayout from "../layouts/AdminLayout";

// Auth
import ProtectedRouteAdmin from "./ProtectedRouteAdmin";

// Pages
import Home from "../features/home/pages/Home";
import ProductDetail from "../features/product/client/pages/ProductDetail.jsx";

import Dashboard from "../features/dashboard/pages/Dashboard.jsx";
import ProductCreate from "../features/product/admin/pages/ProductCreate.jsx";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import ProductList from "../features/product/admin/pages/AdminProductList.jsx";
import ProductEdit from "../features/product/admin/pages/ProductEdit.jsx";
import ProductImage from "../features/product/admin/pages/ProductImage.jsx";
import Cart from "../features/order/client/pages/Cart";
import Checkout from "../features/order/client/pages/Checkout";
import Success from "../features/order/client/pages/Success";
import TrackOrder from "../features/order/client/pages/TrackOrder";
import OrderDetail from "../features/order/client/pages/OrderDetail";
import AdminOrders from "../features/order/admin/pages/AdminOrders";
import AdminOrderDetail from "../features/order/admin/pages/AdminOrderDetail";

import MyOrders from "../features/order/client/pages/MyOrders";
import AdminUsers from "../features/user/admin/pages/AdminUserList.jsx";
import UserEdit from "../features/user/admin/pages/UserEdit.jsx";
import UserProfile from "../features/user/client/pages/UserProfile.jsx";
import ChangePassword from "../features/user/client/pages/ChangePassword.jsx";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ==== LOGIN ==== */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ==== USER LAYOUT ==== */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/success/:id" element={<Success />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/order/:id" element={<OrderDetail />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/change-password" element={<ChangePassword />} />
        </Route>

        {/* ==== ADMIN LAYOUT + PROTECTED ==== */}
        <Route
          path="/admin"
          element={
            <ProtectedRouteAdmin>
              <AdminLayout />
            </ProtectedRouteAdmin>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/create" element={<ProductCreate />} />
          <Route path="products/edit/:id" element={<ProductEdit />} />
          <Route path="products/:id/images/:color" element={<ProductImage />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="orders/:id" element={<AdminOrderDetail />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/users/:id" element={<UserEdit />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
