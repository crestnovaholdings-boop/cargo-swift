import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SEO } from "@/components/site/SEO";
import { Hero } from "@/components/home/Hero";
import { ShipmentTicker } from "@/components/home/ShipmentTicker";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { FreightModes } from "@/components/home/FreightModes";
import { HowItWorks } from "@/components/home/HowItWorks";
import { TechPlatform } from "@/components/home/TechPlatform";
import { GlobalNetwork } from "@/components/home/GlobalNetwork";
import { WhyChoose } from "@/components/home/WhyChoose";
import { ValueProps } from "@/components/home/ValueProps";
import { Testimonials } from "@/components/home/Testimonials";
import { Partners } from "@/components/home/Partners";
import { CtaSection } from "@/components/home/CtaSection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Worldwide Cargo Transit — Global Logistics. Delivered with Precision." },
      { name: "description", content: "Real-time freight, trucking, ocean & air shipping with global tracking across 200+ countries." },
      { property: "og:title", content: "Worldwide Cargo Transit" },
      { property: "og:description", content: "Premium global logistics with real-time tracking." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <SiteLayout>
      <SEO title="Home" description="Real-time freight, trucking, ocean & air shipping with global tracking across 200+ countries." path="/" />
      <Hero />
      <ShipmentTicker />
      <ServicesGrid />
      <FreightModes />
      <HowItWorks />
      <TechPlatform />
      <GlobalNetwork />
      <WhyChoose />
      <ValueProps />
      <Testimonials />
      <Partners />
      <CtaSection />
    </SiteLayout>
  );
}
