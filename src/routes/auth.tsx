import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShieldCheck, Mail, Lock, LogIn } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SEO } from "@/components/site/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-hooks";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Admin Login | Worldwide Cargo Transit" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user && isAdmin) navigate({ to: "/admin" });
  }, [user, isAdmin, loading, navigate]);

  const onEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Signed in");
    navigate({ to: "/admin" });
  };

  const onGoogle = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/admin" });
    if (result.error) { toast.error("Google sign-in failed"); setBusy(false); return; }
    if (result.redirected) return;
    navigate({ to: "/admin" });
  };

  return (
    <SiteLayout>
      <SEO title="Admin Login" description="Sign in to the Worldwide Cargo Transit operations console." path="/auth" />
      <section className="relative min-h-[80vh] gradient-hero py-20 text-primary-foreground">
        <div className="absolute inset-0 grid-pattern opacity-20" aria-hidden />
        <div className="relative mx-auto flex max-w-md flex-col items-center px-4">
          <div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl gradient-accent shadow-glow">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h1 className="font-display text-3xl font-extrabold">Admin Portal</h1>
          <p className="mt-2 text-sm text-primary-foreground/75">Secure operations console for WWCT staff.</p>

          <div className="mt-8 w-full rounded-2xl bg-card p-7 text-foreground shadow-elevated">
            <form onSubmit={onEmailLogin} className="space-y-4">
              <div>
                <Label htmlFor="em" className="text-xs uppercase tracking-wider text-muted-foreground">Email</Label>
                <div className="relative mt-1">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="em" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9" placeholder="ops@worldwidecargotransit.com" />
                </div>
              </div>
              <div>
                <Label htmlFor="pw" className="text-xs uppercase tracking-wider text-muted-foreground">Password</Label>
                <div className="relative mt-1">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="pw" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="pl-9" placeholder="••••••••" />
                </div>
              </div>
              <Button type="submit" disabled={busy} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                <LogIn className="h-4 w-4" /> Sign In
              </Button>
            </form>

            <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" />OR<span className="h-px flex-1 bg-border" />
            </div>

            <Button onClick={onGoogle} disabled={busy} variant="outline" className="w-full">
              <svg viewBox="0 0 24 24" className="h-4 w-4"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.75h3.57c2.08-1.92 3.28-4.74 3.28-8.07z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.75c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" /><path fill="#FBBC05" d="M5.84 14.12A6.6 6.6 0 0 1 5.5 12c0-.74.13-1.46.34-2.12V7.04H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.96l3.66-2.84z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.07.56 4.21 1.65l3.15-3.15C17.45 2.18 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.04l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" /></svg>
              Continue with Google
            </Button>

            <p className="mt-6 rounded-lg bg-muted/50 p-3 text-center text-[11px] text-muted-foreground">
              Accounts are provisioned by WWCT operations. Need access? <a href="mailto:info@worldwidecargotransit.com" className="text-accent hover:underline">Contact us</a>.
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}