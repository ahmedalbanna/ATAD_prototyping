import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "../services/apiClient";
import { users as mockUsers } from "../data/mock";

const AuthContext = createContext(null);
const STORAGE_KEY = "atad_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  const sendOtp = useCallback(async (phone, role) => {
    setLoading(true);
    try {
      await api.post("/auth/send-otp", { phone, role });
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyOtp = useCallback(async (phone, otp, name) => {
    setLoading(true);
    try {
      const result = await api.post("/auth/verify-otp", { phone, otp, name });
      api.setToken(result.token);
      setUser(result.user);
      return result.user;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback((phone, role = "tenant", name = null) => {
    const existing = mockUsers.find(u => u.phone === phone);
    const u = existing || { id: Date.now(), name: name || `مستخدم ${phone.slice(-4)}`, phone, role };
    setUser(u);
    return u;
  }, []);

  const switchUser = useCallback((targetUser) => {
    setUser(targetUser);
  }, []);

  const logout = useCallback(() => {
    api.clearToken();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user, login, logout, switchUser, loading,
      sendOtp, verifyOtp,
      isLessor: user?.role === "lessor",
      isTenant: user?.role === "tenant",
      allUsers: mockUsers,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
