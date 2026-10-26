"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type TabMode = "revision" | "campus-cart";

interface TabContextType {
  tab: TabMode;
  setTab: (tab: TabMode) => void;
  toggleTab: () => void;
}

const TabContext = createContext<TabContextType | undefined>(undefined);

const STORAGE_KEY = "medha_tab";

export function TabProvider({ children }: { children: ReactNode }) {
  const [tab, setTabState] = useState<TabMode>("revision");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as TabMode | null;
    if (saved === "revision" || saved === "campus-cart") {
      setTabState(saved);
    }
  }, []);

  const setTab = (t: TabMode) => {
    setTabState(t);
    localStorage.setItem(STORAGE_KEY, t);
  };

  const toggleTab = () => {
    setTab(tab === "revision" ? "campus-cart" : "revision");
  };

  return (
    <TabContext.Provider value={{ tab, setTab, toggleTab }}>
      {children}
    </TabContext.Provider>
  );
}

export function useTab(): TabContextType {
  const ctx = useContext(TabContext);
  if (!ctx) throw new Error("useTab must be used within TabProvider");
  return ctx;
}
