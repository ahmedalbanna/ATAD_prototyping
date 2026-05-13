import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import AdminAssets from "./pages/AdminAssets";
import AdminBookings from "./pages/AdminBookings";

export default function App() {
  return (
    <Routes>
      <Route path="/admin" element={<Dashboard />} />
      <Route path="/admin/users" element={<Users />} />
      <Route path="/admin/assets" element={<AdminAssets />} />
      <Route path="/admin/bookings" element={<AdminBookings />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
