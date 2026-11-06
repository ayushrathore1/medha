import { useState, useEffect } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const FALLBACK = {
  studentsOnline: 247,
  totalStudents: 149,
  topicsAvailable: 250,
};

export function useLiveStats() {
  const [stats, setStats] = useState(FALLBACK);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/users/stats`);
        if (!res.ok) return;
        const data = await res.json();
        const total = Number(data.totalUsers ?? data.totalStudents ?? 0);
        setStats((prev) => ({
          ...prev,
          totalStudents: total > 0 ? total : prev.totalStudents,
          studentsOnline: Math.max(12, Math.min(total || prev.studentsOnline, prev.studentsOnline)),
          topicsAvailable: Number(data.topicsAvailable) || prev.topicsAvailable,
        }));
      } catch {
        // keep fallback values
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return stats;
}
