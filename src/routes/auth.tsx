import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { useAuth, type Year, type Domain, type Level } from "@/lib/auth";
import { DOMAINS } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle, ArrowLeft, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Search = { tab?: "login" | "signup" };

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    tab: s.tab === "signup" ? "signup" : "login",
  }),
  component: AuthPage,
});

const YEARS: Year[] = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Graduate Student"];
const LEVELS: Level[] = ["Beginner", "Intermediate", "Advanced"];

function passwordChecks(p: string) {
  return [
    { label: "8+ characters", ok: p.length >= 8 },
    { label: "Uppercase letter", ok: /[A-Z]/.test(p) },
    { label: "Lowercase letter", ok: /[a-z]/.test(p) },
    { label: "Number", ok: /\d/.test(p) },
    { label: "Special character", ok: /[^A-Za-z0-9]/.test(p) },
  ];
}

function AuthPage() {
  const { tab } = Route.useSearch();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex relative overflow-hidden bg-gradient-hero p-12 flex-col justify-between">
        <div className="absolute -top-32 -right-32 size-96 rounded-full bg-accent/40 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 size-96 rounded-full bg-secondary/40 blur-3xl" />
        <Link to="/" className="relative flex items-center gap-2 text-primary-foreground">
          <div className="size-9 rounded-xl bg-background/20 backdrop-blur grid place-items-center font-bold">
            T
          </div>
          <span className="text-xl font-bold">TechLand</span>
        </Link>
        <div className="relative text-primary-foreground">
          <Sparkles className="size-8 mb-4" />
          <h2 className="text-4xl font-bold leading-tight">
            Your AI-powered career copilot for engineering.
          </h2>
          <p className="mt-4 text-primary-foreground/80">
            Roadmaps, coding practice, mock interviews, resume builder, mentorship — built for
            students from top engineering colleges.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              { n: "50K+", l: "Students" },
              { n: "14", l: "Domains" },
              { n: "92%", l: "Placed" },
            ].map((s) => (
              <div key={s.l} className="glass-card rounded-xl p-4 text-foreground">
                <p className="text-2xl font-bold gradient-text">{s.n}</p>
                <p className="text-xs text-muted-foreground">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-primary-foreground/60 text-sm">© 2026 TechLand</p>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="flex p-1 rounded-xl bg-muted mb-8">
            {(["login", "signup"] as const).map((t) => (
              <button
                key={t}
                onClick={() => navigate({ to: "/auth", search: { tab: t } })}
                className={cn(
                  "flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all",
                  tab === t ? "bg-background shadow-md text-foreground" : "text-muted-foreground",
                )}
              >
                {t === "login" ? "Log in" : "Create account"}
              </button>
            ))}
          </div>
          {tab === "login" ? <LoginForm /> : <SignupForm />}
        </div>
      </div>
    </div>
  );
}

function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        const res = await login(email, password, remember);
        setBusy(false);
        if (res.error) {
          toast.error(res.error);
        } else {
          toast.success("Welcome back!");
          navigate({ to: "/dashboard" });
        }
      }}
      className="space-y-5"
    >
      <div>
        <h1 className="text-3xl font-bold">Welcome back 👋</h1>
        <p className="mt-1 text-muted-foreground">Log in to continue your journey.</p>
      </div>
      <div>
        <Label htmlFor="le">Institute email</Label>
        <Input
          id="le"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@iitb.ac.in"
          className="mt-1.5"
        />
      </div>
      <div>
        <Label htmlFor="lp">Password</Label>
        <Input
          id="lp"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="mt-1.5"
        />
      </div>
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="size-4 rounded"
          />
          Remember me
        </label>
        <Link to="/forgot-password" className="text-primary font-medium hover:underline">
          Forgot password?
        </Link>
      </div>
      <Button type="submit" variant="hero" size="lg" className="w-full" disabled={busy}>
        {busy ? <Loader2 className="size-4 animate-spin" /> : "Log in"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        New here?{" "}
        <Link to="/auth" search={{ tab: "signup" }} className="text-primary font-semibold">
          Create account
        </Link>
      </p>
    </form>
  );
}

const SignupSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(80),
  email: z.string().trim().email("Valid email required").max(120),
  college: z.string().trim().min(2, "College name required").max(120),
  branch: z.string().trim().min(2, "Branch required").max(80),
  year: z.string().min(1),
  domain: z.string().min(1),
  level: z.string().min(1),
  password: z.string().min(8),
});

