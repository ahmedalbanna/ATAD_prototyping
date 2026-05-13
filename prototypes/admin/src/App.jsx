import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import AdminAssets from "./pages/AdminAssets";
import AdminAssetDetail from "./pages/AdminAssetDetail";
import AdminBookings from "./pages/AdminBookings";
import AdminBookingDetail from "./pages/AdminBookingDetail";
import AdminUserDetail from "./pages/AdminUserDetail";
import AdminRevenue from "./pages/AdminRevenue";

export default function App() {
  return (
    <Routes>
      <Route path="/admin" element={<Dashboard />} />
      <Route path="/admin/users" element={<Users />} />
      <Route path="/admin/user/:id" element={<AdminUserDetail />} />
      <Route path="/admin/assets" element={<AdminAssets />} />
      <Route path="/admin/asset/:id" element={<AdminAssetDetail />} />
      <Route path="/admin/bookings" element={<AdminBookings />} />
      <Route path="/admin/booking/:id" element={<AdminBookingDetail />} />
      <Route path="/admin/revenue" element={<AdminRevenue />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
