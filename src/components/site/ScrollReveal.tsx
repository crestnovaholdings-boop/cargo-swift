import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

/**
 * Global scroll reveal. Automatically applies fade-in animations to every
 * <section> on the page (and any child element of <main>) from varying angles.
 * Elements can opt out with data-reveal="none" or override direction with
 * data-reveal="up|down|left|right|zoom".
 */
const DIRECTIONS = ["up", "left", "right", "zoom", "up", "down"] as const;

export function ScrollReveal() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const assign = () => {
      const main = document.querySelector("main") ?? document.body;
      if (!main) return [] as HTMLElement[];
      const targets: HTMLElement[] = [];

      // Top-level sections
      const sections = main.querySelectorAll<HTMLElement>("section");
      sections.forEach((s, i) => {
        if (!s.hasAttribute("data-reveal")) {
          s.setAttribute("data-reveal", DIRECTIONS[i % DIRECTIONS.length]);
        }
        targets.push(s);

        // Direct children get staggered fades from alternating angles
        Array.from(s.children).forEach((child, ci) => {
          if (!(child instanceof HTMLElement)) return;
          if (child.hasAttribute("data-reveal")) {
            targets.push(child);
            return;
          }
          const dir = DIRECTIONS[(i + ci + 1) % DIRECTIONS.length];
          child.setAttribute("data-reveal", dir);
          child.style.transitionDelay = `${Math.min(ci * 80, 320)}ms`;
          targets.push(child);
        });
      });

      // Anything else explicitly marked
      main.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        if (!targets.includes(el)) targets.push(el);
      });

      return targets;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );

    const run = () => {
      const targets = assign();
      // Force a reflow so the initial hidden state paints before we toggle
      // `is-visible`. Without this, mobile browsers (and fast desktop loads)
      // skip the transition because the element is added and revealed in the
      // same frame.
      void document.body.offsetHeight;
      requestAnimationFrame(() => {
        targets.forEach((el) => {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            el.classList.add("is-visible");
          } else {
            observer.observe(el);
          }
        });
      });
    };

    // Defer so route content is mounted
    const t = window.setTimeout(run, 50);

    return () => {
      window.clearTimeout(t);
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}