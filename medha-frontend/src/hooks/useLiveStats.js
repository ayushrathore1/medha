import { useState, useEffect } from 'react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export function useLiveStats() {
  const [stats, setStats] = useState({
    studentsOnline: 247,
    totalStudents: 149,
    topicsAvailable: 250,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/stats`);
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
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
