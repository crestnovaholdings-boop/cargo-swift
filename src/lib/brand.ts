export const BRAND = {
  name: "Worldwide Cargo Transit",
  short: "WWCT",
  tagline: "Global Logistics. Delivered with Precision.",
  domain: "worldwidecargotransit.com",
  email: "info@worldwidecargotransit.com",
  phone: "+1 (800) 555-0142",
  phoneLink: "tel:+18005550142",
  whatsapp: "18005550142",
  address: "United States",
} as const;

export type ShipmentStatus =
  | "picked_up"
  | "in_transit"
  | "at_customs"
  | "delivered"
  | "exception";

export const STATUS_LABEL: Record<ShipmentStatus, string> = {
  picked_up: "Picked Up",
  in_transit: "In Transit",
  at_customs: "At Customs",
  delivered: "Delivered",
  exception: "Exception",
};

export const STATUS_CLASS: Record<ShipmentStatus, string> = {
  picked_up: "status-picked_up",
  in_transit: "status-in_transit",
  at_customs: "status-at_customs",
  delivered: "status-delivered",
  exception: "status-exception",
};

export function generateTrackingNumber() {
  const n = Math.floor(10000 + Math.random() * 89999);
  return `WWCT${n}`;
}