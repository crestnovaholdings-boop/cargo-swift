const ITEMS = [
  "Shipment WWCT82931 in transit · Las Vegas, NV",
  "WWCT55501 delivered · Oxford St, London",
  "WWCT10042 cleared customs · Jebel Ali, Dubai",
  "WWCT77820 picked up · Toronto, Canada",
  "New route opened: Singapore → Rotterdam",
  "WWCT30019 boarded vessel · Hamburg Port",
  "Air freight capacity available · HKG → JFK",
];

export function ShipmentTicker() {
  const doubled = [...ITEMS, ...ITEMS];
  return (
    <div className="border-y border-border bg-muted/40">
      <div className="mx-auto flex max-w-7xl items-center gap-4 overflow-hidden px-4 py-3 lg:px-8">
        <span className="shrink-0 rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-foreground">Live</span>
        <div className="relative flex-1 overflow-hidden">
          <div className="flex w-max gap-10 animate-marquee">
            {doubled.map((t, i) => (
              <span key={i} className="flex items-center gap-2 whitespace-nowrap text-sm text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-soft" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}