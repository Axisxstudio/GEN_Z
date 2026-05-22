import { useState } from "react";
import { Navigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Loader2, Lock } from "lucide-react";

const AdminLogin = () => {
  const { user, isAdmin, canAccessAdmin, loading, signIn, signUp, adminDemo } = useAuth();
  const location = useLocation();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  if (!loading && canAccessAdmin) {
    const to = (location.state as any)?.from ?? "/admin";
    return <Navigate to={to} replace />;
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) return toast.error("Password must be at least 8 characters");
    setBusy(true);
    const { error } = mode === "signin" ? await signIn(email, password) : await signUp(email, password);
    setBusy(false);
    if (error) return toast.error(error);
    if (mode === "signup") {
      toast.success("Account created. Ask the site owner to grant admin access.");
    } else {
      toast.success("Signed in");
    }
  };

  return (
    <div className="min-h-screen grid place-items-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto h-12 w-12 rounded-xl bg-gradient-red grid place-items-center mb-4 glow-red">
            <Lock className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="font-display text-3xl font-bold">Admin Access</h1>
          <p className="text-sm text-muted-foreground mt-1">GEN-Z Trincomalee Dashboard</p>
        </div>

        <form onSubmit={submit} className="glass rounded-xl p-6 space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 bg-background" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5 bg-background" />
          </div>
          <Button type="submit" variant="hero" size="lg" className="w-full" disabled={busy}>
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "signin" ? "Sign in" : "Create account"}
          </Button>
          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="w-full text-xs text-muted-foreground hover:text-primary"
          >
            {mode === "signin" ? "Need an account? Create one" : "Already have an account? Sign in"}
          </button>
          
          {user && !isAdmin && (
            <p className="text-xs text-amber-400 text-center">
              Signed in but no admin role. Contact site owner to grant access.
            </p>
          )}

          {adminDemo && (
            <div className="border border-primary/20 bg-primary/5 p-3.5 rounded-lg text-center space-y-2 mt-4">
              <p className="text-xs text-muted-foreground">
                Local development bypass is active. You can preview the dashboard without any credentials.
              </p>
              <Button type="button" variant="outline" size="sm" className="w-full text-xs" asChild>
                <Link to="/admin">Enter Demo Dashboard</Link>
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
