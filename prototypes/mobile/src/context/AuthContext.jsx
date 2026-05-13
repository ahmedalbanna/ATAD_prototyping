import { createContext, useContext, useState, useEffect } from "react";
import { users } from "../data/mock";

const AuthContext = createContext(null);
const STORAGE_KEY = "atad_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  const login = (phone, role = "tenant", name = null) => {
    const existing = users.find(u => u.phone === phone);
    const u = existing || { id: Date.now(), name: name || `مستخدم ${phone.slice(-4)}`, phone, role };
    setUser(u);
    return u;
  };

  const switchUser = (targetUser) => {
    setUser(targetUser);
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{
      user, login, logout, switchUser,
      isLessor: user?.role === "lessor",
      isTenant: user?.role === "tenant",
      isAdmin: user?.role === "admin",
      allUsers: users,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
