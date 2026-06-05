import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41], iconAnchor: [12, 41],
});

function ClickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({ click(e) { onPick(e.latlng.lat, e.latlng.lng); } });
  return null;
}

export function MapPicker({ lat, lng, onChange }: { lat: number | null; lng: number | null; onChange: (lat: number, lng: number) => void }) {
  useEffect(() => {
    // Ensure leaflet CSS is loaded; root already imports it via tracking page, but be defensive.
    if (typeof document !== "undefined" && !document.getElementById("leaflet-css")) {
      const l = document.createElement("link");
      l.id = "leaflet-css"; l.rel = "stylesheet";
      l.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(l);
    }
  }, []);
  const center: [number, number] = [lat ?? 20, lng ?? 0];
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <MapContainer center={center} zoom={lat != null ? 5 : 2} style={{ height: 260, width: "100%" }} scrollWheelZoom>
        <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {lat != null && lng != null ? <Marker position={[lat, lng]} icon={icon} /> : null}
        <ClickHandler onPick={onChange} />
      </MapContainer>
      <div className="flex items-center justify-between border-t border-border bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
        <span>Click the map to set coordinates</span>
        <span className="font-mono">{lat != null && lng != null ? `${lat.toFixed(4)}, ${lng.toFixed(4)}` : "—"}</span>
      </div>
    </div>
  );
}