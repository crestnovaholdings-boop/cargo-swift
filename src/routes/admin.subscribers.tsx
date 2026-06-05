import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Download, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/subscribers")({ component: SubsPage });

type S = { id: string; email: string; created_at: string };

function SubsPage() {
  const [rows, setRows] = useState<S[]>([]);
  const load = async () => {
    const { data } = await supabase.from("newsletter_subscribers").select("*").order("created_at", { ascending: false });
    setRows((data ?? []) as S[]);
  };
  useEffect(() => { load(); }, []);

  const exportCsv = () => {
    const csv = ["email,subscribed_at", ...rows.map((r) => `${r.email},${r.created_at}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "subscribers.csv"; a.click();
  };
  const remove = async (id: string) => {
    const { error } = await supabase.from("newsletter_subscribers").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Removed"); load(); }
  };

  return (
    <AdminLayout title="Subscribers">
      <div className="overflow-hidden rounded-2xl bg-card shadow-soft">
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="text-sm text-muted-foreground"><b className="font-display text-lg text-foreground">{rows.length}</b> newsletter subscribers</div>
          <Button onClick={exportCsv} variant="outline"><Download className="h-4 w-4" /> Export CSV</Button>
        </div>
        <Table>
          <TableHeader><TableRow><TableHead>Email</TableHead><TableHead>Subscribed</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {rows.length === 0 ? <TableRow><TableCell colSpan={3} className="py-10 text-center text-muted-foreground">No subscribers yet.</TableCell></TableRow>
            : rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.email}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <button onClick={() => remove(r.id)} className="rounded p-1.5 text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}