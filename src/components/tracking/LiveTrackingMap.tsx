import { useEffect, useMemo, useRef } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup, LayersControl, useMap } from "react-leaflet";
import L from "leaflet";
import type { Evt } from "./TrackingTimeline";

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

function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    const b = L.latLngBounds(points);
    map.fitBounds(b, { padding: [40, 40], maxZoom: 6 });
  }, [map, points]);
  return null;
}

export function LiveTrackingMap({ events }: { events: Evt[] }) {
  const points = useMemo(
    () => events.filter((e) => e.lat != null && e.lng != null).map((e) => [Number(e.lat), Number(e.lng)] as [number, number]),
    [events.map((e: any) => `${e.lat},${e.lng}`).join("|")],
  );
  const mapRef = useRef<L.Map | null>(null);
  const center = points[0] ?? [20, 0];
  if (points.length === 0) return <div className="grid h-[420px] place-items-center rounded-2xl bg-muted text-muted-foreground">No location data yet</div>;
  const last = points[points.length - 1];

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
        <Polyline positions={points} pathOptions={{ color: "#0B2A36", weight: 3, dashArray: "6 8", opacity: 0.7 }} />
        {events.map((e, i) => (
          e.lat != null && e.lng != null ? (
            <Marker key={e.id} position={[Number(e.lat), Number(e.lng)]} icon={i === events.length - 1 ? currentIcon : DefaultIcon}>
              <Popup><div className="text-sm"><b>{e.location ?? "Event"}</b><br />{e.note}<br /><span className="text-xs text-muted-foreground">{new Date(e.occurred_at).toLocaleString()}</span></div></Popup>
            </Marker>
          ) : null
        ))}
        <FitBounds points={points} />
      </MapContainer>
    </div>
  );
}