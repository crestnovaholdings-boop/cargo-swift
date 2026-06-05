import { BarChart3, Activity, Boxes, Truck } from "lucide-react";

export function TechPlatform() {
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 lg:grid-cols-2 lg:px-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Tech platform</span>
        <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">Operations dashboard — built for visibility</h2>
        <p className="mt-4 text-muted-foreground">
          Live shipment positions, branded PDFs, customer notifications, and a powerful admin to run your freight desk. No spreadsheets, no calls.
        </p>
        <ul className="mt-6 space-y-3 text-sm">
          {[
            "Real-time map + timeline for every shipment",
            "Auto-generated manifests, invoices, and POD PDFs",
            "Customer self-service portal with email alerts",
            "Admin dashboard with KPI charts and CSV export",
          ].map((t) => (
            <li key={t} className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full gradient-accent" />{t}</li>
          ))}
        </ul>
      </div>

      <div className="relative">
        <div className="absolute -inset-6 rounded-3xl bg-accent/10 blur-3xl" aria-hidden />
        <div className="relative glass-card rounded-3xl p-6 shadow-elevated">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2"><Activity className="h-4 w-4 text-accent" /><span className="text-sm font-semibold">Today · Overview</span></div>
            <span className="rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-bold text-success">LIVE</span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[{ i: Boxes, k: "Active", v: "1,284" }, { i: Truck, k: "In transit", v: "742" }, { i: BarChart3, k: "On-time", v: "99.2%" }].map((s) => (
              <div key={s.k} className="rounded-xl bg-background p-3">
                <s.i className="h-4 w-4 text-accent" />
                <div className="mt-2 font-display text-xl font-bold">{s.v}</div>
                <div className="text-[11px] text-muted-foreground">{s.k}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl bg-background p-4">
            <div className="text-xs font-semibold text-muted-foreground">Volume · 7 days</div>
            <div className="mt-3 flex h-32 items-end gap-2">
              {[40, 65, 50, 80, 72, 95, 88].map((h, i) => (
                <div key={i} className="flex-1 rounded-t-md gradient-accent" style={{ height: `${h}%`, animationDelay: `${i * 70}ms` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}