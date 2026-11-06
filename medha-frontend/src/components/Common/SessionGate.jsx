import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import { loginPath } from "../Revision/revisionUtils";
import { hasSession } from "../../config/access";

/** Session check without TourProvider (safe on coming-soon tree). */
export default function SessionGate({ children }) {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  if (!hasSession(user)) {
    if (user && !localStorage.getItem("token")) logout?.();
    const next = `${location.pathname}${location.search || ""}`;
    return <Navigate to={loginPath(next)} replace />;
  }

  return children;
}
