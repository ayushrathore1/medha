import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Card from "../components/Common/Card";
import Button from "../components/Common/Button";

const resetPasswordApi = async (token, password) => {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/auth/reset-password`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    }
  );
  const data = await res.json();
  return { ok: res.ok, message: data.message };
};

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ResetPassword = () => {
  const query = useQuery();
  const token = query.get("token");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    const { ok, message } = await resetPasswordApi(token, password);
    setMsg(message);
    setLoading(false);
    if (ok) setTimeout(() => navigate("/login"), 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4">
      <Card className="max-w-md w-full">
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-extrabold text-center mb-6 tracking-tight" style={{ color: "var(--action-primary)" }}>
            Reset Password
          </h2>
          <input
            type="password"
            className="border-2 rounded-xl px-5 py-3 w-full mb-6 font-medium focus:outline-none focus:ring-2 transition-all duration-150"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--accent-secondary)",
              color: "var(--text-primary)",
            }}
            placeholder="New Password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            disabled={loading}
            loading={loading}
            fullWidth
          >
            Reset Password
          </Button>
          {msg && (
            <div
              className={`text-center mt-6 font-semibold ${
                msg.toLowerCase().includes("success")
                  ? "text-emerald-600"
                  : "text-red-600"
              }`}
            >
              {msg}
            </div>
          )}
        </form>
      </Card>
    </div>
  );
};

export default ResetPassword;
