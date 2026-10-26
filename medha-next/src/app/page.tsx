"use client";

import { Providers } from "./providers";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardHome } from "@/components/dashboard/DashboardHome";

function HomeContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <main className="min-h-screen bg-background" />;
  }

  if (isAuthenticated) {
    return <main className="min-h-screen bg-background" />;
  }

  return (
    <DashboardLayout>
      <DashboardHome />
    </DashboardLayout>
  );
}

export default function HomePage() {
  return (
    <Providers>
      <HomeContent />
    </Providers>
  );
}
