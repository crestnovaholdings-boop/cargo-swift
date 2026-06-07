import { useEffect, useState } from "react";
import { ArrowUp, Phone } from "lucide-react";
import { BRAND } from "@/lib/brand";

export function FloatingButtons() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const fn = () => setShow(window.scrollY > 400);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {show ? (
        <button
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground shadow-elevated transition hover:scale-105"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      ) : null}
      <a
        href={BRAND.phoneLink}
        aria-label="Call or text us"
        className="relative grid h-14 w-14 place-items-center rounded-full bg-accent text-accent-foreground shadow-elevated transition hover:scale-105"
      >
        <span className="absolute inset-0 animate-pulse-soft rounded-full bg-accent/40" aria-hidden />
        <Phone className="relative h-6 w-6" />
      </a>
    </div>
  );
}