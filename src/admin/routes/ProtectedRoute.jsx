import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import authService from '../services/authService';
export default function ProtectedRoute({ children }) {
  const [authenticated, setAuthenticated] = useState(
    authService.isAuthenticated()
  );

  useEffect(() => {
    const handleAuthChange = () => {
      setAuthenticated(authService.isAuthenticated());
    };

    window.addEventListener("auth-change", handleAuthChange);

    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
    };
  }, []);

  if (!authenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}