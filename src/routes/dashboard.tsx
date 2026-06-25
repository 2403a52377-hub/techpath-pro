import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/lib/auth";
import {
  TrendingUp, Target, Flame, Sparkles, Zap, BookOpen, Code2, Bot, Trophy, ArrowRight, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/dashboard")({ component: Dashboard });

type ProgressRow = {
  roadmap_id: string;
  completion_percentage: number;
  roadmaps: { slug: string; title: string; estimated_duration: string } | null;
};

function Dashboard() {
  const { user } = useAuth();
  const [rows, setRows] = useState<ProgressRow[] | null>(null);
  const [resumeScore, setResumeScore] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("user_progress")
        .select("roadmap_id, completion_percentage, roadmaps(slug, title, estimated_duration)")
        .eq("user_id", user.id);
      setRows((data as any) ?? []);
      const { data: r } = await supabase.from("resumes").select("resume_score").eq("user_id", user.id).maybeSingle();
      setResumeScore(r?.resume_score ?? null);
    })();
  }, [user?.id]);

  if (!user) return null;

  const avgProgress = rows && rows.length ? Math.round(rows.reduce((a, r) => a + r.completion_percentage, 0) / rows.length) : 0;
  const placement = Math.min(100, Math.round(avgProgress * 0.5 + (resumeScore ?? 0) * 0.3 + Math.min(user.xp ?? 0, 1000) / 20));
  const top = rows?.slice().sort((a, b) => b.completion_percentage - a.completion_percentage)[0];

  return (
    <AppShell>
      <section className="relative overflow-hidden rounded-3xl bg-gradient-hero p-8 lg:p-10 shadow-elegant mb-8">
        <div className="absolute -top-20 -right-20 size-72 rounded-full bg-accent/40 blur-3xl" />
        <div className="relative text-primary-foreground">
          <p className="text-sm uppercase tracking-widest opacity-80">Welcome back</p>
          <h1 className="mt-1 text-3xl lg:text-4xl font-bold">Hey {user.fullName.split(" ")[0]} 👋</h1>
          <p className="mt-2 opacity-90">{user.college} • {user.branch} • {user.year}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="px-3 py-1.5 rounded-full bg-background/15 backdrop-blur text-sm">Domain: <b>{user.domain}</b></span>
            <span className="px-3 py-1.5 rounded-full bg-background/15 backdrop-blur text-sm">Level: <b>{user.level}</b></span>
          </div>
        </div>
      </section>

      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={TrendingUp} label="Avg roadmap progress" value={`${avgProgress}%`} hint={rows ? `${rows.length} roadmaps active` : "—"} color="from-primary to-primary-glow" />
        <StatCard icon={Target} label="Placement readiness" value={`${placement}%`} hint="Based on progress + resume" color="from-secondary to-primary" />
        <StatCard icon={Flame} label="Resume score" value={resumeScore !== null ? `${resumeScore}/100` : "—"} hint="Build to score" color="from-accent to-pink-500" />
        <StatCard icon={Sparkles} label="Learning streak" value={`${user.streak} days`} hint={`${user.xp} XP earned`} color="from-emerald-500 to-cyan-500" />
      </section>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card rounded-2xl p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-accent font-semibold">Your roadmaps</p>
              <h2 className="text-2xl font-bold mt-1">Continue learning</h2>
            </div>
            <Button variant="hero" size="sm" asChild>
              <Link to="/roadmaps">All roadmaps <ArrowRight className="size-4" /></Link>
            </Button>
          </div>
          {!rows && <div className="grid place-items-center py-10"><Loader2 className="size-6 animate-spin text-primary" /></div>}
          {rows && rows.length === 0 && (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No roadmaps started yet.</p>
              <Button variant="hero" className="mt-4" asChild><Link to="/roadmaps">Browse roadmaps</Link></Button>
            </div>
          )}
          <div className="space-y-4">
            {rows?.map((r) => (
              <Link key={r.roadmap_id} to="/roadmaps/$slug" params={{ slug: r.roadmaps?.slug ?? "" }}
                className="block p-4 rounded-lg bg-background/50 hover:bg-accent/10 transition-colors">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-semibold">{r.roadmaps?.title}</span>
                  <span className="font-bold">{r.completion_percentage}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-gradient-primary" style={{ width: `${r.completion_percentage}%` }} />
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
              <li key={c.t} className="flex items-center gap-3 p-3 rounded-lg bg-background/50 hover:bg-accent/10 transition-colors">
                <input type="checkbox" className="size-4 accent-[var(--color-accent)]" />
                <span className="flex-1 text-sm">{c.t}</span>
                <span className="text-xs font-bold text-accent">+{c.xp} XP</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="text-xl font-bold mb-4">Jump back in</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickCard to="/learn" icon={BookOpen} title="Learning Hub" desc="Notes, tutorials & cheat sheets" />
          <QuickCard to="/coding" icon={Code2} title="Coding Practice" desc="LeetCode, HackerRank tracks" />
          <QuickCard to="/assistant" icon={Bot} title="TechLand AI" desc="24/7 career coach" />
          <QuickCard to="/leaderboard" icon={Trophy} title="Leaderboard" desc="Compete with peers" />
        </div>
      </section>
    </AppShell>
  );
}

function StatCard({ icon: Icon, label, value, hint, color }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; hint: string; color: string; }) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className={`size-10 rounded-xl bg-gradient-to-br ${color} grid place-items-center mb-3 shadow-md`}>
        <Icon className="size-5 text-white" />
      </div>
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{hint}</p>
    </div>
  );
}

function QuickCard({ to, icon: Icon, title, desc }: { to: string; icon: React.ComponentType<{ className?: string }>; title: string; desc: string }) {
  return (
    <Link to={to} className="group glass-card rounded-2xl p-5 hover:shadow-elegant hover:-translate-y-1 transition-all">
      <div className="size-10 rounded-xl bg-gradient-primary grid place-items-center mb-3 group-hover:shadow-glow transition-shadow">
        <Icon className="size-5 text-primary-foreground" />
      </div>
      <p className="font-semibold">{title}</p>
      <p className="text-xs text-muted-foreground mt-1">{desc}</p>
    </Link>
  );
}
