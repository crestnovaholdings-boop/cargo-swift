import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { Eye, Trash2, Mail, Phone, Package } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/quotes")({ component: QuotesPage });

type Q = {
  id: string; name: string; email: string; phone: string | null; origin: string | null; destination: string | null;
  shipment_type: string | null; weight: string | null; dimensions: string | null; message: string | null;
  is_read: boolean; created_at: string;
};

function QuotesPage() {
  const [rows, setRows] = useState<Q[]>([]);
  const [view, setView] = useState<Q | null>(null);

  const load = async () => {
    const { data } = await supabase.from("quote_requests").select("*").order("created_at", { ascending: false });
    setRows((data ?? []) as Q[]);
  };
  useEffect(() => { load(); }, []);

  const open = async (r: Q) => {
    setView(r);
    if (!r.is_read) { await supabase.from("quote_requests").update({ is_read: true }).eq("id", r.id); load(); }
  };
  const remove = async (id: string) => {
    const { error } = await supabase.from("quote_requests").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); load(); }
  };

  return (
    <AdminLayout title="Quote Requests">
      <div className="overflow-hidden rounded-2xl bg-card shadow-soft">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Received</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? <TableRow><TableCell colSpan={6} className="py-10 text-center text-muted-foreground">No quote requests yet.</TableCell></TableRow>
            : rows.map((r) => (
              <TableRow key={r.id} className={!r.is_read ? "bg-accent/5" : ""}>
                <TableCell>{!r.is_read ? <span className="inline-block h-2 w-2 rounded-full bg-accent" /> : null}</TableCell>
                <TableCell><div className="font-semibold">{r.name}</div><div className="text-xs text-muted-foreground">{r.email}</div></TableCell>
                <TableCell className="text-sm text-muted-foreground">{r.origin ?? "—"} → {r.destination ?? "—"}</TableCell>
                <TableCell className="text-sm">{r.shipment_type ?? "—"}</TableCell>
                <TableCell className="text-sm">{new Date(r.created_at).toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  <button onClick={() => open(r)} className="rounded p-1.5 hover:bg-muted"><Eye className="h-4 w-4" /></button>
                  <button onClick={() => remove(r.id)} className="rounded p-1.5 text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!view} onOpenChange={(v) => { if (!v) setView(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{view?.name}</DialogTitle></DialogHeader>
          {view ? (
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-accent" /> <a className="hover:underline" href={`mailto:${view.email}`}>{view.email}</a></div>
              {view.phone ? <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-accent" /> {view.phone}</div> : null}
              <div className="flex items-center gap-2"><Package className="h-4 w-4 text-accent" /> {view.shipment_type ?? "—"} · {view.weight ?? "?"} · {view.dimensions ?? "—"}</div>
              <div className="rounded-lg bg-muted p-3"><b>{view.origin ?? "?"} → {view.destination ?? "?"}</b></div>
              {view.message ? <p className="whitespace-pre-wrap rounded-lg bg-muted/50 p-3 text-muted-foreground">{view.message}</p> : null}
              <div className="text-xs text-muted-foreground">Received {new Date(view.created_at).toLocaleString()}</div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}