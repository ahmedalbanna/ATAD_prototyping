import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function LessorRoute({ children }) {
  const { user, isLessor } = useAuth();
  if (!user) return <Navigate to="/auth" replace />;
  if (!isLessor) return <Navigate to="/home" replace />;
  return children;
}

export function TenantRoute({ children }) {
  const { user, isTenant } = useAuth();
  if (!user) return <Navigate to="/auth" replace />;
  if (!isTenant) return <Navigate to="/home" replace />;
  return children;
}

export function AuthRoute({ children }) {
  const { user, defaultRoute } = useAuth();
  if (user) return <Navigate to={defaultRoute} replace />;
  return children;
}
