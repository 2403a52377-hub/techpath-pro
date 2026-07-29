import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  Target,
  Flame,
  Sparkles,
  Zap,
  BookOpen,
  Code2,
  Briefcase,
  Trophy,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  ArrowRight,
  Loader2,
  Activity,
  Camera,
  X,
  Map,
  FolderGit2,
  MessagesSquare,
  Building2,
  Users,
  ShieldCheck,
  FileText,
  GraduationCap,
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
  const [resumeData, setResumeData] = useState<any>(null);
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
        .select("resume_score, resume_data")
        .eq("user_id", user.id)
        .maybeSingle();
      setResumeScore(r?.resume_score ?? null);
      setResumeData(r?.resume_data ?? null);

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

  const resumeChecks = [
    {
      label: "Professional Headline",
      score: 10,
      checked: resumeData ? (resumeData.headline?.length > 8) : false,
      tip: "Add a clear job title or aspirational role (e.g. Frontend Engineer)."
    },
    {
      label: "Professional Summary",
      score: 15,
      checked: resumeData ? (resumeData.summary?.length > 60) : false,
      tip: "Write a short summary (at least 60 characters) highlighting your top skills."
    },
    {
      label: "Core Skills (5+)",
      score: 15,
      checked: resumeData ? (resumeData.skills?.split(",").filter(Boolean).length >= 5) : false,
      tip: "List at least 5 technical skills separated by commas."
    },
    {
      label: "Education Details",
      score: 10,
      checked: resumeData ? (resumeData.educations?.length > 0 && resumeData.educations[0]?.degree?.length > 4) : false,
      tip: "List your current degree and institution."
    },
    {
      label: "Project Descriptions",
      score: 20,
      checked: resumeData ? (resumeData.projects?.length > 0 && resumeData.projects[0]?.description?.length > 30) : false,
      tip: "Describe at least 1 project in detail (>30 chars) focusing on tech used and metrics."
    },
    {
      label: "Work Experience",
      score: 20,
      checked: resumeData ? (resumeData.experiences?.length > 0 && resumeData.experiences[0]?.description?.length > 30) : false,
      tip: "Describe internship or project role experiences (>30 chars)."
    },
    {
      label: "Personal/GitHub Link",
      score: 5,
      checked: resumeData ? (resumeData.websiteUrl?.length > 5) : false,
      tip: "Link to your GitHub profile or personal portfolio site."
    },
    {
      label: "Achievements / Extras",
      score: 5,
      checked: resumeData ? (resumeData.extras?.length > 0) : false,
      tip: "List certificates, achievements, or extra courses."
    }
  ];

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
          hint={rows && rows.length > 0 ? `${rows.length} active roadmaps` : "Start a roadmap"}
          color="from-blue-500 to-cyan-500"
          to="/roadmaps"
        />
        <StatCard
          icon={Target}
          label="Placement readiness"
          value={`${placement}%`}
          hint="Based on progress + resume"
          color="from-violet-500 to-purple-500"
          to="/placement"
        />
        <StatCard
          icon={Flame}
          label="Resume score"
          value={resumeScore !== null ? `${resumeScore}/100` : "Not Built"}
          hint={resumeScore !== null ? "ATS-Ready Resume" : "Click to build ATS resume"}
          color="from-amber-500 to-rose-500"
          to="/resume"
        />
        <StatCard
          icon={Sparkles}
          label="Learning streak"
          value={`${user.streak} days`}
          hint={`${user.xp} XP earned`}
          color="from-emerald-500 to-teal-500"
          to="/leaderboard"
        />
      </section>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card rounded-2xl p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-primary font-semibold">
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
            <div className="rounded-xl border border-white/10 bg-background/30 p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="size-12 rounded-xl bg-primary/10 border border-primary/20 grid place-items-center shrink-0">
                  <BookOpen className="size-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-base">No active roadmaps yet</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Choose a structured learning path in Full Stack Development, DSA, DevOps, or Data Science to track your weekly progress and earn XP.
                  </p>
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-3 pt-2">
                {[
                  { title: "Full-Stack Web Dev", slug: "full-stack-web-development", dur: "12 weeks" },
                  { title: "DSA & Problem Solving", slug: "dsa-and-problem-solving", dur: "10 weeks" },
                  { title: "DevOps & Cloud", slug: "devops-and-cloud-engineering", dur: "8 weeks" },
                ].map((item) => (
                  <Link
                    key={item.slug}
                    to="/roadmaps/$slug"
                    params={{ slug: item.slug }}
                    className="p-3 rounded-lg border border-white/10 bg-background/50 hover:border-primary/30 hover:bg-primary/5 transition-all text-xs space-y-1 block"
                  >
                    <p className="font-bold text-foreground truncate">{item.title}</p>
                    <p className="text-muted-foreground">{item.dur} · Start now →</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
          <div className="space-y-4">
            {rows?.map((r) => (
              <Link
                key={r.roadmap_id}
                to="/roadmaps/$slug"
                params={{ slug: r.roadmaps?.slug ?? "" }}
                className="block p-4 rounded-xl border border-white/10 bg-background/50 hover:border-primary/30 hover:bg-accent/10 transition-all shadow-sm"
              >
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-semibold">{r.roadmaps?.title}</span>
                  <span className="font-bold text-primary">{r.completion_percentage}%</span>
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

        <div className="space-y-6">
          {/* Resume Score Analysis Card */}
          <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
            {/* Ambient hover glow */}
            <div className="absolute -inset-px bg-gradient-to-r from-accent/10 to-pink-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Flame className="size-5 text-accent animate-pulse" />
                  <h2 className="text-lg font-bold">Resume Analysis</h2>
                </div>
                <span className={cn(
                  "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border",
                  resumeScore === null 
                    ? "bg-white/5 border-white/10 text-muted-foreground"
                    : resumeScore >= 80 
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                    : resumeScore >= 50
                    ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                    : "bg-red-500/10 border-red-500/20 text-red-400"
                )}>
                  {resumeScore !== null ? `${resumeScore}/100` : "Not Built"}
                </span>
              </div>

              {/* Progress bar */}
              <div className="mb-5">
                <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                  <span>ATS Optimization Score</span>
                  <span className="font-semibold text-foreground">{resumeScore ?? 0}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-accent to-pink-500 transition-all duration-500"
                    style={{ width: `${resumeScore ?? 0}%` }}
                  />
                </div>
              </div>

              {/* Checklist items */}
              <div className="space-y-3 mb-5">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                  Details & Breakdown
                </p>
                <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1 select-none">
                  {resumeChecks.map((item) => (
                    <div key={item.label} className="text-xs">
                      <div className="flex items-start gap-2">
                        {item.checked ? (
                          <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="size-3.5 text-muted-foreground/30 shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <span className={item.checked ? "text-foreground font-medium" : "text-muted-foreground"}>
                              {item.label}
                            </span>
                            <span className={item.checked ? "text-emerald-500 font-semibold" : "text-muted-foreground/50 text-[10px]"}>
                              +{item.score} pts
                            </span>
                          </div>
                          {!item.checked && (
                            <div className="text-[10px] text-muted-foreground/75 mt-0.5 flex items-start gap-1">
                              <Lightbulb className="size-3 text-accent shrink-0 mt-0.5" />
                              <span>{item.tip}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <Button variant="hero" className="w-full gap-2 text-xs py-2 h-9" asChild>
                <Link to="/resume">
                  {resumeScore === null ? "Build Custom Resume" : "Optimize Resume Details"}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Today's challenges */}
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

      <section className="mt-8 space-y-6">
        {/* ── Learn & Practice ── */}
        <GroupSection
          icon="📚"
          title="Learn & Practice"
          subtitle="Build strong fundamentals and improve your coding skills"
          color="from-blue-500/20 to-cyan-500/10"
          borderColor="border-blue-500/20"
          iconBg="bg-blue-500"
          items={[
            { to: "/roadmaps", icon: Map, title: "Roadmaps", desc: "Step-by-step paths" },
            { to: "/learn", icon: BookOpen, title: "Learning Hub", desc: "Notes, videos & more" },
            { to: "/coding", icon: Code2, title: "Coding Practice", desc: "DSA, Problems & Contests" },
            { to: "/projects", icon: FolderGit2, title: "Projects", desc: "Build and showcase" },
          ]}
        />

        {/* ── Preparation ── */}
        <GroupSection
          icon="🎯"
          title="Preparation"
          subtitle="Prepare for placements and ace your interviews"
          color="from-violet-500/20 to-purple-500/10"
          borderColor="border-violet-500/20"
          iconBg="bg-violet-500"
          items={[
            { to: "/placement", icon: Briefcase, title: "Placement Prep", desc: "Aptitude, Reasoning & Mock Tests" },
            { to: "/interview", icon: MessagesSquare, title: "Interview Prep", desc: "Technical, HR & Mock Interviews" },
            { to: "/resume", icon: FileText, title: "Resume Builder", desc: "ATS Friendly Resumes & Score Checker" },
          ]}
        />

        {/* ── Explore Opportunities ── */}
        <GroupSection
          icon="🌟"
          title="Explore Opportunities"
          subtitle="Find the best jobs, internships and track company opportunities"
          color="from-emerald-500/20 to-teal-500/10"
          borderColor="border-emerald-500/20"
          iconBg="bg-emerald-500"
          items={[
            { to: "/jobs", icon: GraduationCap, title: "Jobs & Internships", desc: "Discover latest jobs and internships" },
            { to: "/companies", icon: Building2, title: "Company Tracks", desc: "Track companies and get placement insights" },
          ]}
        />

        {/* ── Grow & Connect ── */}
        <GroupSection
          icon="🤝"
          title="Grow & Connect"
          subtitle="Connect with peers, mentors and grow together"
          color="from-amber-500/20 to-orange-500/10"
          borderColor="border-amber-500/20"
          iconBg="bg-amber-500"
          items={[
            { to: "/community", icon: Users, title: "Community", desc: "Connect, discuss and collaborate" },
            { to: "/mentors", icon: Sparkles, title: "Mentorship", desc: "Learn from mentors and industry experts" },
            { to: "/leaderboard", icon: Trophy, title: "Leaderboard", desc: "Compete and climb the ranks" },
          ]}
        />

        {/* ── Manage (admin only) ── */}
        {user.role === "admin" && (
          <GroupSection
            icon="🛡️"
            title="Manage"
            subtitle="Admin tools and platform management"
            color="from-rose-500/20 to-red-500/10"
            borderColor="border-rose-500/20"
            iconBg="bg-rose-500"
            items={[
              { to: "/admin", icon: ShieldCheck, title: "Admin", desc: "Manage users, content and platform settings" },
            ]}
          />
        )}

        {/* Footer motivation bar */}
        <div className="rounded-2xl border border-border/50 bg-gradient-to-r from-background/80 via-primary/5 to-background/80 px-6 py-4 flex items-center gap-3">
          <TrendingUp className="size-5 text-primary shrink-0" />
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Success is built daily, not overnight.</span>{" "}
            Keep learning, keep building! 🚀
          </p>
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
  to,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  hint: string;
  color: string;
  to?: string;
}) {
  const content = (
    <div className="relative overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div
          className={`size-11 rounded-xl bg-gradient-to-br ${color} grid place-items-center shadow-lg shadow-primary/10`}
        >
          <Icon className="size-5 text-white" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
          Metric
        </span>
      </div>
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="text-2xl lg:text-3xl font-extrabold mt-1 tracking-tight text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1 font-medium">
        <span>{hint}</span>
      </p>
    </div>
  );

  if (to) {
    return (
      <Link
        to={to}
        className="glass-card rounded-2xl p-5 block hover:border-primary/40 hover:-translate-y-1 hover:shadow-elegant transition-all duration-300 cursor-pointer select-none group"
      >
        {content}
      </Link>
    );
  }

  return <div className="glass-card rounded-2xl p-5">{content}</div>;
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

function GroupSection({
  icon,
  title,
  subtitle,
  color,
  borderColor,
  iconBg,
  items,
}: {
  icon: string;
  title: string;
  subtitle: string;
  color: string;
  borderColor: string;
  iconBg: string;
  items: { to: string; icon: React.ComponentType<{ className?: string }>; title: string; desc: string }[];
}) {
  return (
    <div className={cn("rounded-2xl border bg-gradient-to-br p-5 sm:p-6", borderColor, color)}>
      <div className="flex items-start gap-4 mb-5">
        <div className={cn("size-12 rounded-2xl grid place-items-center shrink-0 shadow-lg text-xl", iconBg)}>
          {icon}
        </div>
        <div>
          <h2 className="text-lg font-bold tracking-tight">{title}</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className="group flex flex-col items-center text-center gap-2 p-4 rounded-xl bg-background/60 hover:bg-background/90 border border-white/10 hover:border-primary/30 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
            >
              <div className="size-10 rounded-xl bg-white/10 group-hover:bg-primary/10 grid place-items-center transition-colors border border-white/10 group-hover:border-primary/20">
                <Icon className="size-5 text-foreground/80 group-hover:text-primary transition-colors" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground leading-tight">{item.title}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight line-clamp-2">{item.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
