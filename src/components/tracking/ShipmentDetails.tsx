import { lazy, Suspense, useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Download, MapPin, User, Calendar, Package, Truck, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusPill } from "./StatusPill";
import { TrackingTimeline, type Evt } from "./TrackingTimeline";
import type { ShipmentStatus } from "@/lib/brand";
import { supabase } from "@/integrations/supabase/client";

const LiveTrackingMap = lazy(() => import("./LiveTrackingMap").then((m) => ({ default: m.LiveTrackingMap })));

export type Shipment = {
  id: string; tracking_number: string;
  sender_name: string; sender_address: string | null; sender_phone: string | null; sender_email: string | null;
  receiver_name: string; receiver_address: string | null; receiver_phone: string | null; receiver_email: string | null;
  origin: string; destination: string;
  status: ShipmentStatus;
  eta: string | null; weight_kg: number | null; dimensions: string | null; service_type: string | null;
};

export function ShipmentDetails({ shipment, events: initialEvents }: { shipment: Shipment; events: Evt[] }) {
  const [events, setEvents] = useState<Evt[]>(initialEvents);
  const [shipState, setShipState] = useState(shipment);
  const qrRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const url = `${window.location.origin}/tracking/${shipState.tracking_number}`;
    if (qrRef.current) QRCode.toCanvas(qrRef.current, url, { width: 144, margin: 1, color: { dark: "#0B2A36", light: "#ffffff" } });
  }, [shipState.tracking_number]);

  // Realtime subscriptions
  useEffect(() => {
    const ch = supabase
      .channel(`ship-${shipState.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "shipment_events", filter: `shipment_id=eq.${shipState.id}` }, async () => {
        const { data } = await supabase.from("shipment_events").select("*").eq("shipment_id", shipState.id).order("occurred_at", { ascending: true });
        if (data) setEvents(data as Evt[]);
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "shipments", filter: `id=eq.${shipState.id}` }, (payload) => {
        setShipState((s) => ({ ...s, ...(payload.new as Partial<Shipment>) }));
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [shipState.id]);

  const downloadQr = () => {
    if (!qrRef.current) return;
    const a = document.createElement("a");
    a.href = qrRef.current.toDataURL("image/png");
    a.download = `${shipState.tracking_number}-qr.png`;
    a.click();
  };

  const downloadPdf = async () => {
    const { generateManifest } = await import("@/lib/generatePdf");
    await generateManifest(shipState, events);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-card p-6 shadow-soft">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Tracking number</div>
          <div className="font-display text-2xl font-extrabold text-foreground">{shipState.tracking_number}</div>
          <div className="mt-1 text-sm text-muted-foreground">{shipState.origin} → {shipState.destination}</div>
        </div>
        <div className="flex items-center gap-3">
          <StatusPill status={shipState.status} />
          <Button onClick={downloadPdf} className="bg-accent text-accent-foreground hover:bg-accent/90"><Download className="h-4 w-4" /> PDF Manifest</Button>
        </div>
      </div>

      <Suspense fallback={<div className="grid h-[420px] place-items-center rounded-2xl bg-muted">Loading map…</div>}>
        <LiveTrackingMap events={events} />
      </Suspense>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-2xl bg-card p-6 shadow-soft">
          <h3 className="mb-5 flex items-center gap-2 font-display text-lg font-bold"><Truck className="h-5 w-5 text-accent" /> Timeline</h3>
          <TrackingTimeline events={events} currentStatus={shipState.status} />
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl bg-card p-5 shadow-soft">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent"><User className="h-3.5 w-3.5" /> Sender</div>
            <div className="mt-2 font-semibold">{shipState.sender_name}</div>
            {shipState.sender_address ? <div className="text-sm text-muted-foreground">{shipState.sender_address}</div> : null}
          </div>
          <div className="rounded-2xl bg-card p-5 shadow-soft">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent"><MapPin className="h-3.5 w-3.5" /> Receiver</div>
            <div className="mt-2 font-semibold">{shipState.receiver_name}</div>
            {shipState.receiver_address ? <div className="text-sm text-muted-foreground">{shipState.receiver_address}</div> : null}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-card p-4 shadow-soft">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-muted-foreground"><Calendar className="h-3 w-3" /> ETA</div>
              <div className="mt-1 text-sm font-semibold">{shipState.eta ? new Date(shipState.eta).toLocaleDateString() : "TBD"}</div>
            </div>
            <div className="rounded-2xl bg-card p-4 shadow-soft">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-muted-foreground"><Package className="h-3 w-3" /> Weight</div>
              <div className="mt-1 text-sm font-semibold">{shipState.weight_kg ? `${shipState.weight_kg} kg` : "—"}</div>
            </div>
            <div className="col-span-2 rounded-2xl bg-card p-4 shadow-soft">
              <div className="text-[10px] font-bold uppercase text-muted-foreground">Service</div>
              <div className="mt-1 text-sm font-semibold">{shipState.service_type ?? "Standard"}</div>
            </div>
          </div>
          <div className="rounded-2xl bg-card p-5 shadow-soft text-center">
            <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-accent"><QrCode className="h-3.5 w-3.5" /> Share / Print</div>
            <canvas ref={qrRef} className="mx-auto mt-3 rounded-lg border border-border" />
            <button onClick={downloadQr} className="mt-3 text-xs font-semibold text-accent hover:underline">Download QR</button>
          </div>
        </div>
      </div>
    </div>
  );
}