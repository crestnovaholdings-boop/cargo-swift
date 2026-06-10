import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup, LayersControl, useMap } from "react-leaflet";
import L from "leaflet";
import type { Evt } from "./TrackingTimeline";
import { geocodeAddress } from "@/lib/geocode";

// Fix default icon paths so Leaflet markers render through CDN
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const currentIcon = L.divIcon({
  className: "",
  html: '<div style="position:relative;width:18px;height:18px;"><span style="position:absolute;inset:0;background:#E07A2B;border-radius:9999px;animation:pulseRing 2s infinite;opacity:.6"></span><span style="position:relative;display:block;width:18px;height:18px;background:#E07A2B;border:3px solid #fff;border-radius:9999px;box-shadow:0 0 12px rgba(224,122,43,.7)"></span></div><style>@keyframes pulseRing{0%{transform:scale(.6);opacity:.9}100%{transform:scale(2.4);opacity:0}}</style>',
  iconSize: [18, 18], iconAnchor: [9, 9],
});

const endpointIcon = (color: string, letter: string) => L.divIcon({
  className: "",
  html: `<div style="display:flex;align-items:center;justify-content:center;width:28px;height:28px;background:${color};border:3px solid #fff;border-radius:9999px;box-shadow:0 2px 8px rgba(0,0,0,.35);color:#fff;font:700 12px/1 system-ui">${letter}</div>`,
  iconSize: [28, 28], iconAnchor: [14, 14],
});
const senderIcon = endpointIcon("#0B2A36", "A");
const receiverIcon = endpointIcon("#0E7C66", "B");

type ShipmentLite = {
  origin: string; destination: string;
  origin_lat: number | null; origin_lng: number | null;
  destination_lat: number | null; destination_lng: number | null;
  sender_name?: string; receiver_name?: string;
};

function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    const b = L.latLngBounds(points);
    map.fitBounds(b, { padding: [40, 40], maxZoom: 6 });
  }, [map, points]);
  return null;
}

export function LiveTrackingMap({ events, shipment }: { events: Evt[]; shipment?: ShipmentLite }) {
  const eventPoints = useMemo(
    () => events.filter((e) => e.lat != null && e.lng != null).map((e) => [Number(e.lat), Number(e.lng)] as [number, number]),
    [events.map((e: any) => `${e.lat},${e.lng}`).join("|")],
  );
  const mapRef = useRef<L.Map | null>(null);

  // Auto-geocode endpoints when shipment lacks stored coordinates
  const [origin, setOrigin] = useState<[number, number] | null>(
    shipment && shipment.origin_lat != null && shipment.origin_lng != null
      ? [Number(shipment.origin_lat), Number(shipment.origin_lng)] : null,
  );
  const [destination, setDestination] = useState<[number, number] | null>(
    shipment && shipment.destination_lat != null && shipment.destination_lng != null
      ? [Number(shipment.destination_lat), Number(shipment.destination_lng)] : null,
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!shipment) return;
      if (!origin && shipment.origin) {
        const p = await geocodeAddress(shipment.origin);
        if (!cancelled && p) setOrigin([p.lat, p.lng]);
      }
      if (!destination && shipment.destination) {
        const p = await geocodeAddress(shipment.destination);
        if (!cancelled && p) setDestination([p.lat, p.lng]);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shipment?.origin, shipment?.destination]);

  const allPoints: [number, number][] = [
    ...(origin ? [origin] : []),
    ...eventPoints,
    ...(destination ? [destination] : []),
  ];

  if (allPoints.length === 0) {
    return <div className="grid h-[420px] place-items-center rounded-2xl bg-muted text-muted-foreground">No location data yet</div>;
  }

  const center = allPoints[0];
  // Route line: sender → events → receiver
  const routeLine: [number, number][] = [
    ...(origin ? [origin] : []),
    ...eventPoints,
    ...(destination ? [destination] : []),
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-border shadow-soft">
      <MapContainer center={center} zoom={3} scrollWheelZoom={false} style={{ height: 420, width: "100%" }} ref={(m) => { if (m) mapRef.current = m; }}>
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Street">
            <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite">
            <TileLayer attribution='Tiles &copy; Esri' url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Dark">
            <TileLayer attribution='&copy; CARTO' url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png" />
          </LayersControl.BaseLayer>
        </LayersControl>
        {routeLine.length >= 2 ? (
          <Polyline positions={routeLine} pathOptions={{ color: "#0B2A36", weight: 3, dashArray: "6 8", opacity: 0.7 }} />
        ) : null}
        {origin ? (
          <Marker position={origin} icon={senderIcon}>
            <Popup><div className="text-sm"><b>Sender</b><br />{shipment?.sender_name ?? ""}<br />{shipment?.origin}</div></Popup>
          </Marker>
        ) : null}
        {destination ? (
          <Marker position={destination} icon={receiverIcon}>
            <Popup><div className="text-sm"><b>Receiver</b><br />{shipment?.receiver_name ?? ""}<br />{shipment?.destination}</div></Popup>
          </Marker>
        ) : null}
        {events.map((e, i) => (
          e.lat != null && e.lng != null ? (
            <Marker key={e.id} position={[Number(e.lat), Number(e.lng)]} icon={i === events.length - 1 ? currentIcon : DefaultIcon}>
              <Popup><div className="text-sm"><b>{e.location ?? "Event"}</b><br />{e.note}<br /><span className="text-xs text-muted-foreground">{new Date(e.occurred_at).toLocaleString()}</span></div></Popup>
            </Marker>
          ) : null
        ))}
        <FitBounds points={allPoints} />
      </MapContainer>
    </div>
  );
}