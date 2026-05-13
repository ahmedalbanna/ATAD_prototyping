import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { BookingProvider } from "./context/BookingContext";
import { ToastProvider } from "./context/ToastContext";
import { LessorRoute, AuthRoute } from "./components/ProtectedRoute";
import Splash from "./pages/Splash";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import AssetList from "./pages/AssetList";
import AssetDetail from "./pages/AssetDetail";
import BookingForm from "./pages/BookingForm";
import BookingDetail from "./pages/BookingDetail";
import Payment from "./pages/Payment";
import MyBookings from "./pages/MyBookings";
import RentalHistory from "./pages/RentalHistory";
import RateAsset from "./pages/RateAsset";
import EditProfile from "./pages/EditProfile";
import OnboardingLessor from "./pages/OnboardingLessor";
import OnboardingTenant from "./pages/OnboardingTenant";
import AddAsset from "./pages/AddAsset";
import EditAsset from "./pages/EditAsset";
import LessorDashboard from "./pages/LessorDashboard";
import LessorAssets from "./pages/LessorAssets";
import LessorEarnings from "./pages/LessorEarnings";
import Notifications from "./pages/Notifications";
import Terms from "./pages/Terms";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <AuthProvider>
      <BookingProvider>
      <ToastProvider>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/auth" element={<AuthRoute><Auth /></AuthRoute>} />
        <Route path="/home" element={<Home />} />
        <Route path="/assets" element={<AssetList />} />
        <Route path="/asset/:id" element={<AssetDetail />} />
        <Route path="/book/:id" element={<BookingForm />} />
        <Route path="/booking/:id" element={<BookingDetail />} />
        <Route path="/payment/:id" element={<Payment />} />
        <Route path="/bookings" element={<MyBookings />} />
        <Route path="/rental-history" element={<RentalHistory />} />
        <Route path="/rate/:id" element={<RateAsset />} />
        <Route path="/onboarding/lessor" element={<OnboardingLessor />} />
        <Route path="/onboarding/tenant" element={<OnboardingTenant />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/add-asset" element={<LessorRoute><AddAsset /></LessorRoute>} />
        <Route path="/edit-asset/:id" element={<LessorRoute><EditAsset /></LessorRoute>} />
        <Route path="/lessor-dashboard" element={<LessorRoute><LessorDashboard /></LessorRoute>} />
        <Route path="/lessor-assets" element={<LessorRoute><LessorAssets /></LessorRoute>} />
        <Route path="/lessor-earnings" element={<LessorRoute><LessorEarnings /></LessorRoute>} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
      </ToastProvider>
      </BookingProvider>
    </AuthProvider>
  );
}
