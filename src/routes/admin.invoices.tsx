import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Download, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { generateInvoice } from "@/lib/generatePdf";

export const Route = createFileRoute("/admin/invoices")({ component: InvoicesPage });

type LI = { desc: string; qty: number; price: number };
type Inv = {
  id: string; invoice_number: string; shipment_id: string | null;
  line_items: LI[]; subtotal: number; tax: number; total: number; status: string;
  issued_at: string | null; due_at: string | null;
};
type ShipmentLite = { id: string; tracking_number: string; origin: string; destination: string };

function emptyInv(): Inv {
  const n = Math.floor(10000 + Math.random() * 89999);
  return {
    id: "", invoice_number: `INV-${new Date().getFullYear()}-${n}`, shipment_id: null,
    line_items: [{ desc: "Freight services", qty: 1, price: 0 }],
    subtotal: 0, tax: 0, total: 0, status: "draft",
    issued_at: new Date().toISOString(), due_at: null,
  };
}

function InvoicesPage() {
  const [rows, setRows] = useState<Inv[]>([]);
  const [ships, setShips] = useState<ShipmentLite[]>([]);
  const [edit, setEdit] = useState<Inv | null>(null);

  const load = async () => {
    const [{ data }, { data: s }] = await Promise.all([
      supabase.from("invoices").select("*").order("created_at", { ascending: false }),
      supabase.from("shipments").select("id, tracking_number, origin, destination").order("created_at", { ascending: false }),
    ]);
    setRows(((data ?? []) as any[]).map((r) => ({ ...r, line_items: (r.line_items as LI[]) ?? [] })));
    setShips((s ?? []) as ShipmentLite[]);
  };
  useEffect(() => { load(); }, []);

  const recalc = (inv: Inv): Inv => {
    const subtotal = inv.line_items.reduce((sum, li) => sum + (Number(li.qty) || 0) * (Number(li.price) || 0), 0);
    const tax = +(subtotal * 0.0).toFixed(2);
    return { ...inv, subtotal: +subtotal.toFixed(2), tax, total: +(subtotal + tax).toFixed(2) };
  };

  const save = async () => {
    if (!edit) return;
    const payload = recalc(edit);
    const dbPayload = {
      invoice_number: payload.invoice_number, shipment_id: payload.shipment_id,
      line_items: payload.line_items as any, subtotal: payload.subtotal, tax: payload.tax, total: payload.total,
      status: payload.status, issued_at: payload.issued_at, due_at: payload.due_at,
    };
    const { error } = edit.id
      ? await supabase.from("invoices").update(dbPayload).eq("id", edit.id)
      : await supabase.from("invoices").insert(dbPayload);
    if (error) toast.error(error.message); else { toast.success("Invoice saved"); setEdit(null); load(); }
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("invoices").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); load(); }
  };

  const download = async (inv: Inv) => {
    let ship: any = null;
    if (inv.shipment_id) {
      const { data } = await supabase.from("shipments").select("*").eq("id", inv.shipment_id).maybeSingle();
      ship = data;
    }
    await generateInvoice({
      invoice_number: inv.invoice_number, line_items: inv.line_items,
      subtotal: inv.subtotal, tax: inv.tax, total: inv.total,
      issued_at: inv.issued_at, due_at: inv.due_at,
    }, ship);
  };

  return (
    <AdminLayout title="Invoices">
      <div className="overflow-hidden rounded-2xl bg-card shadow-soft">
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="text-sm text-muted-foreground"><b className="font-display text-lg text-foreground">{rows.length}</b> invoices</div>
          <Button onClick={() => setEdit(emptyInv())} className="bg-accent text-accent-foreground hover:bg-accent/90"><Plus className="h-4 w-4" /> New invoice</Button>
        </div>
        <Table>
          <TableHeader><TableRow>
            <TableHead>Invoice #</TableHead><TableHead>Shipment</TableHead><TableHead>Total</TableHead><TableHead>Status</TableHead><TableHead>Issued</TableHead><TableHead className="text-right">Actions</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {rows.length === 0 ? <TableRow><TableCell colSpan={6} className="py-10 text-center text-muted-foreground">No invoices yet.</TableCell></TableRow>
            : rows.map((r) => {
              const ship = ships.find((s) => s.id === r.shipment_id);
              return (
                <TableRow key={r.id}>
                  <TableCell className="font-display font-bold">{r.invoice_number}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{ship ? `${ship.tracking_number}` : "—"}</TableCell>
                  <TableCell className="font-semibold">${r.total.toFixed(2)}</TableCell>
                  <TableCell><span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase">{r.status}</span></TableCell>
                  <TableCell className="text-sm">{r.issued_at ? new Date(r.issued_at).toLocaleDateString() : "—"}</TableCell>
                  <TableCell className="text-right">
                    <button onClick={() => download(r)} className="rounded p-1.5 hover:bg-muted" title="PDF"><Download className="h-4 w-4" /></button>
                    <button onClick={() => setEdit(r)} className="rounded p-1.5 hover:bg-muted"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => remove(r.id)} className="rounded p-1.5 text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!edit} onOpenChange={(v) => { if (!v) setEdit(null); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{edit?.id ? "Edit invoice" : "New invoice"}</DialogTitle></DialogHeader>
          {edit ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><Label>Invoice #</Label><Input value={edit.invoice_number} onChange={(e) => setEdit({ ...edit, invoice_number: e.target.value })} /></div>
                <div className="space-y-1"><Label>Status</Label>
                  <Select value={edit.status} onValueChange={(v) => setEdit({ ...edit, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{["draft", "sent", "paid", "overdue", "cancelled"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1"><Label>Shipment</Label>
                <Select value={edit.shipment_id ?? "none"} onValueChange={(v) => setEdit({ ...edit, shipment_id: v === "none" ? null : v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {ships.map((s) => <SelectItem key={s.id} value={s.id}>{s.tracking_number} · {s.origin} → {s.destination}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><Label>Issued</Label><Input type="date" value={edit.issued_at ? edit.issued_at.slice(0, 10) : ""} onChange={(e) => setEdit({ ...edit, issued_at: e.target.value ? new Date(e.target.value).toISOString() : null })} /></div>
                <div className="space-y-1"><Label>Due</Label><Input type="date" value={edit.due_at ? edit.due_at.slice(0, 10) : ""} onChange={(e) => setEdit({ ...edit, due_at: e.target.value ? new Date(e.target.value).toISOString() : null })} /></div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between"><Label>Line items</Label>
                  <Button size="sm" variant="outline" onClick={() => setEdit({ ...edit, line_items: [...edit.line_items, { desc: "", qty: 1, price: 0 }] })}><Plus className="h-3 w-3" /> Add</Button>
                </div>
                {edit.line_items.map((li, i) => (
                  <div key={i} className="grid grid-cols-[1fr_70px_90px_30px] gap-2">
                    <Input placeholder="Description" value={li.desc} onChange={(e) => { const arr = [...edit.line_items]; arr[i] = { ...arr[i], desc: e.target.value }; setEdit({ ...edit, line_items: arr }); }} />
                    <Input type="number" step="0.01" value={li.qty} onChange={(e) => { const arr = [...edit.line_items]; arr[i] = { ...arr[i], qty: Number(e.target.value) }; setEdit({ ...edit, line_items: arr }); }} />
                    <Input type="number" step="0.01" value={li.price} onChange={(e) => { const arr = [...edit.line_items]; arr[i] = { ...arr[i], price: Number(e.target.value) }; setEdit({ ...edit, line_items: arr }); }} />
                    <button onClick={() => setEdit({ ...edit, line_items: edit.line_items.filter((_, j) => j !== i) })} className="text-destructive"><Trash2 className="h-4 w-4" /></button>
                  </div>
                ))}
                <div className="text-right text-sm">
                  Subtotal: <b>${recalc(edit).subtotal.toFixed(2)}</b> · Total: <b className="text-accent">${recalc(edit).total.toFixed(2)}</b>
                </div>
              </div>
            </div>
          ) : null}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEdit(null)}>Cancel</Button>
            <Button onClick={save} className="bg-accent text-accent-foreground hover:bg-accent/90">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}