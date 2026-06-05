import type { ReactNode } from "react";

export function PageHero({ eyebrow, title, subtitle, image }: { eyebrow?: string; title: ReactNode; subtitle?: string; image?: string }) {
  return (
    <section className="relative isolate overflow-hidden gradient-hero py-20 text-primary-foreground md:py-28">
      {image ? (
        <div className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay" style={{ backgroundImage: `url(${image})` }} aria-hidden />
      ) : null}
      <div className="absolute inset-0 grid-pattern opacity-15" aria-hidden />
      <div className="relative mx-auto max-w-5xl px-4 text-center lg:px-8">
        {eyebrow ? <span className="text-xs font-bold uppercase tracking-[0.25em] text-accent">{eyebrow}</span> : null}
        <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight md:text-6xl shimmer-text">{title}</h1>
        {subtitle ? <p className="mx-auto mt-4 max-w-2xl text-base text-primary-foreground/80 md:text-lg">{subtitle}</p> : null}
      </div>
    </section>
  );
}