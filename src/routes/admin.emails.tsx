import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Mail, Send, X, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { STATUS_LABEL, type ShipmentStatus } from "@/lib/brand";

export const Route = createFileRoute("/admin/emails")({ component: EmailsPage });

type Draft = {
  id: string;
  shipment_id: string;
  recipient_email: string;
  recipient_name: string | null;
  subject: string;
  body: string;
  status: "pending" | "approved" | "sent" | "rejected";
  error_message: string | null;
  created_at: string;
  sent_at: string | null;
};

type Shipment = {
  id: string;
  tracking_number: string;
  origin: string;
  destination: string;
  eta: string | null;
  service_type: string | null;
  status: ShipmentStatus;
};

function EmailsPage() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [shipments, setShipments] = useState<Record<string, Shipment>>({});
  const [filter, setFilter] = useState<"all" | Draft["status"]>("pending");
  const [editing, setEditing] = useState<Draft | null>(null);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("shipment_email_drafts")
      .select("*")
      .order("created_at", { ascending: false });
    const rows = (data ?? []) as Draft[];
    setDrafts(rows);
    const ids = Array.from(new Set(rows.map((r) => r.shipment_id)));
    if (ids.length) {
      const { data: ships } = await supabase
        .from("shipments")
        .select("id, tracking_number, origin, destination, eta, service_type, status")
        .in("id", ids);
      const map: Record<string, Shipment> = {};
      (ships ?? []).forEach((s: any) => (map[s.id] = s));
      setShipments(map);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(
    () => drafts.filter((d) => filter === "all" || d.status === filter),
    [drafts, filter]
  );

  const saveDraft = async (d: Draft) => {
    const { error } = await supabase
      .from("shipment_email_drafts")
      .update({ subject: d.subject, body: d.body, recipient_email: d.recipient_email })
      .eq("id", d.id);
    if (error) { toast.error(error.message); return false; }
    return true;
  };

  const reject = async (d: Draft) => {
    const { error } = await supabase
      .from("shipment_email_drafts")
      .update({ status: "rejected" })
      .eq("id", d.id);
    if (error) toast.error(error.message);
    else { toast.success("Email rejected"); setEditing(null); load(); }
  };

  const approveAndSend = async (d: Draft) => {
    if (!d.subject.trim() || !d.body.trim() || !d.recipient_email.trim()) {
      toast.error("Subject, body and recipient are required");
      return;
    }
    setSending(true);
    try {
      const ok = await saveDraft(d);
      if (!ok) return;

      const ship = shipments[d.shipment_id];
      const etaStr = ship?.eta
        ? new Date(ship.eta).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
        : "";
      const trackingUrl = `${window.location.origin}/tracking/${ship?.tracking_number ?? ""}`;

      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch("/lovable/email/transactional/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token ?? ""}`,
        },
        body: JSON.stringify({
          templateName: "shipment-notification",
          recipientEmail: d.recipient_email,
          idempotencyKey: `shipment-draft-${d.id}`,
          templateData: {
            subject: d.subject,
            recipientName: d.recipient_name ?? "",
            trackingNumber: ship?.tracking_number ?? "",
            origin: ship?.origin ?? "",
            destination: ship?.destination ?? "",
            eta: etaStr,
            serviceType: ship?.service_type ?? "",
            statusLabel: ship ? STATUS_LABEL[ship.status] : "",
            message: d.body,
            trackingUrl,
          },
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        await supabase
          .from("shipment_email_drafts")
          .update({ status: "pending", error_message: txt.slice(0, 500) })
          .eq("id", d.id);
        toast.error("Send failed: " + txt.slice(0, 120));
        load();
        return;
      }

      await supabase
        .from("shipment_email_drafts")
        .update({
          status: "sent",
          sent_at: new Date().toISOString(),
          approved_at: new Date().toISOString(),
          error_message: null,
        })
        .eq("id", d.id);
      toast.success("Email queued for delivery");
      setEditing(null);
      load();
    } catch (err: any) {
      toast.error(err.message ?? "Send failed");
    } finally {
      setSending(false);
    }
  };

  const counts = useMemo(() => ({
    pending: drafts.filter((d) => d.status === "pending").length,
    sent: drafts.filter((d) => d.status === "sent").length,
    rejected: drafts.filter((d) => d.status === "rejected").length,
  }), [drafts]);

  return (
    <AdminLayout title="Pending Emails">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Pending" value={counts.pending} icon={<Clock className="h-4 w-4" />} tone="amber" />
          <StatCard label="Sent" value={counts.sent} icon={<CheckCircle2 className="h-4 w-4" />} tone="green" />
          <StatCard label="Rejected" value={counts.rejected} icon={<X className="h-4 w-4" />} tone="red" />
          <StatCard label="Total" value={drafts.length} icon={<Mail className="h-4 w-4" />} tone="blue" />
        </div>

        <div className="flex flex-wrap gap-2">
          {(["pending", "sent", "rejected", "all"] as const).map((f) => (
            <Button
              key={f}
              size="sm"
              variant={filter === f ? "default" : "outline"}
              onClick={() => setFilter(f)}
              className="capitalize"
            >
              {f}
            </Button>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-card">
          {loading ? (
            <div className="p-8 text-center text-sm text-muted-foreground">Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No {filter === "all" ? "" : filter} emails.
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {filtered.map((d) => {
                const ship = shipments[d.shipment_id];
                return (
                  <li key={d.id} className="flex flex-wrap items-start justify-between gap-3 p-4 hover:bg-muted/40">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge status={d.status} />
                        {ship && (
                          <span className="font-mono text-xs text-muted-foreground">{ship.tracking_number}</span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {new Date(d.created_at).toLocaleString()}
                        </span>
                      </div>
                      <div className="mt-1 truncate font-medium text-foreground">{d.subject}</div>
                      <div className="truncate text-sm text-muted-foreground">
                        To: {d.recipient_name ? `${d.recipient_name} <${d.recipient_email}>` : d.recipient_email}
                      </div>
                      {d.error_message && (
                        <div className="mt-1 flex items-start gap-1 text-xs text-destructive">
                          <AlertCircle className="mt-0.5 h-3 w-3 shrink-0" />
                          <span>{d.error_message}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setEditing(d)}>
                        {d.status === "pending" ? "Review" : "View"}
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <Dialog open={!!editing} onOpenChange={(v) => !v && setEditing(null)}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editing?.status === "pending" ? "Review email" : "Email details"}
            </DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div>
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Recipient</Label>
                <Input
                  value={editing.recipient_email}
                  disabled={editing.status !== "pending"}
                  onChange={(e) => setEditing({ ...editing, recipient_email: e.target.value })}
                />
              </div>
              <div>
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Subject</Label>
                <Input
                  value={editing.subject}
                  disabled={editing.status !== "pending"}
                  onChange={(e) => setEditing({ ...editing, subject: e.target.value })}
                />
              </div>
              <div>
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Message body</Label>
                <Textarea
                  rows={12}
                  value={editing.body}
                  disabled={editing.status !== "pending"}
                  onChange={(e) => setEditing({ ...editing, body: e.target.value })}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Plain text — separate paragraphs with a blank line. Tracking details and the tracking button are added automatically from the shipment.
                </p>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            {editing?.status === "pending" ? (
              <>
                <Button variant="outline" onClick={() => editing && reject(editing)} disabled={sending}>
                  <X className="h-4 w-4" /> Reject
                </Button>
                <Button
                  onClick={() => editing && approveAndSend(editing)}
                  disabled={sending}
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  <Send className="h-4 w-4" /> {sending ? "Sending…" : "Approve & Send"}
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => setEditing(null)}>Close</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

function StatusBadge({ status }: { status: Draft["status"] }) {
  const map: Record<Draft["status"], { label: string; className: string }> = {
    pending: { label: "Pending review", className: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200" },
    sent: { label: "Sent", className: "bg-green-100 text-green-900 dark:bg-green-950 dark:text-green-200" },
    rejected: { label: "Rejected", className: "bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-200" },
    approved: { label: "Approved", className: "bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-200" },
  };
  const m = map[status];
  return <Badge className={m.className + " border-transparent"}>{m.label}</Badge>;
}

function StatCard({ label, value, icon, tone }: { label: string; value: number; icon: React.ReactNode; tone: "amber" | "green" | "red" | "blue" }) {
  const tones: Record<typeof tone, string> = {
    amber: "from-amber-500/10 to-amber-500/0 text-amber-700 dark:text-amber-300",
    green: "from-green-500/10 to-green-500/0 text-green-700 dark:text-green-300",
    red: "from-red-500/10 to-red-500/0 text-red-700 dark:text-red-300",
    blue: "from-blue-500/10 to-blue-500/0 text-blue-700 dark:text-blue-300",
  };
  return (
    <div className={`rounded-xl border border-border bg-gradient-to-br p-4 ${tones[tone]}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
        {icon}
      </div>
      <div className="mt-2 font-display text-2xl font-extrabold text-foreground">{value}</div>
    </div>
  );
}