import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SEO } from "@/components/site/SEO";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { mirrorToInbox } from "@/lib/formsubmit";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(50).optional(),
  shipment_type: z.string().min(1),
  origin: z.string().trim().min(2).max(150),
  destination: z.string().trim().min(2).max(150),
  weight: z.string().trim().max(50).optional(),
  dimensions: z.string().trim().max(100).optional(),
  message: z.string().trim().max(2000).optional(),
  honey: z.string().max(0).optional(),
});

export const Route = createFileRoute("/quote")({
  head: () => ({ meta: [{ title: "Get a Quote | Worldwide Cargo Transit" }] }),
  component: Quote,
});

function Quote() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", shipment_type: "ocean", origin: "", destination: "", weight: "", dimensions: "", message: "", honey: "" });
  const [busy, setBusy] = useState(false);
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) { toast.error(parsed.error.issues[0]?.message ?? "Please check the form"); return; }
    setBusy(true);
    const { error } = await supabase.from("quote_requests").insert({
      name: form.name, email: form.email, phone: form.phone, shipment_type: form.shipment_type,
      origin: form.origin, destination: form.destination, weight: form.weight, dimensions: form.dimensions, message: form.message,
    });
    await mirrorToInbox("New Quote Request — WWCT", form);
    setBusy(false);
    if (error) { toast.error("Could not submit — please try again"); return; }
    toast.success("Quote request received. Our team will reply within 24 hours.");
    setForm({ name: "", email: "", phone: "", shipment_type: "ocean", origin: "", destination: "", weight: "", dimensions: "", message: "", honey: "" });
  };

  return (
    <SiteLayout>
      <SEO title="Get a Quote" description="Get a tailored freight quote in under 24 hours." path="/quote" />
      <PageHero eyebrow="Quote" title="Get a free quote" subtitle="Tell us about your shipment — our team responds within 24 hours." />

      <section className="mx-auto max-w-4xl px-4 py-16 lg:px-8">
        <form onSubmit={onSubmit} className="grid gap-5 rounded-2xl bg-card p-8 shadow-elevated md:grid-cols-2">
          <input type="text" name="company-website" tabIndex={-1} autoComplete="off" value={form.honey} onChange={(e) => set("honey", e.target.value)} className="hidden" aria-hidden />
          <div><Label>Full name *</Label><Input className="mt-1" value={form.name} onChange={(e) => set("name", e.target.value)} required /></div>
          <div><Label>Email *</Label><Input className="mt-1" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required /></div>
          <div><Label>Phone</Label><Input className="mt-1" value={form.phone} onChange={(e) => set("phone", e.target.value)} /></div>
          <div><Label>Shipment type *</Label>
            <Select value={form.shipment_type} onValueChange={(v) => set("shipment_type", v)}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ocean">Ocean Freight</SelectItem>
                <SelectItem value="air">Air Freight</SelectItem>
                <SelectItem value="trucking">Trucking (FTL/LTL)</SelectItem>
                <SelectItem value="warehouse">Warehousing / 3PL</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div><Label>Origin *</Label><Input className="mt-1" placeholder="City, country" value={form.origin} onChange={(e) => set("origin", e.target.value)} required /></div>
          <div><Label>Destination *</Label><Input className="mt-1" placeholder="City, country" value={form.destination} onChange={(e) => set("destination", e.target.value)} required /></div>
          <div><Label>Weight</Label><Input className="mt-1" placeholder="e.g. 240 kg" value={form.weight} onChange={(e) => set("weight", e.target.value)} /></div>
          <div><Label>Dimensions</Label><Input className="mt-1" placeholder="e.g. 120x80x90 cm" value={form.dimensions} onChange={(e) => set("dimensions", e.target.value)} /></div>
          <div className="md:col-span-2"><Label>Notes</Label><Textarea className="mt-1" rows={4} value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="Any special handling, deadlines, or incoterms..." /></div>
          <div className="md:col-span-2"><Button type="submit" disabled={busy} size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">{busy ? "Sending..." : "Request quote"}</Button></div>
        </form>
      </section>
    </SiteLayout>
  );
}