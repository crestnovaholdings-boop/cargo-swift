import { Shield, Cpu, Clock, BadgeDollarSign, Leaf, Users } from "lucide-react";

const ITEMS = [
  { icon: Shield, title: "Cargo insurance", desc: "Optional all-risk coverage up to declared value, every shipment." },
  { icon: Cpu, title: "Smart routing", desc: "AI-assisted lane and carrier selection for best price + ETA." },
  { icon: Clock, title: "Real-time visibility", desc: "GPS events on every leg — pickup to proof of delivery." },
  { icon: BadgeDollarSign, title: "Transparent pricing", desc: "All-in rates with no surprise accessorials." },
  { icon: Leaf, title: "Lower-emission options", desc: "Sea/rail consolidations and verified carbon reporting." },
  { icon: Users, title: "Dedicated team", desc: "A named account manager + 24/7 ops desk." },
];

export function ValueProps() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {ITEMS.map((s) => (
          <div key={s.title} className="gradient-border p-[1px] card-hover">
            <div className="rounded-[inherit] bg-card p-6">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent/10 text-accent"><s.icon className="h-5 w-5" /></span>
              <h3 className="mt-4 font-display text-lg font-bold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}