import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import { getPostAuthHome } from "../../config/appMode";
import { hasSession } from "../../config/access";
import { needsAcademicProfile } from "../../lib/academicProfile";

/** Auth forms — signed-in users go to their post-auth home instead. */
export default function GuestOnly({ children }) {
  const { user } = useContext(AuthContext);
  if (hasSession(user)) {
    if (needsAcademicProfile(user)) {
      return <Navigate to="/complete-profile" replace />;
    }
    return <Navigate to={getPostAuthHome(user)} replace />;
  }
  return children;
}
