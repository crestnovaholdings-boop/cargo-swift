import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Package, Inbox, Mail, Users, FileText, TrendingUp } from "lucide-react";
import { STATUS_LABEL, STATUS_CLASS, type ShipmentStatus } from "@/lib/brand";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

type Stats = {
  shipments: number; quotes: number; messages: number; subscribers: number; invoices: number;
  byStatus: Record<ShipmentStatus, number>;
  recent: { id: string; tracking_number: string; origin: string; destination: string; status: ShipmentStatus; created_at: string }[];
};

function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    (async () => {
      const [ships, quotes, msgs, subs, invs, recent] = await Promise.all([
        supabase.from("shipments").select("status", { count: "exact" }),
        supabase.from("quote_requests").select("id", { count: "exact", head: true }),
        supabase.from("contact_messages").select("id", { count: "exact", head: true }),
        supabase.from("newsletter_subscribers").select("id", { count: "exact", head: true }),
        supabase.from("invoices").select("id", { count: "exact", head: true }),
        supabase.from("shipments").select("id, tracking_number, origin, destination, status, created_at").order("created_at", { ascending: false }).limit(6),
      ]);
      const byStatus = { picked_up: 0, in_transit: 0, at_customs: 0, delivered: 0, exception: 0 } as Record<ShipmentStatus, number>;
      (ships.data ?? []).forEach((r: any) => { byStatus[r.status as ShipmentStatus] = (byStatus[r.status as ShipmentStatus] ?? 0) + 1; });
      setStats({
        shipments: ships.count ?? 0,
        quotes: quotes.count ?? 0,
        messages: msgs.count ?? 0,
        subscribers: subs.count ?? 0,
        invoices: invs.count ?? 0,
        byStatus,
        recent: (recent.data ?? []) as Stats["recent"],
      });
    })();
  }, []);

  const tiles = [
    { label: "Shipments", value: stats?.shipments ?? 0, icon: Package, to: "/admin/shipments" as const, accent: "from-primary to-primary-glow" },
    { label: "Quote requests", value: stats?.quotes ?? 0, icon: Inbox, to: "/admin/quotes" as const, accent: "from-accent to-accent/70" },
    { label: "Messages", value: stats?.messages ?? 0, icon: Mail, to: "/admin/messages" as const, accent: "from-primary/80 to-accent/60" },
    { label: "Subscribers", value: stats?.subscribers ?? 0, icon: Users, to: "/admin/subscribers" as const, accent: "from-accent/80 to-primary/70" },
    { label: "Invoices", value: stats?.invoices ?? 0, icon: FileText, to: "/admin/invoices" as const, accent: "from-primary to-accent" },
  ];

  return (
    <AdminLayout title="Overview">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {tiles.map((t) => {
          const Icon = t.icon;
          return (
            <Link key={t.label} to={t.to} className="group relative overflow-hidden rounded-2xl bg-card p-5 shadow-soft transition hover:shadow-glow">
              <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${t.accent}`} />
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t.label}</div>
                  <div className="mt-2 font-display text-3xl font-extrabold text-foreground">{t.value}</div>
                </div>
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-muted text-accent">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl bg-card p-5 shadow-soft lg:col-span-1">
          <h3 className="mb-4 flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wider text-accent">
            <TrendingUp className="h-4 w-4" /> Status breakdown
          </h3>
          <ul className="space-y-2">
            {(Object.keys(stats?.byStatus ?? {}) as ShipmentStatus[]).map((k) => (
              <li key={k} className="flex items-center justify-between text-sm">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_CLASS[k]}`}>
                  <span className="h-1.5 w-1.5 rounded-full bg-current" /> {STATUS_LABEL[k]}
                </span>
                <span className="font-display font-bold">{stats?.byStatus[k] ?? 0}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl bg-card p-5 shadow-soft lg:col-span-2">
          <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-accent">Recent shipments</h3>
          <ul className="divide-y divide-border">
            {stats?.recent.map((r) => (
              <li key={r.id} className="flex items-center justify-between py-2.5 text-sm">
                <div>
                  <Link to="/tracking/$id" params={{ id: r.tracking_number }} className="font-display font-bold text-foreground hover:text-accent">
                    {r.tracking_number}
                  </Link>
                  <div className="text-xs text-muted-foreground">{r.origin} → {r.destination}</div>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_CLASS[r.status]}`}>{STATUS_LABEL[r.status]}</span>
              </li>
            )) ?? <li className="py-6 text-center text-sm text-muted-foreground">Loading…</li>}
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}