import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/lib/auth";
import {
  TrendingUp,
  Target,
  Flame,
  Sparkles,
  Zap,
  BookOpen,
  Code2,
  Bot,
  Trophy,
  ArrowRight,
  Loader2,
  Activity,
  Camera,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/dashboard")({ component: Dashboard });

type ProgressRow = {
  roadmap_id: string;
  completion_percentage: number;
  roadmaps: { slug: string; title: string; estimated_duration: string } | null;
};

function Dashboard() {
  const { user, update } = useAuth();
  const [rows, setRows] = useState<ProgressRow[] | null>(null);
  const [resumeScore, setResumeScore] = useState<number | null>(null);
  const [weekly, setWeekly] = useState<{ day: string; xp: number }[]>([]);
  const [photoModal, setPhotoModal] = useState(false);
  const [uploading, setUploading] = useState(false);

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Photo size must be less than 2MB");
      return;
    }
    setUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      const res = await update({ avatarUrl: base64 });
      setUploading(false);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Profile photo updated successfully!");
        setPhotoModal(false);
      }
    };
    reader.onerror = () => {
      setUploading(false);
      toast.error("Failed to read file");
    };
    reader.readAsDataURL(file);
  }

  async function handleRemovePhoto() {
    setUploading(true);
    const res = await update({ avatarUrl: null });
    setUploading(false);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Profile photo removed.");
      setPhotoModal(false);
    }
  }

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("user_progress")
        .select(
          "roadmap_id, completion_percentage, updated_at, roadmaps(slug, title, estimated_duration)",
        )
        .eq("user_id", user.id);
      const list = (data as any) ?? [];
      setRows(list);
      const { data: r } = await supabase
        .from("resumes")
        .select("resume_score")
        .eq("user_id", user.id)
        .maybeSingle();
      setResumeScore(r?.resume_score ?? null);

      // Weekly activity — XP earned per day for the last 7 days, derived from progress updates
      const today = new Date();
      const days = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - (6 - i));
        const key = d.toISOString().slice(0, 10);
        return { date: key, day: d.toLocaleDateString("en-US", { weekday: "short" }), xp: 0 };
      });
      list.forEach((row: any) => {
        const key = (row.updated_at ?? "").slice(0, 10);
        const slot = days.find((d) => d.date === key);
        if (slot) slot.xp += Math.max(10, Math.round(row.completion_percentage / 5));
      });
      // Add small baseline so chart isn't flat for new users
      const baseline = Math.max(5, Math.round((user.xp ?? 0) / 50));
      setWeekly(days.map((d, i) => ({ day: d.day, xp: d.xp || baseline + (i % 3) * 2 })));
    })();
  }, [user?.id]);

  if (!user) return null;

  const avgProgress =
    rows && rows.length
      ? Math.round(rows.reduce((a, r) => a + r.completion_percentage, 0) / rows.length)
      : 0;
  const placement = Math.min(
    100,
    Math.round(avgProgress * 0.5 + (resumeScore ?? 0) * 0.3 + Math.min(user.xp ?? 0, 1000) / 20),
  );

  return (
    <AppShell>
      <div className="relative">
        {/* Faint Logo Watermark in Light Background */}
        <div className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 opacity-[0.09] pointer-events-none select-none max-w-full overflow-hidden">
          <img src="/logo.png" alt="TechLand Watermark" className="w-[450px] max-w-full object-contain" />
        </div>

        <section className="relative overflow-hidden rounded-3xl bg-gradient-hero p-8 lg:p-10 shadow-elegant mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute -top-20 -right-20 size-72 rounded-full bg-accent/40 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 size-72 rounded-full bg-primary/40 blur-3xl" />
          
          <div className="relative text-primary-foreground flex-1 space-y-4">
            <div>
              <p className="text-xs uppercase tracking-widest opacity-80 font-bold">Welcome back</p>
              <h1 className="mt-1 text-3xl lg:text-4xl font-extrabold tracking-tight">
                Hey {user.fullName.split(" ")[0]} 👋
              </h1>
              <p className="mt-2 opacity-90 text-sm font-medium">
                {user.college} • {user.branch} • {user.year}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold border border-white/15">
                Domain: <b>{user.domain}</b>
              </span>
              <span className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold border border-white/15">
                Level: <b>{user.level}</b>
              </span>
            </div>
          </div>

          {/* Interactive Profile Photo Card */}
          <div className="relative glass-card border border-white/15 bg-white/5 backdrop-blur-lg rounded-2xl p-5 w-full md:w-auto md:min-w-[280px] flex items-center gap-4 hover:border-white/25 transition-all shadow-glow">
            <div className="relative shrink-0">
              <div className="size-16 rounded-full overflow-hidden bg-gradient-accent grid place-items-center text-accent-foreground text-2xl font-bold border-2 border-white/20">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Avatar" className="size-full object-cover" />
                ) : (
                  user.fullName.charAt(0).toUpperCase()
                )}
              </div>
              <button 
                onClick={() => setPhotoModal(true)} 
                className="absolute -bottom-1 -right-1 size-6 rounded-full bg-primary text-primary-foreground border border-white/20 grid place-items-center shadow-lg hover:scale-110 transition-transform"
                title="Update Profile Photo"
              >
                <Camera className="size-3.5" />
              </button>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold truncate text-sm text-white">{user.fullName}</p>
              <p className="text-xs text-white/70 truncate mt-0.5">{user.branch}</p>
              <button 
                onClick={() => setPhotoModal(true)} 
                className="text-[11px] text-primary-foreground font-semibold hover:underline mt-2 flex items-center gap-1 bg-white/10 px-2 py-1 rounded-md border border-white/10"
              >
                Update Photo
              </button>
            </div>
          </div>
        </section>

      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={TrendingUp}
          label="Avg roadmap progress"
          value={`${avgProgress}%`}
          hint={rows ? `${rows.length} roadmaps active` : "—"}
          color="from-primary to-primary-glow"
        />
        <StatCard
          icon={Target}
          label="Placement readiness"
          value={`${placement}%`}
          hint="Based on progress + resume"
          color="from-secondary to-primary"
        />
        <StatCard
          icon={Flame}
          label="Resume score"
          value={resumeScore !== null ? `${resumeScore}/100` : "—"}
          hint="Build to score"
          color="from-accent to-pink-500"
        />
        <StatCard
          icon={Sparkles}
          label="Learning streak"
          value={`${user.streak} days`}
          hint={`${user.xp} XP earned`}
          color="from-emerald-500 to-cyan-500"
        />
      </section>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card rounded-2xl p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-accent font-semibold">
                Your roadmaps
              </p>
              <h2 className="text-2xl font-bold mt-1">Continue learning</h2>
            </div>
            <Button variant="hero" size="sm" asChild>
              <Link to="/roadmaps">
                All roadmaps <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
          {!rows && (
            <div className="grid place-items-center py-10">
              <Loader2 className="size-6 animate-spin text-primary" />
            </div>
          )}
          {rows && rows.length === 0 && (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No roadmaps started yet.</p>
              <Button variant="hero" className="mt-4" asChild>
                <Link to="/roadmaps">Browse roadmaps</Link>
              </Button>
            </div>
          )}
          <div className="space-y-4">
            {rows?.map((r) => (
              <Link
                key={r.roadmap_id}
                to="/roadmaps/$slug"
                params={{ slug: r.roadmaps?.slug ?? "" }}
                className="block p-4 rounded-lg bg-background/50 hover:bg-accent/10 transition-colors"
              >
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-semibold">{r.roadmaps?.title}</span>
                  <span className="font-bold">{r.completion_percentage}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-gradient-primary"
                    style={{ width: `${r.completion_percentage}%` }}
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="size-5 text-accent" />
            <h2 className="text-lg font-bold">Today's challenges</h2>
          </div>
          <ul className="space-y-3">
            {[
              { t: "Solve 2 DSA problems (Arrays)", xp: 30 },
              { t: "Read: System Design Basics", xp: 20 },
              { t: "Update resume bullet points", xp: 15 },
              { t: "30-min mock interview with AI", xp: 40 },
            ].map((c) => (
              <li
                key={c.t}
                className="flex items-center gap-3 p-3 rounded-lg bg-background/50 hover:bg-accent/10 transition-colors"
              >
                <input type="checkbox" className="size-4 accent-[var(--color-accent)]" />
                <span className="flex-1 text-sm">{c.t}</span>
                <span className="text-xs font-bold text-accent">+{c.xp} XP</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <section className="glass-card rounded-2xl p-6 mt-8">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="size-5 text-primary" />
          <h2 className="text-lg font-bold">Weekly activity</h2>
          <span className="ml-auto text-xs text-muted-foreground">XP earned · last 7 days</span>
        </div>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weekly} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="xpFill" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="color-mix(in oklab, var(--primary) 60%, transparent)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="100%"
                    stopColor="color-mix(in oklab, var(--primary) 60%, transparent)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                stroke="color-mix(in oklab, var(--border) 40%, transparent)"
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                tick={{ fill: "currentColor", fontSize: 12 }}
                stroke="color-mix(in oklab, var(--border) 40%, transparent)"
              />
              <YAxis
                tick={{ fill: "currentColor", fontSize: 12 }}
                stroke="color-mix(in oklab, var(--border) 40%, transparent)"
              />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                }}
                labelStyle={{ color: "var(--foreground)" }}
              />
              <Area
                type="monotone"
                dataKey="xp"
                stroke="var(--primary)"
                strokeWidth={2}
                fill="url(#xpFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold mb-4">Jump back in</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickCard
            to="/learn"
            icon={BookOpen}
            title="Learning Hub"
            desc="Notes, tutorials & cheat sheets"
          />
          <QuickCard
            to="/coding"
            icon={Code2}
            title="Coding Practice"
            desc="LeetCode, HackerRank tracks"
          />
          <QuickCard to="/assistant" icon={Bot} title="TechLand AI" desc="24/7 career coach" />
          <QuickCard
            to="/leaderboard"
            icon={Trophy}
            title="Leaderboard"
            desc="Compete with peers"
          />
        </div>
      </section>

      {/* Photo Upload Modal */}
      {photoModal && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur flex items-center justify-center p-4">
          <div className="glass-card rounded-2xl border border-primary/20 w-full max-w-sm overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="font-bold text-lg text-foreground">Update Profile Photo</h3>
              <button onClick={() => setPhotoModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="size-5" />
              </button>
            </div>

            <div className="flex flex-col items-center gap-3 py-4">
              <div className="size-24 rounded-full overflow-hidden bg-gradient-primary grid place-items-center text-primary-foreground text-3xl font-bold border-2 border-primary/30 shadow-md relative">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Avatar" className="size-full object-cover" />
                ) : (
                  user.fullName.charAt(0).toUpperCase()
                )}
              </div>
              <p className="text-xs text-muted-foreground text-center">Upload a personal photo or profile image (PNG, JPG, max 2MB).</p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="w-full">
                <span className="w-full flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm cursor-pointer hover:opacity-90 transition-opacity">
                  {uploading ? <Loader2 className="size-4 animate-spin" /> : <Camera className="size-4" />}
                  Upload Photo
                </span>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" disabled={uploading} />
              </label>
              
              {user.avatarUrl && (
                <Button 
                  variant="outline" 
                  className="w-full text-rose-400 hover:text-rose-300 border-rose-500/20 hover:bg-rose-500/5 h-10 rounded-xl" 
                  onClick={handleRemovePhoto} 
                  disabled={uploading}
                >
                  Remove Photo
                </Button>
              )}
              
              <Button variant="ghost" className="w-full h-10 rounded-xl" onClick={() => setPhotoModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      </div>
    </AppShell>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  hint: string;
  color: string;
}) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div
        className={`size-10 rounded-xl bg-gradient-to-br ${color} grid place-items-center mb-3 shadow-md`}
      >
        <Icon className="size-5 text-white" />
      </div>
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{hint}</p>
    </div>
  );
}

function QuickCard({
  to,
  icon: Icon,
  title,
  desc,
}: {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}) {
  return (
    <Link
      to={to}
      className="group glass-card rounded-2xl p-5 hover:shadow-elegant hover:-translate-y-1 transition-all"
    >
      <div className="size-10 rounded-xl bg-gradient-primary grid place-items-center mb-3 group-hover:shadow-glow transition-shadow">
        <Icon className="size-5 text-primary-foreground" />
      </div>
      <p className="font-semibold">{title}</p>
      <p className="text-xs text-muted-foreground mt-1">{desc}</p>
    </Link>
  );
}
