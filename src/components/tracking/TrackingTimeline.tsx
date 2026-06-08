import { Check, Truck, FileCheck2, Package, AlertTriangle, PauseCircle } from "lucide-react";
import type { ShipmentStatus } from "@/lib/brand";
import { STATUS_LABEL } from "@/lib/brand";

const ICONS: Record<ShipmentStatus, typeof Check> = {
  picked_up: Package,
  in_transit: Truck,
  at_customs: FileCheck2,
  on_hold: PauseCircle,
  delivered: Check,
  exception: AlertTriangle,
};

export type Evt = {
  id: string;
  status: ShipmentStatus;
  location: string | null;
  note: string | null;
  occurred_at: string;
  lat?: number | null;
  lng?: number | null;
};

export function TrackingTimeline({ events, currentStatus }: { events: Evt[]; currentStatus: ShipmentStatus }) {
  return (
    <ol className="relative space-y-6 border-l-2 border-border pl-6">
      {events.map((e, i) => {
        const Icon = ICONS[e.status];
        const isCurrent = i === events.length - 1 && e.status === currentStatus;
        return (
          <li key={e.id} className="relative">
            <span className={`absolute -left-[34px] grid h-8 w-8 place-items-center rounded-full ${isCurrent ? "gradient-accent shadow-glow animate-pulse-soft" : "bg-muted"}`}>
              <Icon className={`h-4 w-4 ${isCurrent ? "text-accent-foreground" : "text-muted-foreground"}`} />
            </span>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div className="font-semibold text-foreground">{STATUS_LABEL[e.status]}{e.location ? ` · ${e.location}` : ""}</div>
              <div className="text-xs text-muted-foreground">{new Date(e.occurred_at).toLocaleString()}</div>
            </div>
            {e.note ? <p className="mt-1 text-sm text-muted-foreground">{e.note}</p> : null}
          </li>
        );
      })}
    </ol>
  );
}