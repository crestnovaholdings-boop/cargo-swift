import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { supabase } from "@/integrations/supabase/client";
import { Package, Inbox, Mail, Users, FileText, LayoutDashboard, ExternalLink, Plus } from "lucide-react";

type ShipmentHit = { id: string; tracking_number: string; origin: string; destination: string };

export function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<ShipmentHit[]>([]);

  useEffect(() => {
    if (!open) return;
    const q = query.trim();
    let cancelled = false;
    (async () => {
      const builder = supabase.from("shipments").select("id, tracking_number, origin, destination").order("created_at", { ascending: false }).limit(8);
      const { data } = q
        ? await builder.or(`tracking_number.ilike.%${q}%,origin.ilike.%${q}%,destination.ilike.%${q}%,receiver_name.ilike.%${q}%`)
        : await builder;
      if (!cancelled) setHits((data ?? []) as ShipmentHit[]);
    })();
    return () => { cancelled = true; };
  }, [query, open]);

  const go = (to: string) => { onOpenChange(false); navigate({ to }); };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search shipments or jump to…" value={query} onValueChange={setQuery} />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Navigate">
          <CommandItem onSelect={() => go("/admin")}><LayoutDashboard className="h-4 w-4" /> Overview</CommandItem>
          <CommandItem onSelect={() => go("/admin/shipments")}><Package className="h-4 w-4" /> Shipments</CommandItem>
          <CommandItem onSelect={() => go("/admin/quotes")}><Inbox className="h-4 w-4" /> Quote requests</CommandItem>
          <CommandItem onSelect={() => go("/admin/messages")}><Mail className="h-4 w-4" /> Messages</CommandItem>
          <CommandItem onSelect={() => go("/admin/subscribers")}><Users className="h-4 w-4" /> Subscribers</CommandItem>
          <CommandItem onSelect={() => go("/admin/invoices")}><FileText className="h-4 w-4" /> Invoices</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => go("/admin/shipments?new=1")}><Plus className="h-4 w-4" /> New shipment</CommandItem>
        </CommandGroup>
        {hits.length > 0 ? (
          <>
            <CommandSeparator />
            <CommandGroup heading="Shipments">
              {hits.map((h) => (
                <CommandItem key={h.id} onSelect={() => go(`/tracking/${h.tracking_number}`)}>
                  <ExternalLink className="h-4 w-4" />
                  <span className="font-semibold">{h.tracking_number}</span>
                  <span className="ml-2 text-xs text-muted-foreground">{h.origin} → {h.destination}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        ) : null}
      </CommandList>
    </CommandDialog>
  );
}