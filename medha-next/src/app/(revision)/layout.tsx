import { Providers } from "../providers";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <DashboardLayout>{children}</DashboardLayout>
    </Providers>
  );
}
