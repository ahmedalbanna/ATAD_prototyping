import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "../services/apiClient";
import { useAuth } from "./AuthContext";

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBookings = useCallback(async () => {
    if (!user) { setBookings([]); return; }
    try {
      const data = await api.get("/bookings");
      setBookings(Array.isArray(data) ? data : []);
    } catch {
      setBookings([]);
    }
  }, [user]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const createBooking = useCallback(async ({ assetId, startDate, endDate }) => {
    setLoading(true);
    try {
      const booking = await api.post("/bookings", { asset_id: assetId, start_date: startDate, end_date: endDate });
      setBookings(prev => [booking, ...prev]);
      return booking;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStatus = useCallback(async (bookingId, newStatus) => {
    setLoading(true);
    try {
      const booking = await api.patch(`/bookings/${bookingId}/status`, { status: newStatus });
      setBookings(prev => prev.map(b => b.id === bookingId ? booking : b));
      return booking;
    } finally {
      setLoading(false);
    }
  }, []);

  const setPaymentStatus = useCallback(async (bookingId) => {
    setLoading(true);
    try {
      const result = await api.post("/payments", { booking_id: bookingId, method: "mock" });
      await fetchBookings();
      return result;
    } finally {
      setLoading(false);
    }
  }, [fetchBookings]);

  const cancelBooking = useCallback(async (bookingId) => {
    setLoading(true);
    try {
      const booking = await api.post(`/bookings/${bookingId}/cancel`);
      setBookings(prev => prev.map(b => b.id === bookingId ? booking : b));
      return booking;
    } finally {
      setLoading(false);
    }
  }, []);

  const completeBooking = useCallback(async (bookingId) => {
    return updateStatus(bookingId, "completed");
  }, [updateStatus]);

  return (
    <BookingContext.Provider value={{
      bookings, loading, fetchBookings,
      createBooking, updateStatus, setPaymentStatus, cancelBooking, completeBooking,
    }}>
      {children}
    </BookingContext.Provider>
  );
}

export const useBookings = () => useContext(BookingContext);
