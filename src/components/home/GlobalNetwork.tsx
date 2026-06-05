const HUBS = [
  { name: "New York", x: 26, y: 38 },
  { name: "London", x: 47, y: 30 },
  { name: "Hamburg", x: 50, y: 28 },
  { name: "Dubai", x: 60, y: 47 },
  { name: "Singapore", x: 75, y: 60 },
  { name: "Tokyo", x: 85, y: 38 },
  { name: "São Paulo", x: 34, y: 70 },
  { name: "Los Angeles", x: 16, y: 42 },
];

export function GlobalNetwork() {
  return (
    <section className="relative overflow-hidden bg-primary py-20 text-primary-foreground">
      <div className="absolute inset-0 dot-pattern opacity-30" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Global network</span>
          <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">200+ countries · 60+ hubs</h2>
          <p className="mt-3 text-primary-foreground/70">Live operations across every major trade lane.</p>
        </div>

        <div className="relative mx-auto mt-12 aspect-[2/1] max-w-5xl">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Equirectangular_projection_SW.jpg/1280px-Equirectangular_projection_SW.jpg"
            alt="World map"
            loading="lazy"
            className="absolute inset-0 h-full w-full rounded-2xl object-cover opacity-25 mix-blend-screen"
          />
          <div className="absolute inset-0">
            {HUBS.map((h) => (
              <div key={h.name} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${h.x}%`, top: `${h.y}%` }}>
                <span className="absolute inset-0 h-3 w-3 animate-[pulse-ring_2.4s_ease-out_infinite] rounded-full bg-accent" />
                <span className="relative grid h-3 w-3 place-items-center rounded-full bg-accent shadow-glow" />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap text-[11px] font-semibold text-primary-foreground/90">{h.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}