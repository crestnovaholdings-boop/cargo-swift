import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ShipmentEditor } from "@/components/admin/ShipmentEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { STATUS_LABEL, STATUS_CLASS, type ShipmentStatus } from "@/lib/brand";
import { Plus, Pencil, Trash2, ExternalLink, Search } from "lucide-react";
import { toast } from "sonner";

type Row = {
  id: string; tracking_number: string; origin: string; destination: string;
  status: ShipmentStatus; receiver_name: string; eta: string | null; created_at: string;
};

export const Route = createFileRoute("/admin/shipments")({
  validateSearch: (s: Record<string, unknown>) => ({ new: s.new === "1" || s.new === 1 ? 1 : undefined }),
  component: ShipmentsPage,
});

function ShipmentsPage() {
  const search = Route.useSearch();
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editor, setEditor] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
  const [del, setDel] = useState<Row | null>(null);

  const load = async () => {
    const { data } = await supabase.from("shipments").select("id, tracking_number, origin, destination, status, receiver_name, eta, created_at").order("created_at", { ascending: false });
    setRows((data ?? []) as Row[]);
  };
  useEffect(() => { load(); }, []);
  useEffect(() => { if (search.new) setEditor({ open: true, id: null }); }, [search.new]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (!needle) return true;
      return [r.tracking_number, r.origin, r.destination, r.receiver_name].some((v) => v.toLowerCase().includes(needle));
    });
  }, [rows, q, statusFilter]);

  const doDelete = async () => {
    if (!del) return;
    const { error } = await supabase.from("shipments").delete().eq("id", del.id);
    if (error) toast.error(error.message); else { toast.success("Shipment deleted"); load(); }
    setDel(null);
  };

  return (
    <AdminLayout title="Shipments">
      <div className="rounded-2xl bg-card shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
          <div className="flex flex-1 flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tracking #, route, receiver" className="pl-9" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {(Object.keys(STATUS_LABEL) as ShipmentStatus[]).map((s) => <SelectItem key={s} value={s}>{STATUS_LABEL[s]}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => setEditor({ open: true, id: null })} className="bg-accent text-accent-foreground hover:bg-accent/90"><Plus className="h-4 w-4" /> New shipment</Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tracking #</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Receiver</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>ETA</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="py-10 text-center text-muted-foreground">No shipments match.</TableCell></TableRow>
              ) : filtered.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-display font-bold">{r.tracking_number}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{r.origin} → {r.destination}</TableCell>
                  <TableCell>{r.receiver_name}</TableCell>
                  <TableCell><span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_CLASS[r.status]}`}>{STATUS_LABEL[r.status]}</span></TableCell>
                  <TableCell className="text-sm">{r.eta ? new Date(r.eta).toLocaleDateString() : "—"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Link to="/tracking/$id" params={{ id: r.tracking_number }} target="_blank" className="rounded p-1.5 hover:bg-muted" title="View">
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                      <button onClick={() => setEditor({ open: true, id: r.id })} className="rounded p-1.5 hover:bg-muted" title="Edit"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => setDel(r)} className="rounded p-1.5 text-destructive hover:bg-destructive/10" title="Delete"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <ShipmentEditor open={editor.open} shipmentId={editor.id} onOpenChange={(v) => setEditor({ open: v, id: v ? editor.id : null })} onSaved={load} />

      <AlertDialog open={!!del} onOpenChange={(v) => { if (!v) setDel(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete shipment?</AlertDialogTitle>
            <AlertDialogDescription>This permanently removes {del?.tracking_number} and all its tracking events.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={doDelete} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}