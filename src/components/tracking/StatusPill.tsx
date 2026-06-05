import { STATUS_CLASS, STATUS_LABEL, type ShipmentStatus } from "@/lib/brand";

export function StatusPill({ status, size = "md" }: { status: ShipmentStatus; size?: "sm" | "md" }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${STATUS_CLASS[status]} ${size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs"}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse-soft" />
      {STATUS_LABEL[status]}
    </span>
  );
}