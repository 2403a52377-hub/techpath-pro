import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/reset-password")({ component: ResetPasswordPage });

function ResetPasswordPage() {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold">Set a new password</h1>
        <p className="mt-1 text-muted-foreground">Choose a strong password (8+ characters, mix of letters, numbers, symbols).</p>
        <form
          className="mt-6 space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            if (pw.length < 8) return toast.error("Password too short");
            if (pw !== confirm) return toast.error("Passwords don't match");
            setBusy(true);
            const res = await resetPassword(pw);
            setBusy(false);
            if (res.error) toast.error(res.error);
            else {
              toast.success("Password updated! Please log in.");
              navigate({ to: "/auth", search: { tab: "login" } });
            }
          }}
        >
          <div>
            <Label htmlFor="np">New password</Label>
            <Input id="np" type="password" required value={pw} onChange={(e) => setPw(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="cp">Confirm password</Label>
            <Input id="cp" type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} className="mt-1.5" />
          </div>
          <Button type="submit" variant="hero" className="w-full" disabled={busy}>
            {busy ? <Loader2 className="size-4 animate-spin" /> : "Update password"}
          </Button>
        </form>
      </div>
    </div>
  );
}
