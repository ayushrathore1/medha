import React, { useEffect, useContext, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import Loader from "../components/Common/Loader";

const BACKEND_URL = String(import.meta.env.VITE_BACKEND_URL || "https://medharevisionapi.shopcampuskart.in").replace(/\/$/, "");

/**
 * GoogleAuthSuccess — completes Google OAuth after the backend redirect.
 * The URL may contain a one-time `code` only. JWTs are fetched over POST
 * and never read from the query string.
 */
const GoogleAuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fail = (message) => {
      if (cancelled) return;
      setError(message);
      setTimeout(() => navigate("/login", { replace: true }), 2000);
    };

    const run = async () => {
      if (searchParams.get("token") || searchParams.get("access_token")) {
        fail("Sign-in link is invalid. Please try again.");
        return;
      }

      const oauthError = searchParams.get("error");
      if (oauthError) {
        fail("Authentication failed. Please try again.");
        return;
      }

      const code = searchParams.get("code");
      if (!code) {
        fail("Authentication failed. Please try again.");
        return;
      }

      window.history.replaceState({}, document.title, "/auth/google/success");

      try {
        const res = await fetch(`${BACKEND_URL}/api/auth/google/exchange`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.token || !data.user) {
          fail(data.message || "Authentication failed. Please try again.");
          return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        login(data.user);
        navigate("/inside", { replace: true });
      } catch {
        fail("Something went wrong. Redirecting...");
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [searchParams, navigate, login]);

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          background: "var(--bg-primary)",
          color: "var(--text-primary)",
        }}
      >
        <p style={{ fontSize: 16, color: "#EF4444", marginBottom: 8 }}>
          {error}
        </p>
        <p style={{ fontSize: 13, color: "var(--text-tertiary)" }}>
          Redirecting to login...
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "ui-sans-serif, system-ui, sans-serif",
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
        gap: 16,
      }}
    >
      <Loader />
      <p
        style={{
          fontSize: 15,
          fontWeight: 600,
          color: "var(--text-secondary)",
        }}
      >
        Signing you in with Google...
      </p>
    </div>
  );
};

export default GoogleAuthSuccess;
