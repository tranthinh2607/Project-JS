// PublicRoute.tsx
import { Navigate, useLocation } from "react-router-dom";
import { getAccessToken } from "../utils/cookies";
import type React from "react";

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const location = useLocation();
  const token = getAccessToken();

  const isSigningPage = location.pathname.startsWith("/contracts/sign/");

  if (isSigningPage) {
    return <>{children}</>;
  }
  if (token) return <Navigate to="/" replace />;

  return <>{children}</>;
};

export default PublicRoute;


