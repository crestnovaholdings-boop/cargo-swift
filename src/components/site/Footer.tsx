import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MapPin, Phone, Package, Send } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { mirrorToInbox } from "@/lib/formsubmit";

export function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) { toast.error("Enter a valid email"); return; }
    setLoading(true);
    const { error } = await supabase.from("newsletter_subscribers").insert({ email });
    setLoading(false);
    if (error && !String(error.message).toLowerCase().includes("duplicate") && !String(error.message).toLowerCase().includes("unique")) {
      toast.error("Something went wrong");
    } else {
      await mirrorToInbox("New Newsletter Subscriber — WWCT", { email });
      toast.success("Subscribed! Watch your inbox.");
      setEmail("");
    }
  };

  return (
    <footer className="mt-20 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="grid h-10 w-10 place-items-center rounded-xl gradient-accent"><Package className="h-5 w-5" /></div>
              <div className="font-display text-lg font-bold">{BRAND.name}</div>
            </div>
            <p className="mt-4 text-sm text-primary-foreground/70 leading-relaxed">
              Premium global logistics: freight dispatch, trucking, ocean &amp; air freight, warehousing — all on one real-time platform.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-primary-foreground/80">Company</h4>
            <ul className="mt-4 space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/about" className="hover:text-accent">About</Link></li>
              <li><Link to="/services" className="hover:text-accent">Services</Link></li>
              <li><Link to="/quote" className="hover:text-accent">Get a Quote</Link></li>
              <li><Link to="/contact" className="hover:text-accent">Contact</Link></li>
              <li><Link to="/tracking" className="hover:text-accent">Track Shipment</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-primary-foreground/80">Contact</h4>
            <ul className="mt-4 space-y-3 text-sm text-primary-foreground/80">
              <li className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />{BRAND.address}</li>
              <li className="flex gap-2"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" /><a className="hover:text-accent" href={BRAND.phoneLink}>{BRAND.phone}</a></li>
              <li className="flex gap-2"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" /><a className="hover:text-accent" href={`mailto:${BRAND.email}`}>{BRAND.email}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-primary-foreground/80">Newsletter</h4>
            <p className="mt-4 text-sm text-primary-foreground/70">Route updates and capacity alerts.</p>
            <form onSubmit={onSubmit} className="mt-3 flex gap-2">
              <Input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-primary-glow bg-primary-glow/40 text-primary-foreground placeholder:text-primary-foreground/50"
                required
              />
              <Button type="submit" disabled={loading} className="bg-accent text-accent-foreground hover:bg-accent/90"><Send className="h-4 w-4" /></Button>
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-primary-glow/40 pt-6 text-xs text-primary-foreground/60 md:flex-row">
          <div>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</div>
          <div>{BRAND.domain}</div>
        </div>
      </div>
    </footer>
  );
}