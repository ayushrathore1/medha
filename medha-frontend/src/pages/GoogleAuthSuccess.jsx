import React, { useEffect, useContext, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import Loader from "../components/Common/Loader";

/**
 * GoogleAuthSuccess — handles the redirect from backend after Google OAuth.
 * Reads token + user from URL params, stores in localStorage, and redirects to dashboard.
 */
const GoogleAuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    const userParam = searchParams.get("user");

    if (!token || !userParam) {
      setError("Authentication failed. Please try again.");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    try {
      const user = JSON.parse(decodeURIComponent(userParam));

      // Store auth data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Update AuthContext
      login(user);

      // Redirect to dashboard
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Google auth callback error:", err);
      setError("Something went wrong. Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    }
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
          fontFamily: "'DM Sans', sans-serif",
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
        fontFamily: "'DM Sans', sans-serif",
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
