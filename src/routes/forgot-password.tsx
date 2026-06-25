import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/forgot-password")({ component: ForgotPasswordPage });

function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-md">
        <Link to="/auth" search={{ tab: "login" }} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="size-4" /> Back to login
        </Link>
        <h1 className="text-3xl font-bold">Reset your password</h1>
        <p className="mt-1 text-muted-foreground">Enter your institute email and we'll send you a reset link.</p>
        {sent ? (
          <div className="mt-6 p-4 rounded-lg bg-success/10 border border-success/30 text-sm">
            Check your inbox at <strong>{email}</strong> for a password reset link.
          </div>
        ) : (
          <form
            className="mt-6 space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setBusy(true);
              const res = await forgotPassword(email);
              setBusy(false);
              if (res.error) toast.error(res.error);
              else { setSent(true); toast.success("Reset link sent"); }
            }}
          >
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" />
            </div>
            <Button type="submit" variant="hero" className="w-full" disabled={busy}>
              {busy ? <Loader2 className="size-4 animate-spin" /> : "Send reset link"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
