"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export interface PersonalizationBundle {
  recommendedProducts: Array<Record<string, unknown>>;
  recentOrders: Array<Record<string, unknown>>;
  wallet: {
    availableBalance: number;
    pendingBalance: number;
    totalEarned: number;
    totalWithdrawn: number;
  };
  unreadCount: number;
  syllabus?: Record<string, unknown> | null;
  preferences?: Record<string, unknown> | null;
}

export function usePersonalization() {
  const { token, isAuthenticated } = useAuth();
  const [data, setData] = useState<PersonalizationBundle | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!isAuthenticated || !token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/campus-cart/personalization", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const payload = await response.json();
        if (!cancelled) setData(payload);
      } catch {
        if (!cancelled) setData(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, token]);

  return { data, isLoading };
}