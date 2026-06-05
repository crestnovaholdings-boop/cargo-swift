import jsPDF from "jspdf";
import QRCode from "qrcode";
import { BRAND, STATUS_LABEL, type ShipmentStatus } from "./brand";

const TEAL: [number, number, number] = [11, 42, 54];
const TEAL_GLOW: [number, number, number] = [20, 61, 77];
const COPPER: [number, number, number] = [224, 122, 43];
const GREY: [number, number, number] = [110, 120, 130];
const LIGHT: [number, number, number] = [245, 247, 249];

type Ship = {
  id: string; tracking_number: string;
  sender_name: string; sender_address: string | null; sender_phone: string | null; sender_email: string | null;
  receiver_name: string; receiver_address: string | null; receiver_phone: string | null; receiver_email: string | null;
  origin: string; destination: string;
  status: ShipmentStatus;
  eta: string | null; weight_kg: number | null; dimensions: string | null; service_type: string | null;
};
type Evt = { id: string; status: ShipmentStatus; location: string | null; note: string | null; occurred_at: string };

function header(doc: jsPDF, title: string) {
  doc.setFillColor(...TEAL); doc.rect(0, 0, 210, 30, "F");
  doc.setFillColor(...COPPER); doc.rect(0, 30, 210, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold"); doc.setFontSize(16);
  doc.text(BRAND.name, 15, 14);
  doc.setFont("helvetica", "normal"); doc.setFontSize(9);
  doc.text(BRAND.tagline, 15, 20);
  doc.setFontSize(8); doc.text(`${BRAND.domain}  ·  ${BRAND.email}  ·  ${BRAND.phone}`, 15, 26);

  doc.setFont("helvetica", "bold"); doc.setFontSize(22);
  doc.setTextColor(...COPPER); doc.text(title.toUpperCase(), 195, 18, { align: "right" });
}

function footer(doc: jsPDF) {
  const total = doc.getNumberOfPages();
  for (let p = 1; p <= total; p++) {
    doc.setPage(p);
    doc.setDrawColor(...LIGHT); doc.line(15, 285, 195, 285);
    doc.setFontSize(8); doc.setTextColor(...GREY);
    doc.text(`${BRAND.name} · ${BRAND.domain}`, 15, 291);
    doc.text(`Page ${p} of ${total}`, 195, 291, { align: "right" });
  }
}

function pillColor(status: ShipmentStatus): [number, number, number] {
  switch (status) {
    case "delivered": return [16, 185, 129];
    case "in_transit": return [40, 130, 160];
    case "at_customs": return [232, 168, 56];
    case "exception": return [220, 70, 60];
    default: return [130, 145, 160];
  }
}

function statusPill(doc: jsPDF, x: number, y: number, status: ShipmentStatus) {
  const label = STATUS_LABEL[status]; doc.setFontSize(9);
  const w = doc.getTextWidth(label) + 8;
  doc.setFillColor(...pillColor(status));
  doc.roundedRect(x, y - 4, w, 6.5, 3, 3, "F");
  doc.setTextColor(255, 255, 255); doc.setFont("helvetica", "bold");
  doc.text(label, x + 4, y);
}

function infoCard(doc: jsPDF, x: number, y: number, w: number, h: number, title: string, lines: string[]) {
  doc.setFillColor(...LIGHT); doc.roundedRect(x, y, w, h, 3, 3, "F");
  doc.setTextColor(...COPPER); doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.text(title.toUpperCase(), x + 4, y + 5);
  doc.setTextColor(...TEAL); doc.setFont("helvetica", "normal"); doc.setFontSize(10);
  let yy = y + 11;
  lines.forEach((l) => { if (!l) return; const wrapped = doc.splitTextToSize(l, w - 8); doc.text(wrapped, x + 4, yy); yy += wrapped.length * 4.5; });
}

export async function generateManifest(shipment: Ship, events: Evt[]) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  header(doc, "Shipment Manifest");

  // Meta
  doc.setTextColor(...TEAL); doc.setFont("helvetica", "bold"); doc.setFontSize(11);
  doc.text("Tracking #", 15, 42); doc.text("Status", 75, 42); doc.text("ETA", 130, 42); doc.text("Service", 165, 42);
  doc.setFont("helvetica", "normal"); doc.setFontSize(11);
  doc.text(shipment.tracking_number, 15, 49);
  statusPill(doc, 75, 49, shipment.status);
  doc.text(shipment.eta ? new Date(shipment.eta).toLocaleDateString() : "TBD", 130, 49);
  doc.text(shipment.service_type ?? "Standard", 165, 49);

  // Sender + Receiver
  infoCard(doc, 15, 56, 85, 36, "Sender", [shipment.sender_name, shipment.sender_address ?? "", shipment.sender_phone ?? "", shipment.sender_email ?? ""]);
  infoCard(doc, 110, 56, 85, 36, "Receiver", [shipment.receiver_name, shipment.receiver_address ?? "", shipment.receiver_phone ?? "", shipment.receiver_email ?? ""]);

  // Details
  infoCard(doc, 15, 96, 180, 18, "Shipment details", [
    `Origin: ${shipment.origin}    Destination: ${shipment.destination}`,
    `Weight: ${shipment.weight_kg ?? "—"} kg    Dimensions: ${shipment.dimensions ?? "—"}`,
  ]);

  // Timeline
  doc.setTextColor(...COPPER); doc.setFont("helvetica", "bold"); doc.setFontSize(11);
  doc.text("TRANSPORT TIMELINE", 15, 124);
  doc.setDrawColor(...COPPER); doc.line(15, 126, 195, 126);

  let y = 134;
  events.forEach((e) => {
    if (y > 250) { doc.addPage(); header(doc, "Shipment Manifest"); y = 42; }
    doc.setFillColor(...COPPER); doc.circle(18, y - 1, 1.6, "F");
    doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(...TEAL);
    doc.text(`${STATUS_LABEL[e.status]}${e.location ? ` · ${e.location}` : ""}`, 24, y);
    doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(...GREY);
    doc.text(new Date(e.occurred_at).toLocaleString(), 195, y, { align: "right" });
    if (e.note) { y += 4.5; const w = doc.splitTextToSize(e.note, 165); doc.text(w, 24, y); y += w.length * 4.2; }
    y += 7;
  });

  // QR
  const url = `https://${BRAND.domain}/tracking/${shipment.tracking_number}`;
  const qrData = await QRCode.toDataURL(url, { width: 200, margin: 0, color: { dark: "#0B2A36", light: "#FFFFFF" } });
  if (y > 240) { doc.addPage(); y = 30; }
  doc.addImage(qrData, "PNG", 15, 252, 26, 26);
  doc.setFontSize(8); doc.setTextColor(...GREY);
  doc.text("Scan to view live tracking", 44, 262); doc.text(url, 44, 268);

  footer(doc);
  doc.save(`${shipment.tracking_number}-manifest.pdf`);
}

