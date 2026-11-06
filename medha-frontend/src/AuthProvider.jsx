import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { isTeamUser } from "./config/appMode";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function normalizeUser(raw) {
  if (!raw) return null;
  const role = raw.role || "user";
  const staff = Boolean(raw.isAdmin || role === "admin" || role === "team");
  return {
    ...raw,
    id: raw.id || raw._id,
    role,
    isAdmin: staff,
  };
}

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (!token || !savedUser) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return null;
    }
    try {
      return normalizeUser(JSON.parse(savedUser));
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  });

  const setUser = useCallback((next) => {
    setUserState((prev) => {
      const resolved = typeof next === "function" ? next(prev) : next;
      return resolved ? normalizeUser(resolved) : null;
    });
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  // Refresh role from API so production team unlock stays in sync after invites.
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !BACKEND_URL) return undefined;

    let cancelled = false;
    (async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (cancelled || !res.data) return;
        const next = normalizeUser(res.data);
        setUserState((prev) => {
          if (!prev) return next;
          const roleChanged =
            isTeamUser(next) !== isTeamUser(prev) ||
            next.role !== prev.role ||
            next.email !== prev.email;
          if (!roleChanged && prev.name === next.name) return prev;
          return { ...prev, ...next };
        });
      } catch {
        /* keep cached session; gate still uses local role */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = (userData) => setUser(userData);
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUserState(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
