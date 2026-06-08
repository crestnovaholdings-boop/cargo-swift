export const BRAND = {
  name: "Worldwide Cargo Transit",
  short: "WWCT",
  tagline: "Global Logistics. Delivered with Precision.",
  domain: "worldwidecargotransit.com",
  email: "info@worldwidecargotransit.com",
  phone: "+202-968-9946",
  phoneLink: "tel:+12029689946",
  address: "United States",
} as const;

export type ShipmentStatus =
  | "picked_up"
  | "in_transit"
  | "at_customs"
  | "on_hold"
  | "delivered"
  | "exception";

export const STATUS_LABEL: Record<ShipmentStatus, string> = {
  picked_up: "Picked Up",
  in_transit: "In Transit",
  at_customs: "At Customs",
  on_hold: "On Hold",
  delivered: "Delivered",
  exception: "Exception",
};

export const STATUS_CLASS: Record<ShipmentStatus, string> = {
  picked_up: "status-picked_up",
  in_transit: "status-in_transit",
  at_customs: "status-at_customs",
  on_hold: "status-on_hold",
  delivered: "status-delivered",
  exception: "status-exception",
};

export function generateTrackingNumber() {
  const n = Math.floor(10000 + Math.random() * 89999);
  return `WWCT${n}`;
}