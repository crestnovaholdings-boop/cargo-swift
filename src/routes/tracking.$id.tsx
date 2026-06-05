import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SEO } from "@/components/site/SEO";
import { PageHero } from "@/components/site/PageHero";
import { ShipmentDetails, type Shipment } from "@/components/tracking/ShipmentDetails";
import type { Evt } from "@/components/tracking/TrackingTimeline";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/tracking/$id")({
  head: () => ({ meta: [{ title: "Shipment | Worldwide Cargo Transit" }] }),
  component: TrackingDetail,
});

function TrackingDetail() {
  const { id } = Route.useParams();
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [events, setEvents] = useState<Evt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: ship } = await supabase.from("shipments").select("*").ilike("tracking_number", id).maybeSingle();
      if (!ship) { if (!cancelled) setLoading(false); return; }
      const { data: evs } = await supabase.from("shipment_events").select("*").eq("shipment_id", ship.id).order("occurred_at", { ascending: true });
      if (!cancelled) { setShipment(ship as Shipment); setEvents((evs ?? []) as Evt[]); setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [id]);

  return (
    <SiteLayout>
      <SEO title={`Shipment ${id}`} description="Live shipment tracking and details." path={`/tracking/${id}`} />
      <PageHero eyebrow="Shipment" title={id} subtitle={shipment ? `${shipment.origin} → ${shipment.destination}` : "Loading…"} />
      <section className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
        {loading ? (
          <div className="grid h-60 place-items-center text-muted-foreground">Loading…</div>
        ) : shipment ? (
          <ShipmentDetails shipment={shipment} events={events} />
        ) : (
          <div className="grid place-items-center rounded-2xl bg-card p-12 text-center shadow-soft">
            <div className="font-display text-xl font-bold">Shipment not found</div>
            <Button asChild className="mt-4 bg-accent text-accent-foreground hover:bg-accent/90"><Link to="/tracking">Search again</Link></Button>
          </div>
        )}
      </section>
    </SiteLayout>
  );
}