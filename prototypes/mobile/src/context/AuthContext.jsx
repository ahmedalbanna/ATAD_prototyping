import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "../services/apiClient";
import { users as mockUsers } from "../data/mock";

const AuthContext = createContext(null);
const STORAGE_KEY = "atad_user";

const roleLabels = { tenant: "مستأجر", lessor: "مؤجر", admin: "مدير" };
const roleRoutes = { tenant: "/home", lessor: "/lessor-dashboard", admin: "/admin" };

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const hasToken = !!api.getToken();
  const [isRealAccount, setIsRealAccount] = useState(() => {
    return hasToken && !!user;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  useEffect(() => {
    if (!initialized) {
      if (hasToken && !user) {
        api.clearToken();
        setIsRealAccount(false);
      }
      setInitialized(true);
    }
  }, [initialized, hasToken, user]);

  const sendOtp = useCallback(async (phone, role, name) => {
    setLoading(true);
    try {
      const fullPhone = phone.startsWith("+966") ? phone : `+966${phone}`;
      await api.post("/auth/send-otp", { phone: fullPhone, role, ...(name && { name }) });
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyOtp = useCallback(async (phone, otp, role) => {
    setLoading(true);
    try {
      const fullPhone = phone.startsWith("+966") ? phone : `+966${phone}`;
      const result = await api.post("/auth/verify-otp", { phone: fullPhone, otp, ...(role && { role }) });
      if (result.token) api.setToken(result.token);
      if (result.user) {
        setUser(result.user);
        setIsRealAccount(true);
        return result.user;
      }
      throw new Error("لم يتم استلام بيانات المستخدم");
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (phone, role = "tenant", name = null) => {
    setLoading(true);
    try {
      const existing = mockUsers.find(u => u.phone === phone);
      const u = existing || { id: Date.now(), name: name || `مستخدم ${phone.slice(-4)}`, phone, role };
      const fullPhone = `+966${phone}`;

      if (existing) {
        try {
          await api.post("/auth/send-otp", { phone: fullPhone, role, name: u.name });
          const result = await api.post("/auth/verify-otp", { phone: fullPhone, otp: "000000" });
          if (result?.token) api.setToken(result.token);
          if (result?.user) {
            setUser(result.user);
            setIsRealAccount(true);
            return result.user;
          }
        } catch {
          // API unavailable — use mock
        }
      }

      setUser(u);
      setIsRealAccount(false);
      return u;
    } finally {
      setLoading(false);
    }
  }, []);

  const switchUser = useCallback((targetUser) => {
    api.clearToken();
    setUser(targetUser);
    setIsRealAccount(false);
  }, []);

  const logout = useCallback(() => {
    api.clearToken();
    setUser(null);
    setIsRealAccount(false);
  }, []);

  const isLessor = user?.role === "lessor";
  const isTenant = user?.role === "tenant";
  const isLoggedIn = !!user;

  const can = useCallback((action) => {
    if (!user) return false;
    const permissions = {
      "book": isTenant,
      "approve": isLessor,
      "manage-assets": isLessor,
      "view-earnings": isLessor,
      "view-all-assets": true,
    };
    return permissions[action] ?? false;
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user, login, logout, switchUser, loading, initialized,
      sendOtp, verifyOtp,
      isLessor, isTenant, isLoggedIn, isRealAccount,
      roleLabel: roleLabels[user?.role] || "",
      defaultRoute: roleRoutes[user?.role] || "/home",
      allUsers: mockUsers,
      can,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
