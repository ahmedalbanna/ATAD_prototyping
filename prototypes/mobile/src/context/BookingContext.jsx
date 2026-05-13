import { createContext, useContext, useState, useEffect } from "react";
import { bookings as initialBookings } from "../data/mock";

const BookingContext = createContext(null);
const STORAGE_KEY = "atad_bookings";

export function BookingProvider({ children }) {
  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialBookings;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  }, [bookings]);

  const createBooking = ({ assetId, assetTitle, assetImage, tenantId, tenantName, startDate, endDate, totalPrice }) => {
    const newBooking = {
      id: Date.now(),
      assetId, assetTitle, assetImage,
      tenantId, tenantName,
      startDate, endDate, totalPrice,
      status: "pending",
      paymentStatus: null,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setBookings(prev => [newBooking, ...prev]);
    return newBooking;
  };

  const updateStatus = (bookingId, newStatus) => {
    setBookings(prev => prev.map(b =>
      b.id === bookingId ? { ...b, status: newStatus } : b
    ));
  };

  const setPaymentStatus = (bookingId, status) => {
    setBookings(prev => prev.map(b =>
      b.id === bookingId ? { ...b, paymentStatus: status, status: status === "paid" ? "active" : b.status } : b
    ));
  };

  const cancelBooking = (bookingId) => {
    setBookings(prev => prev.map(b =>
      b.id === bookingId ? { ...b, status: "rejected" } : b
    ));
  };

  const completeBooking = (bookingId) => {
    setBookings(prev => prev.map(b =>
      b.id === bookingId ? { ...b, status: "completed" } : b
    ));
  };

  return (
    <BookingContext.Provider value={{
      bookings,
      createBooking,
      updateStatus,
      setPaymentStatus,
      cancelBooking,
      completeBooking,
      getBookingsByTenant: (tenantId) => bookings.filter(b => b.tenantId === tenantId),
      getBookingsByAsset: (assetId) => bookings.filter(b => b.assetId === assetId),
    }}>
      {children}
    </BookingContext.Provider>
  );
}

export const useBookings = () => useContext(BookingContext);
