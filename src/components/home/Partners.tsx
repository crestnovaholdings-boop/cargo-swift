const NAMES = ["DHL", "Maersk", "FedEx", "UPS", "MSC", "CMA CGM", "Hapag-Lloyd", "K Line", "Lufthansa Cargo", "Emirates", "Cathay Cargo"];
export function Partners() {
  const arr = [...NAMES, ...NAMES];
  return (
    <section className="border-y border-border bg-background py-10">
      <div className="mx-auto max-w-7xl overflow-hidden px-4 lg:px-8">
        <div className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Trusted carrier partners</div>
        <div className="relative mt-6 overflow-hidden">
          <div className="flex w-max gap-14 animate-marquee">
            {arr.map((n, i) => (
              <div key={i} className="text-xl font-display font-bold tracking-tight text-muted-foreground/60 hover:text-primary transition">{n}</div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}