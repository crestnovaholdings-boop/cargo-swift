import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-hooks";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import {
  Package, Inbox, Mail, Users, FileText, LogOut, LayoutDashboard, Search, Command, Menu,
} from "lucide-react";
import { BRAND } from "@/lib/brand";
import { CommandPalette } from "./CommandPalette";

const NAV = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard },
  { to: "/admin/shipments", label: "Shipments", icon: Package },
  { to: "/admin/quotes", label: "Quote Requests", icon: Inbox },
  { to: "/admin/messages", label: "Messages", icon: Mail },
  { to: "/admin/subscribers", label: "Subscribers", icon: Users },
  { to: "/admin/invoices", label: "Invoices", icon: FileText },
] as const;

export function AdminLayout({ children, title }: { children: ReactNode; title: string }) {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) navigate({ to: "/auth" });
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  if (loading || !user || !isAdmin) {
    return <div className="grid min-h-screen place-items-center text-muted-foreground">Authorizing…</div>;
  }

  const sidebarNav = (
    <>
      <nav className="flex-1 space-y-1 p-3">
        {NAV.map((item) => {
          const active = location.pathname === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                active ? "bg-primary text-primary-foreground shadow-soft" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border p-3">
        <div className="mb-2 truncate px-3 text-xs text-muted-foreground">{user.email}</div>
        <Button onClick={signOut} variant="outline" className="w-full justify-start" size="sm">
          <LogOut className="h-4 w-4" /> Sign out
        </Button>
      </div>
    </>
  );

  const brandHeader = (
    <div className="border-b border-border p-5">
      <Link to="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
        <div className="grid h-9 w-9 place-items-center rounded-lg gradient-accent text-accent-foreground shadow-glow">
          <Package className="h-4 w-4" />
        </div>
        <div>
          <div className="font-display text-sm font-extrabold leading-tight">{BRAND.short}</div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Admin Console</div>
        </div>
      </Link>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card lg:flex">
        {brandHeader}
        {sidebarNav}
      </aside>

      {/* Mobile sidebar sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[280px] p-0 sm:max-w-sm bg-card border-r border-border flex flex-col">
          <SheetTitle className="sr-only">Admin Navigation</SheetTitle>
          <SheetDescription className="sr-only">Navigation menu for the admin panel</SheetDescription>
          {brandHeader}
          {sidebarNav}
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-border bg-card px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden shrink-0"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-display text-lg sm:text-xl font-extrabold text-foreground">{title}</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Welcome back, {user.email}</p>
            </div>
          </div>
          <button
            onClick={() => setPaletteOpen(true)}
            className="flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Search shipments, quotes…</span>
            <kbd className="hidden items-center gap-1 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] sm:flex">
              <Command className="h-3 w-3" /> K
            </kbd>
          </button>
        </header>
        <main className="min-w-0 flex-1 p-4 sm:p-6">{children}</main>
      </div>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
  );
}