import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SEO } from "@/components/site/SEO";
import { PageHero } from "@/components/site/PageHero";
import { Award, Target, Users, Globe2 } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About | Worldwide Cargo Transit" }, { name: "description", content: "Worldwide Cargo Transit: premium global logistics powered by real-time technology." }] }),
  component: About,
});

const TIMELINE = [
  { year: "2008", title: "Founded in Wilmington, DE", desc: "Two founders, one truck, one bonded warehouse." },
  { year: "2012", title: "First overseas office", desc: "Hamburg hub opens; ocean freight launched." },
  { year: "2017", title: "Tech platform v1", desc: "In-house tracking and dispatch built from scratch." },
  { year: "2020", title: "Pandemic-era growth", desc: "Doubled lane coverage; opened Dubai and Singapore." },
  { year: "2023", title: "10M shipments", desc: "Hit ten million lifetime deliveries across 200+ countries." },
  { year: "Today", title: "AI-assisted logistics", desc: "Smart routing, predictive ETAs, automated POD." },
];

const TEAM = [
  { name: "Elena Marsh", role: "CEO & Co-Founder", img: "https://i.pravatar.cc/240?img=47" },
  { name: "Daniel Kim", role: "COO & Co-Founder", img: "https://i.pravatar.cc/240?img=12" },
  { name: "Priya Nair", role: "VP Customs & Compliance", img: "https://i.pravatar.cc/240?img=45" },
  { name: "Marcus Hale", role: "CTO", img: "https://i.pravatar.cc/240?img=33" },
];

function About() {
  return (
    <SiteLayout>
      <SEO title="About" description="Worldwide Cargo Transit: premium global logistics powered by real-time technology." path="/about" />
      <PageHero eyebrow="About us" title="People, technology, and a global network" subtitle="Since 2008, WWCT has moved cargo for tens of thousands of shippers across 200+ countries." image="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1920&q=80" />

      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="rounded-2xl bg-card p-8 shadow-soft">
            <Target className="h-8 w-8 text-accent" />
            <h2 className="mt-4 font-display text-2xl font-bold">Our mission</h2>
            <p className="mt-3 text-muted-foreground">Make global logistics radically transparent — so every shipper, of every size, can move freight like a Fortune 500.</p>
          </div>
          <div className="rounded-2xl bg-card p-8 shadow-soft">
            <Globe2 className="h-8 w-8 text-accent" />
            <h2 className="mt-4 font-display text-2xl font-bold">Our vision</h2>
            <p className="mt-3 text-muted-foreground">A world where every parcel, pallet, and container is trackable in real time and delivered with zero surprises.</p>
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-20">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <div className="mb-12 text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Our journey</span>
            <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">From one truck to a global network</h2>
          </div>
          <ol className="relative space-y-8 border-l-2 border-accent/30 pl-8">
            {TIMELINE.map((t) => (
              <li key={t.year} className="relative">
                <span className="absolute -left-[42px] grid h-5 w-5 place-items-center rounded-full gradient-accent shadow-glow"><span className="h-2 w-2 rounded-full bg-primary-foreground" /></span>
                <div className="font-display text-sm font-bold tracking-wider text-accent">{t.year}</div>
                <div className="mt-1 text-lg font-semibold text-foreground">{t.title}</div>
                <div className="text-sm text-muted-foreground">{t.desc}</div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <div className="text-center"><span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Leadership</span>
          <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">The team behind WWCT</h2></div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((p) => (
            <div key={p.name} className="group overflow-hidden rounded-2xl bg-card shadow-soft card-hover">
              <img src={p.img} alt={p.name} loading="lazy" className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105" />
              <div className="p-4"><div className="font-semibold text-foreground">{p.name}</div><div className="text-sm text-muted-foreground">{p.role}</div></div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-primary py-12 text-primary-foreground">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-around gap-6 px-4 text-center lg:px-8">
          {["ISO 9001", "IATA", "FMCSA", "C-TPAT", "AEO"].map((c) => (
            <div key={c} className="flex items-center gap-2"><Award className="h-5 w-5 text-accent" /><span className="font-display text-lg font-bold">{c}</span></div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}