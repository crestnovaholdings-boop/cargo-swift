const MODES = [
  { title: "Ocean Freight", desc: "FCL and LCL on every major lane, with port-to-port and door-to-door options.", img: "https://tcbgroup.com/wp-content/uploads/2021/09/Sea-Freight-Services-image-scaled.jpg" },
  { title: "Air Freight", desc: "Time-critical and charter air cargo to 200+ countries.", img: "https://alliancefreightmw.com/wp-content/uploads/2024/08/1686136310745.png" },
  { title: "Land Freight", desc: "Full and partial truckloads, cross-border haulage, and last-mile.", img: "https://www.ishwarcargo.com/wp-content/uploads/2024/07/Logistic-Business-India.jpg" },
];

export function FreightModes() {
  return (
    <section className="bg-muted/30 py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Modes of transport</span>
          <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">Sea · Air · Land</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {MODES.map((m) => (
            <div key={m.title} className="group relative h-[420px] overflow-hidden rounded-2xl shadow-elevated card-hover">
              <img src={m.img} alt={m.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-primary-foreground">
                <h3 className="font-display text-2xl font-bold">{m.title}</h3>
                <p className="mt-2 text-sm text-primary-foreground/85">{m.desc}</p>
                <div className="mt-4 inline-block rounded-full border border-accent/50 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">Available worldwide</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}