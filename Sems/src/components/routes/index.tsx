import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/campu/Nav";
import { Hero } from "@/components/campu/Hero";
import { Stats } from "@/components/campu/Stats";
import { FeatureDeepDive } from "@/components/campu/FeatureDeepDive";
import { Ecosystem } from "@/components/campu/Ecosystem";
import { Testimonials } from "@/components/campu/Testimonials";
import { CTA } from "@/components/campu/CTA";
import { Footer } from "@/components/campu/Footer";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main className="bg-background text-foreground min-h-screen overflow-x-clip">
      <Nav />
      <Hero />
      <Stats />
      <FeatureDeepDive />
      <Ecosystem />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
