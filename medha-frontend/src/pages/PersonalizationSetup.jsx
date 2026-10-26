import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Card from "../components/Common/Card";
import Button from "../components/Common/Button";
import axios from "axios";
import { AuthContext } from "../AuthContext";

const UNIVERSITIES = ["RTU", "GGSIPU", "DTU", "AKTU"];
const BRANCHES = ["CSE", "IT", "ECE", "EE", "ME", "Civil", "AIDS"];
const GENDERS = ["Male", "Female", "Other"];

const PersonalizationSetup = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    university: "",
    branch: "",
    gender: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if user already has profile data
  useEffect(() => {
    if (user?.university && user?.branch && user?.gender) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSelect = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    if (!formData.university || !formData.branch || !formData.gender) {
      setError("Please select all options to continue.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/me`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update user context and localStorage
      const updatedUser = { ...user, ...formData };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      navigate("/dashboard");
    } catch (err) {
      console.error("Error saving personalization:", err);
      setError("Failed to save. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 relative overflow-hidden bg-slate-50">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-fuchsia-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "3s" }}></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <div className="text-center mb-8">
          <img
            src="https://ik.imagekit.io/ayushrathore1/MEDHA%20Revision%20Logo%20(5)/6.svg?updatedAt=1767677218473"
            alt="MEDHA logo"
            className="w-20 h-20 mx-auto mb-4 object-contain"
          />
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 mb-2">
            Let's Personalize Your Experience
          </h2>
          <p className="text-slate-500 font-medium text-lg">
            Help us tailor Medha just for you.
          </p>
        </div>

        <Card className="shadow-2xl shadow-indigo-500/10 border-indigo-100 p-8">
          <div className="space-y-6">
            {error && (
              <div className="p-4 rounded-xl text-sm font-bold text-red-600 bg-red-50 border border-red-200 text-center">
                {error}
              </div>
            )}

            {/* University Selection */}
            <div>
              <label className="block mb-3 text-sm font-bold text-slate-700">
                Select Your University
              </label>
              <div className="grid grid-cols-3 gap-3">
                {UNIVERSITIES.map((uni) => (
                  <button
                    key={uni}
                    type="button"
                    onClick={() => setFormData({ ...formData, university: uni })}
                    className={`px-4 py-3 rounded-xl border-2 font-bold transition-all ${
                      formData.university === uni && !UNIVERSITIES.includes(formData.university) === false && formData.university !== "Other"
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-lg"
                        : formData.university === uni
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-lg"
                        : "bg-slate-50 border-slate-300 text-slate-700 hover:border-indigo-400 hover:bg-indigo-50"
                    }`}
                  >
                    {uni}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, university: "Other" })}
                  className={`px-4 py-3 rounded-xl border-2 font-bold transition-all ${
                    formData.university === "Other" || (!UNIVERSITIES.includes(formData.university) && formData.university !== "")
                      ? "bg-indigo-600 border-indigo-600 text-white shadow-lg"
                      : "bg-slate-50 border-slate-300 text-slate-700 hover:border-indigo-400 hover:bg-indigo-50"
                  }`}
                >
                  Other
                </button>
              </div>
              {(formData.university === "Other" || (!UNIVERSITIES.includes(formData.university) && formData.university !== "")) && (
                <input
                  type="text"
                  placeholder="Enter your university name"
                  value={formData.university === "Other" ? "" : formData.university}
                  onChange={(e) => setFormData({ ...formData, university: e.target.value || "Other" })}
                  className="mt-3 w-full px-4 py-3 rounded-xl border-2 border-slate-300 bg-slate-50 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              )}
            </div>

            {/* Branch Selection */}
            <div>
              <label className="block mb-3 text-sm font-bold text-slate-700">
                Select Your Branch
              </label>
              <div className="grid grid-cols-4 gap-3">
                {BRANCHES.map((branch) => (
                  <button
                    key={branch}
                    type="button"
                    onClick={() => setFormData({ ...formData, branch: branch })}
                    className={`px-3 py-2.5 rounded-xl border-2 font-bold text-sm transition-all ${
                      formData.branch === branch && BRANCHES.includes(formData.branch)
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-lg"
                        : "bg-slate-50 border-slate-300 text-slate-700 hover:border-indigo-400 hover:bg-indigo-50"
                    }`}
                  >
                    {branch}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, branch: "Other" })}
                  className={`px-3 py-2.5 rounded-xl border-2 font-bold text-sm transition-all ${
                    formData.branch === "Other" || (!BRANCHES.includes(formData.branch) && formData.branch !== "")
                      ? "bg-indigo-600 border-indigo-600 text-white shadow-lg"
                      : "bg-slate-50 border-slate-300 text-slate-700 hover:border-indigo-400 hover:bg-indigo-50"
                  }`}
                >
                  Other
                </button>
              </div>
              {(formData.branch === "Other" || (!BRANCHES.includes(formData.branch) && formData.branch !== "")) && (
                <input
                  type="text"
                  placeholder="Enter your branch name"
                  value={formData.branch === "Other" ? "" : formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value || "Other" })}
                  className="mt-3 w-full px-4 py-3 rounded-xl border-2 border-slate-300 bg-slate-50 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              )}
            </div>

            {/* Gender Selection */}
            <div>
              <label className="block mb-3 text-sm font-bold text-slate-700">
                Select Your Gender
              </label>
              <div className="grid grid-cols-3 gap-3">
                {GENDERS.map((gender) => (
                  <button
                    key={gender}
                    type="button"
                    onClick={() => handleSelect("gender", gender)}
                    className={`px-4 py-2.5 rounded-xl border-2 font-bold text-sm transition-all ${
                      formData.gender === gender
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-lg"
                        : "bg-slate-50 border-slate-300 text-slate-700 hover:border-indigo-400 hover:bg-indigo-50"
                    }`}
                  >
                    {gender}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                loading={loading}
                variant="primary"
                size="lg"
                fullWidth
                className="shadow-xl shadow-indigo-500/20 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 border-0"
              >
                Continue to Dashboard
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default PersonalizationSetup;
