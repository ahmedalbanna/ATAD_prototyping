import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "../services/apiClient";
import { useAuth } from "./AuthContext";

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBookings = useCallback(async () => {
    if (!user) { setBookings([]); return; }
    try {
      const data = await api.get("/bookings");
      setBookings(Array.isArray(data) ? data : []);
    } catch {
      // API unavailable
    }
  }, [user]);

  const fetchNotifications = useCallback(async () => {
    if (!user) { setNotifications([]); return; }
    try {
      const data = await api.get("/notifications");
      setNotifications(Array.isArray(data) ? data : []);
    } catch {
      // API unavailable
    }
  }, [user]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);
  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  // Poll every 5s
  useEffect(() => {
    if (!user) return;
    const id = setInterval(() => { fetchBookings(); fetchNotifications(); }, 5000);
    return () => clearInterval(id);
  }, [user, fetchBookings, fetchNotifications]);

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

  const completeBooking = useCallback(async (bookingId) => {
    return updateStatus(bookingId, "completed");
  }, [updateStatus]);

  const markNotificationRead = useCallback(async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: 1 } : n));
    } catch {}
  }, []);

  const markAllNotificationsRead = useCallback(async () => {
    try {
      await api.patch("/notifications/read-all");
      setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
    } catch {}
  }, []);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <BookingContext.Provider value={{
      bookings, loading, fetchBookings,
      createBooking, updateStatus, setPaymentStatus, cancelBooking, completeBooking,
      notifications, unreadCount, markNotificationRead, markAllNotificationsRead,
    }}>
      {children}
    </BookingContext.Provider>
  );
}

export const useBookings = () => useContext(BookingContext);
