import { lazy, Suspense, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { STATUS_LABEL, generateTrackingNumber, type ShipmentStatus } from "@/lib/brand";
import { toast } from "sonner";
import { Plus, Trash2, Calendar, MapPin } from "lucide-react";
import { geocodeAddress } from "@/lib/geocode";
import { mirrorToInbox } from "@/lib/formsubmit";

const MapPicker = lazy(() => import("./MapPicker").then((m) => ({ default: m.MapPicker })));

type Shipment = {
  id?: string;
  tracking_number: string;
  sender_name: string; sender_address: string | null; sender_phone: string | null; sender_email: string | null;
  receiver_name: string; receiver_address: string | null; receiver_phone: string | null; receiver_email: string | null;
  origin: string; destination: string;
  origin_lat: number | null; origin_lng: number | null;
  destination_lat: number | null; destination_lng: number | null;
  status: ShipmentStatus;
  eta: string | null; weight_kg: number | null; dimensions: string | null; service_type: string | null;
  declared_value: number | null; notes: string | null;
};

type Evt = {
  id?: string;
  status: ShipmentStatus;
  location: string | null;
  note: string | null;
  occurred_at: string;
  lat: number | null;
  lng: number | null;
  _dirty?: boolean;
};

const STATUSES: ShipmentStatus[] = ["picked_up", "in_transit", "at_customs", "on_hold", "delivered", "exception"];

const empty = (): Shipment => ({
  tracking_number: generateTrackingNumber(),
  sender_name: "", sender_address: "", sender_phone: "", sender_email: "",
  receiver_name: "", receiver_address: "", receiver_phone: "", receiver_email: "",
  origin: "", destination: "",
  origin_lat: null, origin_lng: null, destination_lat: null, destination_lng: null,
  status: "picked_up",
  eta: null, weight_kg: null, dimensions: "", service_type: "Standard",
  declared_value: null, notes: "",
});

export function ShipmentEditor({
  open, onOpenChange, shipmentId, onSaved,
}: {
  open: boolean; onOpenChange: (v: boolean) => void; shipmentId: string | null; onSaved: () => void;
}) {
  const [s, setS] = useState<Shipment>(empty());
  const [events, setEvents] = useState<Evt[]>([]);
  const [activeEvtIdx, setActiveEvtIdx] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (!shipmentId) {
      setS(empty()); setEvents([]); setActiveEvtIdx(null); return;
    }
    (async () => {
      const [{ data: ship }, { data: evs }] = await Promise.all([
        supabase.from("shipments").select("*").eq("id", shipmentId).maybeSingle(),
        supabase.from("shipment_events").select("*").eq("shipment_id", shipmentId).order("occurred_at", { ascending: true }),
      ]);
      if (ship) setS(ship as Shipment);
      setEvents((evs ?? []) as Evt[]);
      setActiveEvtIdx(null);
    })();
  }, [shipmentId, open]);

  const set = <K extends keyof Shipment>(k: K, v: Shipment[K]) => setS((p) => ({ ...p, [k]: v }));

  const addEvent = () => {
    setEvents((p) => [
      ...p,
      { status: s.status, location: "", note: "", occurred_at: new Date().toISOString(), lat: null, lng: null, _dirty: true },
    ]);
    setActiveEvtIdx(events.length);
  };
  const removeEvent = async (idx: number) => {
    const e = events[idx];
    if (e.id) await supabase.from("shipment_events").delete().eq("id", e.id);
    setEvents((p) => p.filter((_, i) => i !== idx));
    setActiveEvtIdx(null);
  };
  const updateEvt = <K extends keyof Evt>(idx: number, k: K, v: Evt[K]) => {
    setEvents((p) => p.map((e, i) => (i === idx ? { ...e, [k]: v, _dirty: true } : e)));
  };

  const save = async () => {
    if (!s.tracking_number || !s.sender_name || !s.receiver_name || !s.origin || !s.destination) {
      toast.error("Tracking #, sender, receiver, origin and destination are required");
      return;
    }
    setSaving(true);
    try {
      // Auto-geocode origin/destination so the live map can plot the sender & receiver pins
      const next = { ...s };
      if (next.origin && (next.origin_lat == null || next.origin_lng == null)) {
        const p = await geocodeAddress(next.sender_address ? `${next.origin}, ${next.sender_address}` : next.origin);
        if (p) { next.origin_lat = p.lat; next.origin_lng = p.lng; }
      }
      if (next.destination && (next.destination_lat == null || next.destination_lng == null)) {
        const p = await geocodeAddress(next.receiver_address ? `${next.destination}, ${next.receiver_address}` : next.destination);
        if (p) { next.destination_lat = p.lat; next.destination_lng = p.lng; }
      }
      setS(next);
      let id = s.id;
      if (id) {
        const { error } = await supabase.from("shipments").update({ ...next }).eq("id", id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("shipments").insert({ ...next }).select("id").single();
        if (error) throw error;
        id = data.id;
        // Auto-generate a notification draft for the receiver (admin must approve to send)
        if (next.receiver_email && /.+@.+\..+/.test(next.receiver_email)) {
          const etaStr = next.eta ? new Date(next.eta).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "";
          const body = [
            `Your shipment has been registered with Worldwide Cargo Transit and is being prepared for transit.`,
            `Tracking number: ${next.tracking_number}\nRoute: ${next.origin} → ${next.destination}${etaStr ? `\nEstimated arrival: ${etaStr}` : ""}${next.service_type ? `\nService: ${next.service_type}` : ""}`,
            `You can track your shipment in real time using the link below. Our team is available 24/7 — reply to this email or call +202-968-9946 for any questions.`,
            `Thank you for choosing Worldwide Cargo Transit.`,
          ].join("\n\n");
          const subject = `Shipment ${next.tracking_number} — Worldwide Cargo Transit`;
          await supabase.from("shipment_email_drafts").insert({
            shipment_id: id!,
            recipient_email: next.receiver_email,
            recipient_name: next.receiver_name,
            subject,
            body,
            status: "pending",
          });
          await mirrorToInbox(`Shipment email drafted: ${next.tracking_number}`, {
            tracking_number: next.tracking_number,
            receiver_name: next.receiver_name,
            receiver_email: next.receiver_email,
            subject,
          });
        }
      }
      // events
      for (const e of events) {
        if (!e._dirty) continue;
        const payload = {
          shipment_id: id!, status: e.status, location: e.location, note: e.note,
          occurred_at: e.occurred_at, lat: e.lat, lng: e.lng,
        };
        if (e.id) await supabase.from("shipment_events").update(payload).eq("id", e.id);
        else await supabase.from("shipment_events").insert(payload);
      }
      toast.success(shipmentId ? "Shipment updated" : "Shipment created");
      onSaved(); onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message ?? "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const active = activeEvtIdx != null ? events[activeEvtIdx] : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {shipmentId ? `Edit ${s.tracking_number}` : "Create shipment"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Tracking #"><Input value={s.tracking_number} onChange={(e) => set("tracking_number", e.target.value.toUpperCase())} /></Field>
              <Field label="Service">
                <Select value={s.service_type ?? "Standard"} onValueChange={(v) => set("service_type", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Standard", "Express", "Air Freight", "Sea Freight", "Road Freight", "Rail Freight"].map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Origin"><Input value={s.origin} onChange={(e) => set("origin", e.target.value)} /></Field>
              <Field label="Destination"><Input value={s.destination} onChange={(e) => set("destination", e.target.value)} /></Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Status">
                <Select value={s.status} onValueChange={(v) => set("status", v as ShipmentStatus)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{STATUSES.map((x) => <SelectItem key={x} value={x}>{STATUS_LABEL[x]}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label="ETA">
                <Input type="date" value={s.eta ? s.eta.slice(0, 10) : ""} onChange={(e) => set("eta", e.target.value ? new Date(e.target.value).toISOString() : null)} />
              </Field>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Weight (kg)"><Input type="number" step="0.1" value={s.weight_kg ?? ""} onChange={(e) => set("weight_kg", e.target.value ? Number(e.target.value) : null)} /></Field>
              <Field label="Dimensions"><Input value={s.dimensions ?? ""} onChange={(e) => set("dimensions", e.target.value)} placeholder="L×W×H cm" /></Field>
              <Field label="Declared $"><Input type="number" step="0.01" value={s.declared_value ?? ""} onChange={(e) => set("declared_value", e.target.value ? Number(e.target.value) : null)} /></Field>
            </div>

            <Section title="Sender">
              <Input placeholder="Name" value={s.sender_name} onChange={(e) => set("sender_name", e.target.value)} />
              <Input placeholder="Address" value={s.sender_address ?? ""} onChange={(e) => set("sender_address", e.target.value)} />
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="Phone" value={s.sender_phone ?? ""} onChange={(e) => set("sender_phone", e.target.value)} />
                <Input placeholder="Email" value={s.sender_email ?? ""} onChange={(e) => set("sender_email", e.target.value)} />
              </div>
            </Section>

            <Section title="Receiver">
              <Input placeholder="Name" value={s.receiver_name} onChange={(e) => set("receiver_name", e.target.value)} />
              <Input placeholder="Address" value={s.receiver_address ?? ""} onChange={(e) => set("receiver_address", e.target.value)} />
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="Phone" value={s.receiver_phone ?? ""} onChange={(e) => set("receiver_phone", e.target.value)} />
                <Input placeholder="Email" value={s.receiver_email ?? ""} onChange={(e) => set("receiver_email", e.target.value)} />
              </div>
            </Section>

            <Field label="Internal notes">
              <Textarea rows={2} value={s.notes ?? ""} onChange={(e) => set("notes", e.target.value)} />
            </Field>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-accent">Tracking events</h3>
              <Button size="sm" type="button" onClick={addEvent} variant="outline"><Plus className="h-4 w-4" /> Add event</Button>
            </div>

            <div className="max-h-80 space-y-2 overflow-y-auto rounded-lg border border-border bg-muted/40 p-2">
              {events.length === 0 ? (
                <p className="p-4 text-center text-sm text-muted-foreground">No events yet. Add one to power the live map.</p>
              ) : events.map((e, i) => (
                <button
                  key={i} type="button" onClick={() => setActiveEvtIdx(i)}
                  className={`flex w-full items-start justify-between gap-2 rounded-md border px-3 py-2 text-left text-xs transition ${
                    activeEvtIdx === i ? "border-accent bg-card shadow-soft" : "border-transparent bg-card/60 hover:bg-card"
                  }`}
                >
                  <div className="min-w-0">
                    <div className="font-semibold text-foreground">{STATUS_LABEL[e.status]}{e.location ? ` · ${e.location}` : ""}</div>
                    <div className="truncate text-muted-foreground">{e.note ?? "—"}</div>
                    <div className="mt-0.5 flex items-center gap-2 text-[10px] text-muted-foreground">
                      <Calendar className="h-3 w-3" /> {new Date(e.occurred_at).toLocaleString()}
                      {e.lat != null ? <><MapPin className="h-3 w-3" />{e.lat.toFixed(2)}, {e.lng?.toFixed(2)}</> : null}
                    </div>
                  </div>
                  <span onClick={(ev) => { ev.stopPropagation(); removeEvent(i); }} className="text-destructive hover:text-destructive/80">
                    <Trash2 className="h-3.5 w-3.5" />
                  </span>
                </button>
              ))}
            </div>

            {active ? (
              <div className="space-y-3 rounded-lg border border-border bg-card p-3">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Status">
                    <Select value={active.status} onValueChange={(v) => updateEvt(activeEvtIdx!, "status", v as ShipmentStatus)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{STATUSES.map((x) => <SelectItem key={x} value={x}>{STATUS_LABEL[x]}</SelectItem>)}</SelectContent>
                    </Select>
                  </Field>
                  <Field label="When">
                    <Input type="datetime-local" value={active.occurred_at.slice(0, 16)} onChange={(e) => updateEvt(activeEvtIdx!, "occurred_at", new Date(e.target.value).toISOString())} />
                  </Field>
                </div>
                <Field label="Location"><Input value={active.location ?? ""} onChange={(e) => updateEvt(activeEvtIdx!, "location", e.target.value)} placeholder="e.g. Dubai DXB" /></Field>
                <Field label="Note"><Textarea rows={2} value={active.note ?? ""} onChange={(e) => updateEvt(activeEvtIdx!, "note", e.target.value)} /></Field>
                <Suspense fallback={<div className="h-[260px] rounded-lg bg-muted" />}>
                  <MapPicker lat={active.lat} lng={active.lng} onChange={(lat, lng) => {
                    setEvents((p) => p.map((e, i) => i === activeEvtIdx ? { ...e, lat, lng, _dirty: true } : e));
                  }} />
                </Suspense>
              </div>
            ) : null}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={save} disabled={saving} className="bg-accent text-accent-foreground hover:bg-accent/90">
            {saving ? "Saving…" : "Save shipment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2 rounded-lg border border-border bg-muted/30 p-3">
      <div className="font-display text-xs font-bold uppercase tracking-wider text-accent">{title}</div>
      {children}
    </div>
  );
}