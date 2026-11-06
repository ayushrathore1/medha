import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import { getPostAuthHome } from "../../config/appMode";
import { hasSession } from "../../config/access";

/** Auth forms — signed-in users go to their post-auth home instead. */
export default function GuestOnly({ children }) {
  const { user } = useContext(AuthContext);
  if (hasSession(user)) {
    return <Navigate to={getPostAuthHome(user)} replace />;
  }
  return children;
}
