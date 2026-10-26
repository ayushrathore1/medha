"use client";

import { Providers } from "../providers";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

export default function CampusCartLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <DashboardLayout>{children}</DashboardLayout>
    </Providers>
  );
}
