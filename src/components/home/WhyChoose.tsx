import { useEffect, useRef, useState } from "react";
import { Globe2, PackageCheck, Headphones, ShieldCheck } from "lucide-react";

const STATS = [
  { icon: PackageCheck, value: 10_000_000, suffix: "+", label: "Shipments delivered" },
  { icon: Globe2, value: 200, suffix: "+", label: "Countries served" },
  { icon: ShieldCheck, value: 99.8, suffix: "%", label: "On-time delivery" },
  { icon: Headphones, value: 24, suffix: "/7", label: "Live support" },
];

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now(); const dur = 1600;
        const step = (t: number) => {
          const p = Math.min(1, (t - start) / dur);
          const ease = 1 - Math.pow(1 - p, 3);
          setN(to * ease);
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  const isFloat = to % 1 !== 0;
  const display = isFloat ? n.toFixed(1) : Math.floor(n).toLocaleString();
  return <span ref={ref}>{display}{suffix}</span>;
}

export function WhyChoose() {
  return (
    <section className="relative overflow-hidden gradient-hero py-20 text-primary-foreground">
      <div className="absolute inset-0 grid-pattern opacity-20" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Why WWCT</span>
          <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">Built for scale, obsessed with reliability</h2>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="glass-card rounded-2xl p-6 text-foreground">
              <s.icon className="h-7 w-7 text-accent" />
              <div className="mt-3 font-display text-3xl font-extrabold tracking-tight md:text-4xl">
                <Counter to={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}