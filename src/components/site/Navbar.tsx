import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, Package, LayoutDashboard, LogIn } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { useAuth } from "@/lib/auth-hooks";
import { Button } from "@/components/ui/button";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/tracking", label: "Tracking" },
  { to: "/quote", label: "Get a Quote" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "bg-background/85 backdrop-blur-md shadow-soft border-b border-border" : "bg-background/0"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        <Link to="/" className="group flex items-center gap-2.5">
          <div className="grid h-10 w-10 place-items-center rounded-xl gradient-accent text-accent-foreground shadow-soft transition group-hover:scale-105">
            <Package className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-base font-bold tracking-tight text-primary">{BRAND.name}</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Global Logistics</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => {
            const active = pathname === l.to || (l.to !== "/" && pathname.startsWith(l.to));
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`relative rounded-full px-3.5 py-2 text-sm font-medium transition ${
                  active ? "text-primary" : "text-muted-foreground hover:text-primary"
                }`}
              >
                {l.label}
                {active ? <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full gradient-accent" /> : null}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {user && isAdmin ? (
            <Button asChild variant="outline" size="sm">
              <Link to="/admin"><LayoutDashboard className="h-4 w-4" /> Admin</Link>
            </Button>
          ) : (
            <Button asChild variant="ghost" size="sm">
              <Link to="/auth"><LogIn className="h-4 w-4" /> Admin Login</Link>
            </Button>
          )}
          <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link to="/tracking">Track Shipment</Link>
          </Button>
        </div>

        <button
          aria-label="Menu"
          className="grid h-10 w-10 place-items-center rounded-lg border border-border lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
            {links.map((l) => (
              <Link key={l.to} to={l.to} className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted">
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2">
              <Button asChild variant="outline" className="flex-1">
                <Link to={user && isAdmin ? "/admin" : "/auth"}>{user && isAdmin ? "Admin" : "Admin Login"}</Link>
              </Button>
              <Button asChild className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90">
                <Link to="/tracking">Track</Link>
              </Button>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}