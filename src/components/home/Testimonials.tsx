import { useEffect, useState } from "react";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";

const T = [
  { name: "Sarah Chen", role: "VP Ops, Acme Industries", quote: "WWCT cut our average transit by 18% in the first quarter. Tracking is so good our customers stopped calling us for updates." },
  { name: "James O'Brien", role: "Director, London Retail Group", quote: "Reliable, transparent pricing. The proof-of-delivery PDFs alone saved hours of back-and-forth with our finance team." },
  { name: "Priya Nair", role: "Logistics Lead, MENA Distributors", quote: "Their customs team is exceptional. Clearances at Jebel Ali went from 3 days to under 24 hours." },
];

export function Testimonials() {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((p) => (p + 1) % T.length), 6000); return () => clearInterval(t); }, []);
  const cur = T[i];
  return (
    <section className="bg-muted/30 py-20">
      <div className="mx-auto max-w-4xl px-4 text-center lg:px-8">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Loved by shippers</span>
        <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">What our clients say</h2>

        <div className="relative mt-10 rounded-3xl bg-card p-8 shadow-elevated md:p-12">
          <Quote className="mx-auto h-10 w-10 text-accent" />
          <p className="mt-6 font-display text-xl leading-relaxed text-foreground md:text-2xl">"{cur.quote}"</p>
          <div className="mt-6 flex items-center justify-center gap-1 text-accent">
            {[...Array(5)].map((_, idx) => <Star key={idx} className="h-4 w-4 fill-accent" />)}
          </div>
          <div className="mt-4">
            <div className="font-semibold text-foreground">{cur.name}</div>
            <div className="text-sm text-muted-foreground">{cur.role}</div>
          </div>
          <div className="absolute -bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
            {T.map((_, idx) => (
              <button key={idx} onClick={() => setI(idx)} aria-label={`Show testimonial ${idx + 1}`}
                className={`h-2 rounded-full transition ${idx === i ? "w-8 bg-accent" : "w-2 bg-border"}`} />
            ))}
          </div>
          <button aria-label="Previous" onClick={() => setI((p) => (p - 1 + T.length) % T.length)}
            className="absolute left-2 top-1/2 hidden -translate-y-1/2 rounded-full border border-border bg-background p-2 hover:bg-muted md:block"><ChevronLeft className="h-4 w-4" /></button>
          <button aria-label="Next" onClick={() => setI((p) => (p + 1) % T.length)}
            className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-full border border-border bg-background p-2 hover:bg-muted md:block"><ChevronRight className="h-4 w-4" /></button>
        </div>
      </div>
    </section>
  );
}