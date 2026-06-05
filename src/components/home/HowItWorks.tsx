import { Calendar, PackageCheck, Truck, Home } from "lucide-react";

const STEPS = [
  { icon: Calendar, title: "Book Online", desc: "Get an instant quote and confirm pickup in minutes." },
  { icon: PackageCheck, title: "We Pick Up", desc: "Our team collects your shipment on the day you choose." },
  { icon: Truck, title: "In Transit", desc: "Track every leg of the journey in real time." },
  { icon: Home, title: "Delivered", desc: "Signed proof of delivery — digital and PDF." },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">How it works</span>
        <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">From pickup to delivery in four steps</h2>
      </div>
      <div className="relative mt-14 grid gap-8 md:grid-cols-4">
        <div className="absolute left-[12%] right-[12%] top-7 hidden h-px bg-gradient-to-r from-transparent via-accent to-transparent md:block" />
        {STEPS.map((s, i) => (
          <div key={s.title} className="relative text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl gradient-accent text-accent-foreground shadow-glow">
              <s.icon className="h-6 w-6" />
            </div>
            <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-3 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
              {String(i + 1).padStart(2, "0")}
            </div>
            <h3 className="mt-4 font-display text-lg font-bold">{s.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}