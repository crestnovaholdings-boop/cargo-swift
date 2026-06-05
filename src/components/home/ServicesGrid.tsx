import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Plane, Ship, Truck, Warehouse, ClipboardList } from "lucide-react";

const SERVICES = [
  { icon: ClipboardList, title: "Freight Dispatch", desc: "24/7 carrier dispatching with smart load matching across North America." , img:"https://images.unsplash.com/photo-1568438350562-2cae6d394ad0?auto=format&fit=crop&w=1200&q=80"},
  { icon: Truck, title: "Trucking & FTL/LTL", desc: "Dry van, reefer, flatbed — full and partial truckloads with live ETAs.", img:"https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80" },
  { icon: Plane, title: "Air Freight", desc: "Time-critical air freight to 200+ countries, including charters.", img:"https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=1200&q=80" },
  { icon: Ship, title: "Ocean Freight", desc: "FCL & LCL, port-to-port and door-to-door, on every major lane.", img:"https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&w=1200&q=80" },
  { icon: Warehouse, title: "Warehousing & 3PL", desc: "Bonded warehouses, fulfillment, pick-pack-ship, returns.", img:"https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1200&q=80" },
];

export function ServicesGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">What we do</span>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">Logistics, end-to-end</h2>
        <p className="mt-3 text-muted-foreground">Five integrated services — one operations team, one tracking experience.</p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s, i) => (
          <Link to="/services" key={s.title} className="group relative overflow-hidden rounded-2xl bg-card shadow-soft card-hover" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="aspect-[16/10] w-full overflow-hidden">
              <img src={s.img} alt={s.title} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-5 text-primary-foreground">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-lg gradient-accent"><s.icon className="h-4 w-4" /></span>
                  <h3 className="font-display text-lg font-bold">{s.title}</h3>
                </div>
                <ArrowUpRight className="h-5 w-5 opacity-0 transition group-hover:opacity-100" />
              </div>
              <p className="mt-2 text-sm text-primary-foreground/85">{s.desc}</p>
            </div>
          </Link>
        ))}
        <Link to="/quote" className="group flex items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/30 p-8 text-center card-hover">
          <div>
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl gradient-accent text-accent-foreground"><ArrowUpRight className="h-5 w-5" /></div>
            <div className="mt-3 font-display text-lg font-bold">Custom solution?</div>
            <div className="mt-1 text-sm text-muted-foreground">Get a tailored quote in under 24h.</div>
          </div>
        </Link>
      </div>
    </section>
  );
}