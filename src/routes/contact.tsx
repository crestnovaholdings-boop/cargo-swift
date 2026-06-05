import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SEO } from "@/components/site/SEO";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Mail, MapPin, Phone } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { mirrorToInbox } from "@/lib/formsubmit";
import { toast } from "sonner";
import { BRAND } from "@/lib/brand";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(50).optional(),
  subject: z.string().trim().min(2).max(150),
  message: z.string().trim().min(5).max(2000),
  honey: z.string().max(0).optional(),
});

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact | Worldwide Cargo Transit" }] }),
  component: Contact,
});

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "", honey: "" });
  const [busy, setBusy] = useState(false);
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(form);
    if (!r.success) { toast.error(r.error.issues[0]?.message ?? "Please check the form"); return; }
    setBusy(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: form.name, email: form.email, phone: form.phone, subject: form.subject, message: form.message,
    });
    await mirrorToInbox(`Contact: ${form.subject}`, form);
    setBusy(false);
    if (error) { toast.error("Could not send — please try again"); return; }
    toast.success("Message sent. We'll be in touch shortly.");
    setForm({ name: "", email: "", phone: "", subject: "", message: "", honey: "" });
  };

  return (
    <SiteLayout>
      <SEO title="Contact" description="Reach the Worldwide Cargo Transit operations desk — 24/7 support." path="/contact" />
      <PageHero eyebrow="Contact" title="Talk to our team" subtitle="We answer every message within one business day." />

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-[1fr_2fr] lg:px-8">
        <aside className="space-y-4">
          {[
            { I: MapPin, t: "Headquarters", v: BRAND.address },
            { I: Phone, t: "Phone", v: BRAND.phone, href: BRAND.phoneLink },
            { I: Mail, t: "Email", v: BRAND.email, href: `mailto:${BRAND.email}` },
          ].map((c) => (
            <div key={c.t} className="rounded-2xl bg-card p-5 shadow-soft">
              <c.I className="h-5 w-5 text-accent" />
              <div className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">{c.t}</div>
              {c.href ? <a className="mt-1 block text-sm font-medium text-foreground hover:text-accent" href={c.href}>{c.v}</a> : <div className="mt-1 text-sm font-medium text-foreground">{c.v}</div>}
            </div>
          ))}
          <div className="overflow-hidden rounded-2xl shadow-soft">
            <iframe title="map" src="https://www.google.com/maps?q=Wilmington%20DE&output=embed" className="h-56 w-full border-0" loading="lazy" />
          </div>
        </aside>

        <div className="rounded-2xl bg-card p-8 shadow-elevated">
          <form onSubmit={onSubmit} className="grid gap-5 md:grid-cols-2">
            <input type="text" tabIndex={-1} autoComplete="off" value={form.honey} onChange={(e) => set("honey", e.target.value)} className="hidden" aria-hidden />
            <div><Label>Name *</Label><Input className="mt-1" value={form.name} onChange={(e) => set("name", e.target.value)} required /></div>
            <div><Label>Email *</Label><Input className="mt-1" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required /></div>
            <div><Label>Phone</Label><Input className="mt-1" value={form.phone} onChange={(e) => set("phone", e.target.value)} /></div>
            <div><Label>Subject *</Label><Input className="mt-1" value={form.subject} onChange={(e) => set("subject", e.target.value)} required /></div>
            <div className="md:col-span-2"><Label>Message *</Label><Textarea className="mt-1" rows={5} value={form.message} onChange={(e) => set("message", e.target.value)} required /></div>
            <div className="md:col-span-2"><Button type="submit" disabled={busy} size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">{busy ? "Sending..." : "Send message"}</Button></div>
          </form>

          <div className="mt-10">
            <h3 className="font-display text-xl font-bold">Frequently asked</h3>
            <Accordion type="single" collapsible className="mt-3">
              <AccordionItem value="a"><AccordionTrigger>How do I track my shipment?</AccordionTrigger><AccordionContent>Use your tracking number on the Tracking page, or scan the QR code on your manifest.</AccordionContent></AccordionItem>
              <AccordionItem value="b"><AccordionTrigger>Do you offer customs clearance?</AccordionTrigger><AccordionContent>Yes — full customs brokerage on all international lanes.</AccordionContent></AccordionItem>
              <AccordionItem value="c"><AccordionTrigger>What about insurance?</AccordionTrigger><AccordionContent>Optional all-risk cargo insurance is available on every shipment.</AccordionContent></AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}