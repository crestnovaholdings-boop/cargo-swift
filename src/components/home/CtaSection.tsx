import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl gradient-accent p-10 text-accent-foreground shadow-elevated md:p-16">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/30 blur-3xl" aria-hidden />
        <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-primary/20 blur-3xl" aria-hidden />
        <div className="relative grid items-center gap-6 md:grid-cols-[1fr_auto]">
          <div>
            <h2 className="font-display text-3xl font-extrabold leading-tight md:text-5xl">Ready to ship smarter?</h2>
            <p className="mt-3 max-w-xl text-accent-foreground/90">Get a tailored quote in minutes. Pay only for what moves.</p>
          </div>
          <div className="flex gap-3">
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary-glow">
              <Link to="/quote">Get Free Quote <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-accent-foreground/30 bg-transparent text-accent-foreground hover:bg-accent-foreground/10">
              <Link to="/contact">Talk to sales</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}