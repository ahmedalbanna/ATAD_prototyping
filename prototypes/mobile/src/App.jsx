import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Splash from "./pages/Splash";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import AssetList from "./pages/AssetList";
import AssetDetail from "./pages/AssetDetail";
import BookingForm from "./pages/BookingForm";
import BookingDetail from "./pages/BookingDetail";
import Payment from "./pages/Payment";
import MyBookings from "./pages/MyBookings";
import AddAsset from "./pages/AddAsset";
import EditAsset from "./pages/EditAsset";
import LessorDashboard from "./pages/LessorDashboard";
import Notifications from "./pages/Notifications";
import Terms from "./pages/Terms";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/home" element={<Home />} />
        <Route path="/assets" element={<AssetList />} />
        <Route path="/asset/:id" element={<AssetDetail />} />
        <Route path="/book/:id" element={<BookingForm />} />
        <Route path="/booking/:id" element={<BookingDetail />} />
        <Route path="/payment/:id" element={<Payment />} />
        <Route path="/bookings" element={<MyBookings />} />
        <Route path="/add-asset" element={<AddAsset />} />
        <Route path="/edit-asset/:id" element={<EditAsset />} />
        <Route path="/lessor-dashboard" element={<LessorDashboard />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </AuthProvider>
  );
}
