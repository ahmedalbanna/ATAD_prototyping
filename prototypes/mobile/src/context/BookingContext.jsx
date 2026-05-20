import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { api } from "../services/apiClient";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [assetOwnerIds, setAssetOwnerIds] = useState([]);
  const notifiedRef = useRef(new Set());
  const prevUserIdRef = useRef(null);

  useEffect(() => {
    if (user) fetchMyAssetIds();
  }, [user]);

  const fetchMyAssetIds = async () => {
    try {
      const data = await api.get(`/assets?owner_id=${user.id}`);
      const list = Array.isArray(data) ? data : data?.data || [];
      setAssetOwnerIds(list.map(a => a.id));
    } catch {
      setAssetOwnerIds([]);
    }
  };

  const fetchBookings = useCallback(async () => {
    if (!user) { setBookings([]); return; }
    try {
      const data = await api.get("/bookings");
      setBookings(Array.isArray(data) ? data : data?.data || []);
    } catch {
      // API unavailable
    }
  }, [user]);

  const fetchNotifications = useCallback(async () => {
    if (!user) { setNotifications([]); return; }
    try {
      const data = await api.get("/notifications");
      const list = Array.isArray(data) ? data : data?.data || [];
      setNotifications(list);

      if (prevUserIdRef.current !== user.id) {
        notifiedRef.current.clear();
        prevUserIdRef.current = user.id;
      }

      list.forEach(n => {
        const key = `${n.id}-${n.is_read}`;
        if (!n.is_read && !notifiedRef.current.has(key)) {
          notifiedRef.current.add(key);
          showToast(n.title, n.type === "system" ? "info" : "info");
        }
      });
    } catch {
      // API unavailable
    }
  }, [user, showToast]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);
  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  useEffect(() => {
    if (!user) return;
    const id = setInterval(() => { fetchBookings(); fetchNotifications(); }, 5000);
    return () => clearInterval(id);
  }, [user, fetchBookings, fetchNotifications]);

  const createBooking = useCallback(async ({ assetId, startDate, endDate, totalPrice }) => {
    setCreating(true);
    try {
      const body = { asset_id: assetId, start_date: startDate, end_date: endDate };
      if (totalPrice != null) body.total_price = totalPrice;
      const booking = await api.post("/bookings", body);
      setBookings(prev => [booking, ...prev]);
      return booking;
    } finally {
      setCreating(false);
    }
  }, []);

  const updateStatus = useCallback(async (bookingId, newStatus) => {
    setUpdating(true);
    try {
      const booking = await api.patch(`/bookings/${bookingId}/status`, { status: newStatus });
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, ...booking, status: newStatus } : b));
      return booking;
    } finally {
      setUpdating(false);
    }
  }, []);

  const completeBooking = useCallback(async (bookingId) => {
    return updateStatus(bookingId, "completed");
  }, [updateStatus]);

  const cancelBooking = useCallback(async (bookingId) => {
    setCanceling(true);
    try {
      const booking = await api.post(`/bookings/${bookingId}/cancel`);
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, ...booking, status: "cancelled" } : b));
      return booking;
    } finally {
      setCanceling(false);
    }
  }, []);

  const setPaymentStatus = useCallback(async (bookingId) => {
    setUpdating(true);
    try {
      const result = await api.post("/payments", { booking_id: bookingId, method: "mock" });
      await fetchBookings();
      return result;
    } finally {
      setUpdating(false);
    }
  }, [fetchBookings]);

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

  const asTenant = bookings.filter(b => b.tenant?.id === user?.id);
  const asLessor = bookings.filter(b => assetOwnerIds.includes(b.asset?.id));

  return (
    <BookingContext.Provider value={{
      bookings, creating, updating, canceling,
      asTenant, asLessor,
      fetchBookings,
      createBooking, updateStatus, completeBooking, setPaymentStatus, cancelBooking,
      notifications, unreadCount, markNotificationRead, markAllNotificationsRead,
    }}>
      {children}
    </BookingContext.Provider>
  );
}

export const useBookings = () => useContext(BookingContext);
