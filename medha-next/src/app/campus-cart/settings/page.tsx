"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [defaultCollege, setDefaultCollege] = useState("");
  const [defaultHostel, setDefaultHostel] = useState("");
  const [defaultRoom, setDefaultRoom] = useState("");
  const [saving, setSaving] = useState(false);

  // Sync dark mode state with HTML class
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setDarkMode(isDark);
  }, []);

  // Sync shipping defaults from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      setDefaultCollege(localStorage.getItem("cart_default_college") || user?.college || "");
      setDefaultHostel(localStorage.getItem("cart_default_hostel") || "");
      setDefaultRoom(localStorage.getItem("cart_default_room") || "");
    }
  }, [user]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  const toggleDarkMode = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleSaveDefaults = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("cart_default_college", defaultCollege);
      localStorage.setItem("cart_default_hostel", defaultHostel);
      localStorage.setItem("cart_default_room", defaultRoom);
    }
    setTimeout(() => {
      setSaving(false);
      alert("Defaults saved successfully!");
    }, 500);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-32">
        <span className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: "32px auto", padding: "0 16px" }}>
      <h1 className="font-display text-3xl sm:text-4xl tracking-tight mb-8">Settings</h1>

      <div className="space-y-4">
        {/* Notifications Toggle */}
        <div className="bg-card rounded-2xl ring-1 ring-border p-5 flex items-center justify-between">
          <div>
            <div className="font-semibold text-sm">Push Notifications</div>
            <div className="text-xs text-muted-foreground">Get notified about orders and messages</div>
          </div>
          <button
            onClick={() => setNotifications(!notifications)}
            className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${
              notifications ? "bg-primary" : "bg-secondary"
            } relative`}
            style={{ border: "none" }}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                notifications ? "translate-x-6" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        {/* Dark Mode Toggle */}
        <div className="bg-card rounded-2xl ring-1 ring-border p-5 flex items-center justify-between">
          <div>
            <div className="font-semibold text-sm">Dark Mode</div>
            <div className="text-xs text-muted-foreground">Toggle dark/light theme</div>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${
              darkMode ? "bg-primary" : "bg-secondary"
            } relative`}
            style={{ border: "none" }}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                darkMode ? "translate-x-6" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        {/* Shipping Defaults */}
        <div className="bg-card rounded-2xl ring-1 ring-border p-5">
          <h3 className="font-semibold text-sm mb-1">Shipping & Checkout Defaults</h3>
          <p className="text-xs text-muted-foreground mb-4">
            Pre-fill your shipping info on checkout for a faster experience.
          </p>

          <form onSubmit={handleSaveDefaults} className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                College Campus
              </label>
              <input
                type="text"
                value={defaultCollege}
                onChange={(e) => setDefaultCollege(e.target.value)}
                placeholder="e.g. RTU Kota"
                className="w-full px-4 py-2 rounded-xl text-sm bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                style={{ color: "var(--foreground)" }}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                  Hostel Name
                </label>
                <input
                  type="text"
                  value={defaultHostel}
                  onChange={(e) => setDefaultHostel(e.target.value)}
                  placeholder="e.g. Raman Hostel"
                  className="w-full px-4 py-2 rounded-xl text-sm bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                  style={{ color: "var(--foreground)" }}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                  Room Number
                </label>
                <input
                  type="text"
                  value={defaultRoom}
                  onChange={(e) => setDefaultRoom(e.target.value)}
                  placeholder="e.g. 104"
                  className="w-full px-4 py-2 rounded-xl text-sm bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                  style={{ color: "var(--foreground)" }}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="bg-primary text-primary-foreground px-5 py-2 rounded-full text-xs font-semibold hover:opacity-90 transition-all cursor-pointer mt-2"
              style={{ border: "none" }}
            >
              {saving ? "Saving..." : "Save Defaults"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
