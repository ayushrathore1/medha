"use client";

import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { TabProvider } from "@/context/TabContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <TabProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </TabProvider>
    </ThemeProvider>
  );
}
