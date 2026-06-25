import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/lib/auth";
import { ROADMAPS } from "@/lib/data";
import {
  TrendingUp, Target, Flame, Sparkles, Zap, BookOpen, Code2, Bot, Trophy, ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard")({ component: Dashboard });

function pickRoadmap(domain: string): string {
  const map: Record<string, string> = {
    "Full Stack Development": "full-stack",
    "Frontend Development": "frontend",
    "Backend Development": "backend",
    "Data Analytics": "data-analyst",
    "Data Science": "data-science",
    "Artificial Intelligence": "ai-ml",
    "Machine Learning": "ai-ml",
    "Cybersecurity": "cybersecurity",
    "Cloud Computing": "cloud",
    "DevOps": "devops",
    "Mobile App Development": "mobile",
  };
  return map[domain] ?? "full-stack";
}

function Dashboard() {
  const { user } = useAuth();
  if (!user) return null;

  const slug = pickRoadmap(user.domain);
  const roadmap = ROADMAPS[slug];
  const progress = 32;
  const placement = 64;
  const resume = 78;

  return (
    <AppShell>
      {/* Hero */}
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

      {/* Stats */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={TrendingUp} label="Roadmap progress" value={`${progress}%`} hint={roadmap.name} color="from-primary to-primary-glow" />
        <StatCard icon={Target} label="Placement readiness" value={`${placement}%`} hint="Top 25% of cohort" color="from-secondary to-primary" />
        <StatCard icon={Flame} label="Resume score" value={`${resume}/100`} hint="ATS-friendly" color="from-accent to-pink-500" />
        <StatCard icon={Sparkles} label="Learning streak" value={`${user.streak} days`} hint={`${user.xp} XP earned`} color="from-emerald-500 to-cyan-500" />
      </section>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Roadmap progress */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-accent font-semibold">Current Roadmap</p>
              <h2 className="text-2xl font-bold mt-1">{roadmap.name}</h2>
              <p className="text-sm text-muted-foreground">{roadmap.tagline} • {roadmap.duration}</p>
            </div>
            <Button variant="hero" size="sm" asChild>
              <Link to="/roadmaps/$slug" params={{ slug }}>Continue <ArrowRight className="size-4" /></Link>
            </Button>
          </div>
          <div className="space-y-4">
            {roadmap.stages.map((s, i) => {
              const pct = i === 0 ? 80 : i === 1 ? 35 : 0;
              return (
                <div key={s.title}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium">{s.title} <span className="text-muted-foreground">• {s.level}</span></span>
                    <span className="font-semibold">{pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-gradient-primary" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Daily challenges */}
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

      {/* Quick actions */}
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
