import { Routes, Route, Navigate } from "react-router-dom";
import Splash from "./pages/Splash";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import AssetList from "./pages/AssetList";
import AssetDetail from "./pages/AssetDetail";
import BookingForm from "./pages/BookingForm";
import MyBookings from "./pages/MyBookings";
import AddAsset from "./pages/AddAsset";
import LessorDashboard from "./pages/LessorDashboard";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/home" element={<Home />} />
      <Route path="/assets" element={<AssetList />} />
      <Route path="/asset/:id" element={<AssetDetail />} />
      <Route path="/book/:id" element={<BookingForm />} />
      <Route path="/bookings" element={<MyBookings />} />
      <Route path="/add-asset" element={<AddAsset />} />
      <Route path="/lessor-dashboard" element={<LessorDashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}
