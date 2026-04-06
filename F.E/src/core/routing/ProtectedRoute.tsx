import { Navigate, useLocation } from "react-router-dom";
import { getAccessToken } from "../utils/cookies";
import type React from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const token = getAccessToken();

  if (!token) return <Navigate to="/login" state={{ from: location }} replace />;
  else if (location.pathname === "/login") return <Navigate to="/" />;
  return children;
};

export default ProtectedRoute;
