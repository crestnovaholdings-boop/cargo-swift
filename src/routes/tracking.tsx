import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, Package } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SEO } from "@/components/site/SEO";
import { PageHero } from "@/components/site/PageHero";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ShipmentDetails, type Shipment } from "@/components/tracking/ShipmentDetails";
import type { Evt } from "@/components/tracking/TrackingTimeline";
import { toast } from "sonner";
import { z } from "zod";

type Search = { q?: string };

export const Route = createFileRoute("/tracking")({
  validateSearch: (s: Record<string, unknown>): Search => ({ q: typeof s.q === "string" ? s.q : undefined }),
  head: () => ({ meta: [{ title: "Track Shipment | Worldwide Cargo Transit" }] }),
  component: TrackingPage,
});

function TrackingPage() {
  const { q } = Route.useSearch();
  const navigate = useNavigate();
  const [input, setInput] = useState(q ?? "");
  const [busy, setBusy] = useState(false);
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [events, setEvents] = useState<Evt[]>([]);
  const [notFound, setNotFound] = useState(false);

  const search = async (n: string) => {
    const tn = z.string().trim().min(3).max(40).safeParse(n);
    if (!tn.success) { toast.error("Enter a valid tracking number"); return; }
    setBusy(true); setNotFound(false); setShipment(null); setEvents([]);
    const { data: ship } = await supabase.from("shipments").select("*").ilike("tracking_number", tn.data).maybeSingle();
    if (!ship) { setNotFound(true); setBusy(false); return; }
    const { data: evs } = await supabase.from("shipment_events").select("*").eq("shipment_id", ship.id).order("occurred_at", { ascending: true });
    setShipment(ship as Shipment); setEvents((evs ?? []) as Evt[]); setBusy(false);
  };

  useEffect(() => { if (q) { setInput(q); search(q); } /* eslint-disable-next-line */ }, [q]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/tracking", search: { q: input.trim() } });
    search(input.trim());
  };

  return (
    <SiteLayout>
      <SEO title="Track Shipment" description="Track your Worldwide Cargo Transit shipment in real time." path="/tracking" />
      <PageHero eyebrow="Tracking" title="Track your shipment" subtitle="Enter your tracking number — try TLD82931, TLD10042, TLD55501 or TLD77820." />

      <section className="mx-auto max-w-5xl px-4 py-10 lg:px-8">
        <form onSubmit={onSubmit} className="flex flex-wrap gap-3 rounded-2xl bg-card p-4 shadow-elevated">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={input} onChange={(e) => setInput(e.target.value.toUpperCase())} className="pl-9" placeholder="Tracking number" />
          </div>
          <Button type="submit" disabled={busy} className="bg-accent text-accent-foreground hover:bg-accent/90">{busy ? "Searching..." : "Track"}</Button>
        </form>

        <div className="mt-8">
          {shipment ? (
            <ShipmentDetails shipment={shipment} events={events} />
          ) : notFound ? (
            <div className="grid place-items-center rounded-2xl bg-card p-12 text-center shadow-soft">
              <Package className="h-10 w-10 text-muted-foreground" />
              <div className="mt-4 font-display text-xl font-bold">Shipment not found</div>
              <p className="mt-1 text-sm text-muted-foreground">Double-check the tracking number, or contact our team.</p>
            </div>
          ) : null}
        </div>
      </section>
    </SiteLayout>
  );
}