function SignupForm() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    college: "",
    branch: "",
    year: "" as Year | "",
    domain: "" as Domain | "",
    level: "" as Level | "",
    password: "",
    confirm: "",
  });

  const pw = passwordChecks(form.password);
  const pwOk = pw.every((c) => c.ok);
  const pwScore = pw.filter((c) => c.ok).length;

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const stepValid = useMemo(() => {
    if (step === 0)
      return (
        form.fullName.length >= 2 &&
        /\S+@\S+\.\S+/.test(form.email) &&
        form.college.length >= 2 &&
        form.branch.length >= 2 &&
        !!form.year
      );
    if (step === 1) return !!form.domain && !!form.level;
    return pwOk && form.password === form.confirm;
  }, [step, form, pwOk]);

  async function submit() {
    const parsed = SignupSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    setBusy(true);
    const res = await signup({
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      password: form.password,
      college: form.college.trim(),
      branch: form.branch.trim(),
      year: form.year as Year,
      domain: form.domain as Domain,
      level: form.level as Level,
    });
    setBusy(false);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    toast.success("Account created! Welcome to TechLand 🎉");
    navigate({ to: "/dashboard" });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Join TechLand</h1>
        <p className="mt-1 text-muted-foreground">
          Step {step + 1} of 3 — let's personalize your path.
        </p>
      </div>

      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full",
              i <= step ? "bg-gradient-primary" : "bg-muted",
            )}
          />
        ))}
      </div>

      {step === 0 && (
        <div className="space-y-4">
          <Field label="Full name">
            <Input
              value={form.fullName}
              onChange={(e) => set("fullName", e.target.value)}
              placeholder="Aarav Patel"
            />
          </Field>
          <Field label="Institute email">
            <Input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="you@iitb.ac.in"
            />
          </Field>
          <Field label="College / University">
            <Input
              value={form.college}
              onChange={(e) => set("college", e.target.value)}
              placeholder="IIT Bombay"
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Branch">
              <Input
                value={form.branch}
                onChange={(e) => set("branch", e.target.value)}
                placeholder="CSE"
              />
            </Field>
            <Field label="Year of study">
              <select
                value={form.year}
                onChange={(e) => set("year", e.target.value as Year)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">Select…</option>
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-5">
          <Field label="Interested career domain">
            <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto p-1">
              {DOMAINS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => set("domain", d)}
                  className={cn(
                    "text-left px-3 py-2 rounded-lg border text-sm transition-all",
                    form.domain === d
                      ? "border-primary bg-primary/10 font-semibold shadow-md"
                      : "border-border hover:border-primary/50",
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Current skill level">
            <div className="grid grid-cols-3 gap-2">
              {LEVELS.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => set("level", l)}
                  className={cn(
                    "px-3 py-3 rounded-lg border text-sm font-medium transition-all",
                    form.level === l
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border hover:border-accent/50",
                  )}
                >
                  {l}
                </button>
              ))}
            </div>
          </Field>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <Field label="Create password">
            <Input
              type="password"
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              placeholder="••••••••"
            />
          </Field>
          <div className="flex gap-1.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 flex-1 rounded-full",
                  i < pwScore
                    ? pwScore < 3
                      ? "bg-destructive"
                      : pwScore < 5
                        ? "bg-warning"
                        : "bg-success"
                    : "bg-muted",
                )}
              />
            ))}
          </div>
          <ul className="grid grid-cols-2 gap-1.5 text-xs">
            {pw.map((c) => (
              <li
                key={c.label}
                className={cn(
                  "flex items-center gap-1.5",
                  c.ok ? "text-success" : "text-muted-foreground",
                )}
              >
                {c.ok ? <CheckCircle2 className="size-3.5" /> : <XCircle className="size-3.5" />}
                {c.label}
              </li>
            ))}
          </ul>
          <Field label="Confirm password">
            <Input
              type="password"
              value={form.confirm}
              onChange={(e) => set("confirm", e.target.value)}
              placeholder="••••••••"
            />
          </Field>
          {form.confirm && form.password !== form.confirm && (
            <p className="text-xs text-destructive">Passwords don't match</p>
          )}
        </div>
      )}

      <div className="flex gap-3">
        {step > 0 && (
          <Button type="button" variant="outline" onClick={() => setStep((s) => s - 1)}>
            <ArrowLeft className="size-4" /> Back
          </Button>
        )}
        {step < 2 ? (
          <Button
            type="button"
            variant="hero"
            className="flex-1"
            disabled={!stepValid}
            onClick={() => setStep((s) => s + 1)}
          >
            Continue <ArrowRight className="size-4" />
          </Button>
        ) : (
          <Button
            type="button"
            variant="hero"
            className="flex-1"
            disabled={!stepValid || busy}
            onClick={submit}
          >
            {busy ? <Loader2 className="size-4 animate-spin" /> : "Create account"}
          </Button>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-1.5 block">{label}</Label>
      {children}
    </div>
  );
}
