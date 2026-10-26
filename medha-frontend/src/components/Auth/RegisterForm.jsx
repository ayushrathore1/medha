import React, { useState } from "react";

const RegisterForm = ({ onRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await onRegister(email, password); // Parent handler
    } catch (error) {
      setErrorMsg(error.message || "Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center bg-[#0a0a0a]">
      {/* Ambient gradient glow behind form */}
      <div className="absolute left-1/2 -translate-x-1/2 top-32 w-96 h-96 rounded-full bg-gradient-to-br from-violet-500/25 via-blue-600/20 to-purple-400/10 blur-3xl pointer-events-none" />
      {/* Glassy form */}
      <form
        className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl px-8 py-10 max-w-md w-full mx-auto"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent tracking-tight">
          Create your MEDHA Account
        </h2>

        {errorMsg && (
          <div className="mb-4 text-red-400 font-medium text-center text-sm backdrop-blur">
            {errorMsg}
          </div>
        )}

        <div className="mb-4">
          <label
            className="block text-violet-300 font-semibold mb-2"
            htmlFor="email"
          >
            Email Address
          </label>
          <input
            className="w-full backdrop-blur bg-white/30 text-white border border-violet-500/30 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition placeholder-violet-300/70"
            type="email"
            id="email"
            placeholder="your@email.com"
            autoComplete="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-blue-300 font-semibold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="w-full backdrop-blur bg-white/30 text-white border border-blue-500/30 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition placeholder-blue-200/70"
            type="password"
            id="password"
            placeholder="••••••••"
            autoComplete="new-password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label
            className="block text-blue-300 font-semibold mb-2"
            htmlFor="confirmPassword"
          >
            Confirm Password
          </label>
          <input
            className="w-full backdrop-blur bg-white/30 text-white border border-blue-500/30 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition placeholder-blue-200/70"
            type="password"
            id="confirmPassword"
            placeholder="••••••••"
            autoComplete="new-password"
            value={confirmPassword}
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className={`w-full backdrop-blur-xl bg-gradient-to-r from-violet-500/90 via-blue-500/90 to-purple-500/90 text-white font-semibold py-3 rounded-2xl border border-violet-400/30 shadow-lg hover:bg-violet-600/80 hover:scale-[1.03] transition-all duration-150 ${
            loading ? "opacity-60 cursor-wait" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
