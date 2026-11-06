import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import { useTour } from "../../context/TourContext";
import { loginPath } from "../Revision/revisionUtils";
import { canAccessPlatform, IS_COMING_SOON_MODE } from "../../config/appMode";
import { hasSession } from "../../config/access";

/** Requires a signed-in session (token + user). */
export default function RequireAuth({ children }) {
  const { user, logout } = useContext(AuthContext);
  const { isTourActive } = useTour();
  const location = useLocation();
  const authenticated = hasSession(user);

  if (!authenticated && !isTourActive) {
    if (user && !localStorage.getItem("token")) logout?.();
    const next = `${location.pathname}${location.search || ""}`;
    return <Navigate to={loginPath(next)} replace />;
  }

  if (IS_COMING_SOON_MODE && user && !canAccessPlatform(user)) {
    return <Navigate to="/inside" replace />;
  }

  return children;
}
