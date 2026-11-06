import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../AuthContext";
import Loader from "./Loader";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

/**
 * Allows admin (super) and team members into staff dashboards.
 */
export default function StaffRoute({ children }) {
  const { user } = useContext(AuthContext);
  const [state, setState] = useState({ loading: true, allowed: false });

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!user) {
        if (!cancelled) setState({ loading: false, allowed: false });
        return;
      }
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BACKEND_URL}/api/messages/check-admin`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 15000,
        });
        if (!cancelled) {
          setState({ loading: false, allowed: Boolean(res.data?.isAdmin) });
        }
      } catch {
        if (!cancelled) setState({ loading: false, allowed: false });
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (!user) return <Navigate to="/login?next=%2Fadmin" replace />;
  if (state.loading) return <Loader fullScreen />;
  if (!state.allowed) return <Navigate to="/subjects" replace />;
  return children;
}
