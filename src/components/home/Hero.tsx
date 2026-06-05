import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Search, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PHRASES = [
  "Global Logistics Solutions",
  "Fast. Secure. Reliable.",
  "Track Your Shipment in Real-Time",
];

export function Hero() {
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [del, setDel] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const full = PHRASES[i];
    if (!del && text === full) {
      const t = setTimeout(() => setDel(true), 1800);
      return () => clearTimeout(t);
    }
    if (del && text === "") {
      setDel(false);
      setI((p) => (p + 1) % PHRASES.length);
      return;
    }
    const t = setTimeout(() => {
      setText((cur) => (del ? cur.slice(0, -1) : full.slice(0, cur.length + 1)));
    }, del ? 35 : 70);
    return () => clearTimeout(t);
  }, [text, del, i]);

  const onTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) navigate({ to: "/tracking", search: { q: q.trim() } as never });
  };

  return (
    <section className="relative isolate overflow-hidden gradient-hero text-primary-foreground">
      <div className="absolute inset-0 opacity-30 grid-pattern" aria-hidden />
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay"
        style={{ backgroundImage: "url(https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=1920&q=80)" }}
        aria-hidden
      />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-24 lg:grid-cols-2 lg:px-8 lg:py-32">
        <div className="animate-fade-in-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
            <Zap className="h-3.5 w-3.5" /> Real-time tracking enabled
          </span>
          <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
            <span className="block">Worldwide Cargo</span>
            <span className="block gradient-text min-h-[1.1em]">
              {text}
              <span className="ml-0.5 inline-block w-[2px] animate-pulse-soft bg-accent align-middle" style={{ height: "0.9em" }} />
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-primary-foreground/80 md:text-lg">
            One platform for freight dispatch, trucking, ocean & air shipping, and warehousing. Visibility at every leg, from pickup to proof of delivery.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-glow">
              <Link to="/quote">Get a Free Quote <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/services">Our Services</Link>
            </Button>
          </div>

          <form onSubmit={onTrack} className="mt-8 flex max-w-lg gap-2 glass-card rounded-2xl p-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Enter tracking number e.g. TLD82931"
                className="border-0 bg-transparent pl-9 text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
              />
            </div>
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary-glow">Track</Button>
          </form>

          <div className="mt-6 flex items-center gap-2 text-xs text-primary-foreground/70">
            <ShieldCheck className="h-4 w-4 text-success" /> ISO 9001 · IATA · FMCSA · C-TPAT certified
          </div>
        </div>

        {/* Floating dashboard mockup */}
        <div className="relative hidden lg:block">
          <div className="absolute -right-6 top-6 h-72 w-72 rounded-full bg-accent/20 blur-3xl" aria-hidden />
          <div className="relative animate-float-slow glass-card rounded-3xl p-6 shadow-elevated">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Live Shipment</div>
                <div className="mt-1 font-display text-2xl font-bold text-foreground">TLD82931</div>
              </div>
              <span className="rounded-full status-in_transit px-3 py-1 text-xs font-semibold">In Transit</span>
            </div>
            <div className="mt-6 space-y-3">
              {[
                { t: "Picked up · New York", done: true },
                { t: "Chicago Hub", done: true },
                { t: "Denver Hub", done: true },
                { t: "Las Vegas, NV", done: true, active: true },
                { t: "Los Angeles · ETA in 2 days", done: false },
              ].map((s, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className={`h-2.5 w-2.5 rounded-full ${s.active ? "bg-accent animate-pulse-soft" : s.done ? "bg-success" : "bg-border"}`} />
                  <div className={`h-px flex-1 ${s.done ? "bg-success/60" : "bg-border"}`} />
                  <span className={`text-sm ${s.active ? "font-semibold text-foreground" : s.done ? "text-foreground" : "text-muted-foreground"}`}>{s.t}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3 border-t border-border pt-4 text-center">
              <div><div className="text-lg font-bold text-foreground">145.5kg</div><div className="text-[10px] uppercase text-muted-foreground">Weight</div></div>
              <div><div className="text-lg font-bold text-foreground">3,940mi</div><div className="text-[10px] uppercase text-muted-foreground">Distance</div></div>
              <div><div className="text-lg font-bold text-success">98%</div><div className="text-[10px] uppercase text-muted-foreground">On track</div></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}