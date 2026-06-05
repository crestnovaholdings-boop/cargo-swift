import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth-hooks";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin | Worldwide Cargo Transit" }] }),
  component: AdminLanding,
});

function AdminLanding() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) navigate({ to: "/auth" });
  }, [user, isAdmin, loading, navigate]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-4 py-20 text-center lg:px-8">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl gradient-accent text-accent-foreground shadow-glow">
          <LayoutDashboard className="h-7 w-7" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-extrabold">Admin Console</h1>
        <p className="mt-2 text-muted-foreground">
          Welcome, {user?.email}. The full operations dashboard (shipments editor with map picker, quotes/messages/subscribers inbox, invoices, command palette) is being built in the next phase.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90"><Link to="/tracking">Try tracking</Link></Button>
          <Button onClick={signOut} variant="outline"><LogOut className="h-4 w-4" /> Sign out</Button>
        </div>
      </section>
    </SiteLayout>
  );
}