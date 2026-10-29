import { useState, useEffect } from 'react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export function useLiveStats() {
  const [stats, setStats] = useState({
    studentsOnline: 247,
    totalStudents: 149,
    topicsAvailable: 250,
  });

  useEffect(() => {
    if (!BACKEND_URL) return undefined;

    const fetchStats = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/users/stats`);
        if (!res.ok) return;
        const data = await res.json();
        const totalStudents = Number(data.totalUsers);
        if (!Number.isFinite(totalStudents) || totalStudents < 0) return;
        setStats((prev) => ({
          ...prev,
          totalStudents,
          studentsOnline: Math.max(8, Math.round(totalStudents * 0.12) || prev.studentsOnline),
        }));
      } catch {
        // keep existing fallback values
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return stats;
}