export async function generateInvoice(invoice: { invoice_number: string; line_items: Array<{ desc: string; qty: number; price: number }>; subtotal: number; tax: number; total: number; issued_at?: string | null; due_at?: string | null }, shipment?: Ship | null) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  header(doc, "Invoice");
  doc.setTextColor(...TEAL); doc.setFont("helvetica", "bold"); doc.setFontSize(11);
  doc.text(`Invoice #${invoice.invoice_number}`, 15, 44);
  doc.setFont("helvetica", "normal"); doc.setFontSize(10);
  doc.text(`Issued: ${invoice.issued_at ? new Date(invoice.issued_at).toLocaleDateString() : new Date().toLocaleDateString()}`, 15, 50);
  if (invoice.due_at) doc.text(`Due: ${new Date(invoice.due_at).toLocaleDateString()}`, 15, 56);
  if (shipment) doc.text(`Shipment: ${shipment.tracking_number} (${shipment.origin} → ${shipment.destination})`, 15, 62);

  // Table
  let y = 75; doc.setFillColor(...TEAL); doc.rect(15, y - 6, 180, 8, "F");
  doc.setTextColor(255, 255, 255); doc.setFont("helvetica", "bold"); doc.setFontSize(9);
  doc.text("Description", 18, y - 1); doc.text("Qty", 130, y - 1); doc.text("Price", 150, y - 1); doc.text("Total", 192, y - 1, { align: "right" });
  doc.setTextColor(...TEAL); doc.setFont("helvetica", "normal"); doc.setFontSize(10); y += 4;
  invoice.line_items.forEach((li) => {
    doc.text(li.desc, 18, y);
    doc.text(String(li.qty), 130, y);
    doc.text(`$${li.price.toFixed(2)}`, 150, y);
    doc.text(`$${(li.qty * li.price).toFixed(2)}`, 192, y, { align: "right" });
    y += 7;
  });
  y += 4;
  doc.setDrawColor(...LIGHT); doc.line(120, y, 195, y); y += 6;
  doc.text("Subtotal", 130, y); doc.text(`$${invoice.subtotal.toFixed(2)}`, 192, y, { align: "right" }); y += 6;
  doc.text("Tax", 130, y); doc.text(`$${invoice.tax.toFixed(2)}`, 192, y, { align: "right" }); y += 6;
  doc.setFont("helvetica", "bold"); doc.setFontSize(12); doc.setTextColor(...COPPER);
  doc.text("TOTAL", 130, y); doc.text(`$${invoice.total.toFixed(2)}`, 192, y, { align: "right" });

  footer(doc);
  doc.save(`${invoice.invoice_number}.pdf`);
}

export async function generatePOD(shipment: Ship, signaturePng?: string) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  header(doc, "Proof of Delivery");
  doc.setTextColor(...TEAL); doc.setFont("helvetica", "bold"); doc.setFontSize(11);
  doc.text(`Tracking #${shipment.tracking_number}`, 15, 44);
  infoCard(doc, 15, 52, 85, 30, "Sender", [shipment.sender_name, shipment.sender_address ?? ""]);
  infoCard(doc, 110, 52, 85, 30, "Receiver", [shipment.receiver_name, shipment.receiver_address ?? ""]);
  doc.setTextColor(...TEAL); doc.setFontSize(10);
  doc.text(`Delivered at: ${new Date().toLocaleString()}`, 15, 92);
  doc.text(`Status: ${STATUS_LABEL[shipment.status]}`, 15, 98);

  doc.setFont("helvetica", "bold"); doc.text("Recipient signature", 15, 120);
  doc.setDrawColor(...GREY); doc.rect(15, 124, 180, 50);
  if (signaturePng) doc.addImage(signaturePng, "PNG", 17, 126, 176, 46);

  footer(doc);
  doc.save(`${shipment.tracking_number}-POD.pdf`);
}