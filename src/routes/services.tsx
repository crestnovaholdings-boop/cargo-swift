import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SEO } from "@/components/site/SEO";
import { PageHero } from "@/components/site/PageHero";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ClipboardList, Plane, Ship, Truck, Warehouse } from "lucide-react";

const SERVICES = [
  { id: "freight-dispatch", Icon: ClipboardList, title: "Freight Dispatch", img: "https://images.unsplash.com/photo-1568438350562-2cae6d394ad0?auto=format&fit=crop&w=1600&q=80", desc: "24/7 truck dispatching with smart load matching, rate negotiation, and carrier vetting.", features: ["Dedicated dispatcher", "Best-rate negotiation", "Carrier compliance & vetting", "Live load tracking"] },
  { id: "trucking", Icon: Truck, title: "Trucking — FTL & LTL", img: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1600&q=80", desc: "Dry van, reefer, flatbed and step-deck equipment for full and partial truckloads across North America.", features: ["FTL & LTL nationwide", "Reefer & temperature-controlled", "Cross-border US/CA/MX", "Real-time GPS visibility"] },
  { id: "air-freight", Icon: Plane, title: "Air Freight", img: "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=1600&q=80", desc: "Time-critical air freight, charters, and consolidations to 200+ countries.", features: ["Next-flight-out service", "Door-to-door air freight", "Charter capacity", "Customs brokerage"] },
  { id: "ocean-freight", Icon: Ship, title: "Ocean Freight", img: "https://tcbgroup.com/wp-content/uploads/2021/09/Sea-Freight-Services-image-scaled.jpg", desc: "FCL & LCL containers on every major trade lane, with door-to-door coverage.", features: ["FCL & LCL", "Reefer containers", "Project cargo & breakbulk", "Origin & destination services"] },
  { id: "warehousing", Icon: Warehouse, title: "Warehousing & 3PL", img: "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1600&q=80", desc: "Bonded warehouses, pick-pack-ship fulfillment, kitting and returns.", features: ["Bonded & FTZ warehousing", "E-commerce fulfillment", "Kitting & assembly", "Returns management"] },
];

export const Route = createFileRoute("/services")({
  head: () => ({ meta: [{ title: "Services | Worldwide Cargo Transit" }, { name: "description", content: "Freight dispatch, trucking, ocean & air freight, warehousing — all under one roof." }] }),
  component: Services,
});

function Services() {
  return (
    <SiteLayout>
      <SEO title="Services" description="Freight dispatch, trucking, ocean & air freight, warehousing — all under one roof." path="/services" />
      <PageHero eyebrow="Services" title="Logistics, end-to-end" subtitle="Five integrated services. One operations team. One tracking experience." image="https://images.unsplash.com/photo-1606189934390-83a09b5b3ca7?auto=format&fit=crop&w=1920&q=80" />

      <div className="mx-auto max-w-7xl space-y-20 px-4 py-20 lg:px-8">
        {SERVICES.map((s, i) => (
          <section key={s.id} id={s.id} className={`grid items-center gap-10 lg:grid-cols-2 ${i % 2 ? "lg:[&>div:first-child]:order-2" : ""}`}>
            <div>
              <div className="overflow-hidden rounded-3xl shadow-elevated">
                <img src={s.img} alt={s.title} loading="lazy" className="aspect-[4/3] w-full object-cover" />
              </div>
            </div>
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                <s.Icon className="h-3.5 w-3.5" /> Service {String(i + 1).padStart(2, "0")}
              </div>
              <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">{s.title}</h2>
              <p className="mt-3 text-muted-foreground">{s.desc}</p>
              <ul className="mt-5 grid gap-2 text-sm sm:grid-cols-2">
                {s.features.map((f) => (<li key={f} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full gradient-accent" />{f}</li>))}
              </ul>
              <Accordion type="single" collapsible className="mt-6">
                <AccordionItem value="d"><AccordionTrigger>What's included</AccordionTrigger><AccordionContent>Full operations support, documentation, customs (where applicable), insurance options, branded PDFs, and real-time tracking via your customer portal.</AccordionContent></AccordionItem>
                <AccordionItem value="p"><AccordionTrigger>Pricing</AccordionTrigger><AccordionContent>All-in rates with no surprise accessorials. Volume discounts available for repeat lanes.</AccordionContent></AccordionItem>
              </Accordion>
              <Button asChild className="mt-6 bg-accent text-accent-foreground hover:bg-accent/90"><Link to="/quote">Get a quote <ArrowRight className="h-4 w-4" /></Link></Button>
            </div>
          </section>
        ))}
      </div>
    </SiteLayout>
  );
}