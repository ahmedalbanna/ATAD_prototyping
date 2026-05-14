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
  const [isRealAccount, setIsRealAccount] = useState(!!api.getToken());

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  const sendOtp = useCallback(async (phone, role, name) => {
    setLoading(true);
    try {
      const fullPhone = `+966${phone}`;
      const body = { phone: fullPhone, role };
      if (name) body.name = name;
      await api.post("/auth/send-otp", body);
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyOtp = useCallback(async (phone, otp, name) => {
    setLoading(true);
    try {
      const fullPhone = `+966${phone}`;
      const body = { phone: fullPhone, otp };
      if (name) body.name = name;
      const result = await api.post("/auth/verify-otp", body);
      api.setToken(result.token);
      setUser(result.user);
      setIsRealAccount(true);
      return result.user;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (phone, role = "tenant", name = null) => {
    const existing = mockUsers.find(u => u.phone === phone);
    const fullPhone = `+966${phone}`;
    const u = existing || { id: Date.now(), name: name || `مستخدم ${phone.slice(-4)}`, phone, role };
    try {
      await api.post("/auth/send-otp", { phone: fullPhone, role, name: u.name });
      const result = await api.post("/auth/verify-otp", { phone: fullPhone, otp: "000000" });
      if (result.token) api.setToken(result.token);
      setUser(result.user || u);
      setIsRealAccount(true);
      return result.user || u;
    } catch {
      setUser(u);
      setIsRealAccount(false);
      return u;
    }
  }, []);

  const switchUser = useCallback((targetUser) => {
    setUser(targetUser);
    setIsRealAccount(false);
  }, []);

  const logout = useCallback(() => {
    api.clearToken();
    setUser(null);
    setIsRealAccount(false);
  }, []);

  return (
    <AuthContext.Provider value={{
      user, login, logout, switchUser, loading,
      sendOtp, verifyOtp,
      isLessor: user?.role === "lessor",
      isTenant: user?.role === "tenant",
      isRealAccount,
      allUsers: mockUsers,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
