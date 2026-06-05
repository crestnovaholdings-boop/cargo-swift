import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { Eye, Trash2, Mail, Phone } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/messages")({ component: MessagesPage });

type M = { id: string; name: string; email: string; phone: string | null; subject: string | null; message: string; is_read: boolean; created_at: string };

function MessagesPage() {
  const [rows, setRows] = useState<M[]>([]);
  const [view, setView] = useState<M | null>(null);

  const load = async () => {
    const { data } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
    setRows((data ?? []) as M[]);
  };
  useEffect(() => { load(); }, []);

  const open = async (r: M) => {
    setView(r);
    if (!r.is_read) { await supabase.from("contact_messages").update({ is_read: true }).eq("id", r.id); load(); }
  };
  const remove = async (id: string) => {
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); load(); }
  };

  return (
    <AdminLayout title="Messages">
      <div className="overflow-hidden rounded-2xl bg-card shadow-soft">
        <Table>
          <TableHeader><TableRow>
            <TableHead></TableHead><TableHead>From</TableHead><TableHead>Subject</TableHead><TableHead>Received</TableHead><TableHead className="text-right">Actions</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {rows.length === 0 ? <TableRow><TableCell colSpan={5} className="py-10 text-center text-muted-foreground">Inbox is empty.</TableCell></TableRow>
            : rows.map((r) => (
              <TableRow key={r.id} className={!r.is_read ? "bg-accent/5" : ""}>
                <TableCell>{!r.is_read ? <span className="inline-block h-2 w-2 rounded-full bg-accent" /> : null}</TableCell>
                <TableCell><div className="font-semibold">{r.name}</div><div className="text-xs text-muted-foreground">{r.email}</div></TableCell>
                <TableCell className="text-sm">{r.subject ?? "—"}</TableCell>
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
          <DialogHeader><DialogTitle>{view?.subject ?? view?.name}</DialogTitle></DialogHeader>
          {view ? (
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-accent" /> <a className="hover:underline" href={`mailto:${view.email}`}>{view.email}</a></div>
              {view.phone ? <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-accent" /> {view.phone}</div> : null}
              <p className="whitespace-pre-wrap rounded-lg bg-muted/50 p-3">{view.message}</p>
              <div className="text-xs text-muted-foreground">{new Date(view.created_at).toLocaleString()}</div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}