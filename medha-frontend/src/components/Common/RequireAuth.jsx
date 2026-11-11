import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import { useTour } from "../../context/TourContext";
import { loginPath } from "../Revision/revisionUtils";
import { hasSession } from "../../config/access";
import { usePlatformAccess } from "../../hooks/usePlatformAccess";

/** Requires a signed-in session (token + user). */
export default function RequireAuth({ children }) {
  const { user, logout } = useContext(AuthContext);
  const { isTourActive } = useTour();
  const location = useLocation();
  const { comingSoon, canAccess } = usePlatformAccess(user);
  const authenticated = hasSession(user);

  if (!authenticated && !isTourActive) {
    if (user && !localStorage.getItem("token")) logout?.();
    const next = `${location.pathname}${location.search || ""}`;
    return <Navigate to={loginPath(next)} replace />;
  }

  if (comingSoon && user && !canAccess) {
    return <Navigate to="/inside" replace />;
  }

  return children;
}
