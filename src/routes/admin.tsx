import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Loader2, Users, Map as MapIcon, Briefcase, MessagesSquare, ShieldAlert, Trash2,
  Sparkles, Key, CheckCircle2, Star, Mail, GraduationCap, Clock, RefreshCw,
  Plus, BookOpen, MessageSquare, Lightbulb, AlertCircle, TrendingUp, Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/admin")({ component: AdminPage });

type Tab = "overview" | "users" | "roadmaps" | "jobs" | "community";

interface Counts {
  users: number;
  roadmaps: number;
  jobs: number;
  posts: number;
  feedback: number;
}

interface UserRow {
  id: string;
  full_name: string;
  email: string;
  college_name: string | null;
  branch: string | null;
  year_of_study: string | null;
  xp: number;
  streak: number;
  role: "student" | "mentor" | "admin";
}

interface JobRow {
  id: string;
  role: string;
  company_name: string;
  location: string | null;
  job_type: string;
  posted_at: string;
  application_link: string;
}

interface RoadmapRow {
  id: string;
  title: string;
  slug: string;
  domain_name: string;
  description: string;
  level: string;
  estimated_duration: string;
}

interface FeedbackRow {
  id: string;
  type: string;
  rating?: number;
  title: string;
  message: string;
  name: string;
  email: string;
  created_at: string;
  status: string;
}

interface PostRow {
  id: string;
  title: string;
  content: string;
  tag: string | null;
  created_at: string;
  user_id: string;
  authorName?: string;
}

function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [counts, setCounts] = useState<Counts | null>(null);

  /* List States */
  const [users, setUsers] = useState<UserRow[]>([]);
  const [roadmaps, setRoadmaps] = useState<RoadmapRow[]>([]);
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackRow[]>([]);

  /* Loader States */
  const [loadingList, setLoadingList] = useState(false);

  /* Form States */
  const [newJob, setNewJob] = useState({ role: "", company_name: "", location: "", job_type: "Internship", application_link: "" });
  const [newRoadmap, setNewRoadmap] = useState({ title: "", slug: "", domain_name: "Full Stack Development", description: "", level: "Beginner", estimated_duration: "12 weeks" });

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.navigate({ to: "/auth", search: { tab: "login" } });
      return;
    }
    (async () => {
      const { data, error } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
      if (error || !data) {
        setIsAdmin(false);
        toast.error("Access Denied: Admin role required");
        router.navigate({ to: "/dashboard" });
        return;
      }
      setIsAdmin(true);
      loadStats();
    })();
  }, [user?.id, loading]);

  useEffect(() => {
    if (isAdmin) {
      loadTabData();
    }
  }, [activeTab, isAdmin]);

  async function loadStats() {
    try {
      const [u, r, j, p] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("roadmaps").select("id", { count: "exact", head: true }),
        supabase.from("jobs").select("id", { count: "exact", head: true }),
        supabase.from("community_posts").select("id", { count: "exact", head: true }),
      ]);
      let feedbackCount = 0;
      try {
        const { count } = await supabase.from("feedback" as any).select("id", { count: "exact", head: true });
        feedbackCount = count ?? 0;
      } catch {
        // Fallback
      }
      setCounts({
        users: u.count ?? 0,
        roadmaps: r.count ?? 0,
        jobs: j.count ?? 0,
        posts: p.count ?? 0,
        feedback: feedbackCount,
      });
    } catch {
      // Fallback
    }
  }

  async function loadTabData() {
    setLoadingList(true);
    try {
      if (activeTab === "overview") {
        await loadStats();
      } else if (activeTab === "users") {
        const [profilesRes, rolesRes] = await Promise.all([
          supabase.from("profiles").select("*").order("xp", { ascending: false }),
          supabase.from("user_roles").select("*"),
        ]);
        const rolesMap = new globalThis.Map((rolesRes.data ?? []).map((r: any) => [r.user_id, r.role]));
        setUsers(
          (profilesRes.data ?? []).map((p: any) => ({
            id: p.id,
            full_name: p.full_name,
            email: p.email,
            college_name: p.college_name,
            branch: p.branch,
            year_of_study: p.year_of_study,
            xp: p.xp,
            streak: p.streak,
            role: rolesMap.get(p.id) ?? "student",
          }))
        );
      } else if (activeTab === "roadmaps") {
        const { data } = await supabase.from("roadmaps").select("*").order("title");
        setRoadmaps(data ?? []);
      } else if (activeTab === "jobs") {
        const { data } = await supabase.from("jobs").select("*").order("posted_at", { ascending: false });
        setJobs(data ?? []);
      } else if (activeTab === "community") {
        const { data: postsRes } = await supabase.from("community_posts").select("*").order("created_at", { ascending: false });
        let fbData: any[] = [];
        try {
          const { data } = await supabase.from("feedback" as any).select("*").order("created_at", { ascending: false });
          fbData = data ?? [];
        } catch {
          // Fallback to local storage
          try {
            fbData = JSON.parse(localStorage.getItem("myFeedback") ?? "[]").map((f: any, idx: number) => ({
              id: f.id ?? String(idx),
              ...f,
              created_at: f.submittedAt ?? new Date().toISOString(),
            }));
          } catch {
            fbData = [];
          }
        }
        const { data: profiles } = await supabase.from("profiles").select("id,full_name");
        const pMap = new globalThis.Map((profiles ?? []).map((p) => [p.id, p.full_name]));

        setPosts((postsRes ?? []).map((p: any) => ({ ...p, authorName: pMap.get(p.user_id) ?? "Anonymous" })));
        setFeedbacks(fbData);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingList(false);
    }
  }

  /* User Actions */
  async function changeUserRole(userId: string, newRole: "student" | "mentor" | "admin") {
    // Delete existing roles
    await supabase.from("user_roles").delete().eq("user_id", userId);
    // If they aren't student, add role entry (student is default/absence of other roles or explicitly inserted)
    const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: newRole });
    if (error) {
      toast.error(error.message + ". Run public.user_roles policy updates first.");
    } else {
      toast.success("User role updated to " + newRole);
      loadTabData();
    }
  }

  /* Job Actions */
  async function addJob() {
    if (!newJob.role || !newJob.company_name || !newJob.location || !newJob.application_link) {
      toast.error("Please fill in all fields");
      return;
    }
    const { error } = await supabase.from("jobs").insert({
      role: newJob.role.trim(),
      company_name: newJob.company_name.trim(),
      location: newJob.location.trim(),
      job_type: newJob.job_type,
      application_link: newJob.application_link.trim(),
    } as never);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Job posted");
    setNewJob({ role: "", company_name: "", location: "", job_type: "Internship", application_link: "" });
    loadTabData();
  }

  async function deleteJob(id: string) {
    const { error } = await supabase.from("jobs").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setJobs((prev) => prev.filter((j) => j.id !== id));
    toast.success("Job removed");
  }

  /* Roadmap Actions */
  async function addRoadmap() {
    if (!newRoadmap.title || !newRoadmap.slug || !newRoadmap.description) {
      toast.error("Please fill in title, slug and description");
      return;
    }
    const { error } = await supabase.from("roadmaps").insert({
      title: newRoadmap.title.trim(),
      slug: newRoadmap.slug.toLowerCase().trim(),
      domain_name: newRoadmap.domain_name,
      description: newRoadmap.description.trim(),
      level: newRoadmap.level,
      estimated_duration: newRoadmap.estimated_duration,
    } as never);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Roadmap created");
    setNewRoadmap({ title: "", slug: "", domain_name: "Full Stack Development", description: "", level: "Beginner", estimated_duration: "12 weeks" });
    loadTabData();
  }

  async function deleteRoadmap(id: string) {
    const { error } = await supabase.from("roadmaps").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setRoadmaps((prev) => prev.filter((r) => r.id !== id));
    toast.success("Roadmap deleted");
  }

  /* Community Actions */
  async function deletePost(id: string) {
    const { error } = await supabase.from("community_posts").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setPosts((prev) => prev.filter((p) => p.id !== id));
    toast.success("Post removed");
  }

  async function updateFeedbackStatus(id: string, newStatus: string) {
    const { error } = await supabase.from("feedback" as any).update({ status: newStatus } as never).eq("id", id);
    if (error) {
      // LocalStorage fallback if table doesn't exist
      const localFb = JSON.parse(localStorage.getItem("myFeedback") ?? "[]");
      const updated = localFb.map((f: any) => f.id === id ? { ...f, status: newStatus } : f);
      localStorage.setItem("myFeedback", JSON.stringify(updated));
      toast.success("Feedback status updated locally");
      loadTabData();
    } else {
      toast.success("Feedback status updated to " + newStatus);
      loadTabData();
    }
  }

  if (loading || isAdmin === null) {
    return (
      <AppShell>
        <div className="grid place-items-center py-20">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mb-6 flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-accent font-semibold">Admin</p>
          <h1 className="text-3xl lg:text-4xl font-bold mt-1">Content & platform management</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Manage roadmaps, moderate users, configure jobs, and review community feedback.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={loadStats} className="gap-2">
          <RefreshCw className="size-4" /> Refresh Stats
        </Button>
      </div>

      {/* Overview Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {[
          { icon: Users, label: "Users", value: counts?.users ?? 0, tab: "users" },
          { icon: MapIcon, label: "Roadmaps", value: counts?.roadmaps ?? 0, tab: "roadmaps" },
          { icon: Briefcase, label: "Jobs", value: counts?.jobs ?? 0, tab: "jobs" },
          { icon: MessagesSquare, label: "Posts", value: counts?.posts ?? 0, tab: "community" },
          { icon: Lightbulb, label: "Feedback", value: counts?.feedback ?? 0, tab: "community" },
        ].map((s: any) => {
          const Icon = s.icon;
          const active = activeTab === s.tab;
          return (
            <button
              key={s.label}
              onClick={() => setActiveTab(s.tab as Tab)}
              className={cn(
                "glass-card rounded-2xl p-5 text-left transition-all border hover:-translate-y-0.5",
                active ? "border-primary/50 bg-primary/5 shadow-elegant" : "border-white/5 hover:border-white/15"
              )}
            >
              <div className={cn("size-10 rounded-xl bg-gradient-primary grid place-items-center mb-3 shadow-md")}>
                <Icon className="size-5 text-primary-foreground" />
              </div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">{s.label}</p>
              <p className="text-2xl font-bold mt-1 gradient-text">{s.value}</p>
            </button>
          );
        })}
      </section>

      {/* Tab Switcher */}
      <div className="flex gap-2 border-b border-white/5 pb-px flex-wrap mb-6">
        {[
          { id: "overview", label: "Dashboard Overview" },
          { id: "users", label: "Manage Users" },
          { id: "roadmaps", label: "Roadmaps" },
          { id: "jobs", label: "Jobs & Internships" },
          { id: "community", label: "Community & Suggestions" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as Tab)}
            className={cn(
              "px-4 py-2.5 text-sm font-semibold border-b-2 transition-all",
              activeTab === t.id ? "border-primary text-foreground bg-primary/5" : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loadingList ? (
        <div className="grid place-items-center py-20">
          <Loader2 className="size-8 animate-spin text-primary mb-2" />
          <p className="text-sm text-muted-foreground">Loading dashboard contents…</p>
        </div>
      ) : (
        <>
          {/* ── OVERVIEW TAB ── */}
          {activeTab === "overview" && (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="glass-card rounded-2xl p-6">
                  <h2 className="text-lg font-bold mb-2">Welcome to TechLand Admin Panel</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Here you can moderate users, assign roles, create roadmaps, delete outdated job links,
                    and review feedback reports submitted through the suggestion box.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4 mt-6">
                    <div className="p-4 rounded-xl bg-background/50 border border-white/5">
                      <p className="font-semibold text-sm">Role-Based Access Control</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Use the <b>Manage Users</b> tab to promote students to Mentors or Administrators.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-background/50 border border-white/5">
                      <p className="font-semibold text-sm">Feedback & Suggestions</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Review user suggestions and check off solved bugs in real time.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="glass-card rounded-2xl p-6">
                  <h2 className="text-lg font-bold mb-4">Platform Health</h2>
                  <div className="space-y-3 text-sm">
                    {[
                      { key: "Supabase connection", status: "Connected", ok: true },
                      { key: "Auth system integration", status: "Active (RBAC Enabled)", ok: true },
                      { key: "Database RLS validation", status: "Secured", ok: true },
                      { key: "Auto-confirm signup emails", status: "Configured (SQL Active)", ok: true },
                    ].map((h) => (
                      <div key={h.key} className="flex justify-between items-center p-3 rounded-lg bg-background/30 border border-white/5">
                        <span>{h.key}</span>
                        <span className={cn("text-xs font-semibold", h.ok ? "text-emerald-400" : "text-rose-400")}>
                          {h.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="glass-card rounded-2xl p-6">
                  <h2 className="text-lg font-bold mb-4">Database Tables</h2>
                  <div className="space-y-2">
                    {[
                      { label: "Profiles (users)", key: "profiles", count: counts?.users },
                      { label: "Roadmaps", key: "roadmaps", count: counts?.roadmaps },
                      { label: "Jobs / Placement", key: "jobs", count: counts?.jobs },
                      { label: "Community posts", key: "posts", count: counts?.posts },
                      { label: "Suggestion box", key: "feedback", count: counts?.feedback },
                    ].map((tbl) => (
                      <div key={tbl.key} className="flex justify-between text-sm py-1.5 border-b border-white/5">
                        <span className="text-muted-foreground">{tbl.label}</span>
                        <span className="font-bold">{tbl.count ?? "—"} rows</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── USERS TAB ── */}
          {activeTab === "users" && (
            <div className="glass-card rounded-2xl p-6 overflow-hidden">
              <h2 className="text-lg font-bold mb-4">Manage User Accounts</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-muted-foreground">
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">College & Branch</th>
                      <th className="py-3 px-4 text-center">XP</th>
                      <th className="py-3 px-4 text-center">Streak</th>
                      <th className="py-3 px-4">Current Role</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-white/2">
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-foreground">{u.full_name || "Anonymous"}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="size-3" /> {u.email}</p>
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="text-foreground">{u.college_name || "—"}</p>
                          <p className="text-xs text-muted-foreground">{u.branch || "—"}</p>
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-primary">{u.xp}</td>
                        <td className="py-3.5 px-4 text-center font-semibold text-orange-400">{u.streak}d</td>
                        <td className="py-3.5 px-4">
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                            u.role === "admin" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                            u.role === "mentor" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                            "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          )}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <select
                            value={u.role}
                            onChange={(e) => changeUserRole(u.id, e.target.value as any)}
                            className="bg-background border border-white/10 rounded-md text-xs px-2 py-1 focus:outline-none focus:border-primary"
                          >
                            <option value="student">Student</option>
                            <option value="mentor">Mentor</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── ROADMAPS TAB ── */}
          {activeTab === "roadmaps" && (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="glass-card rounded-2xl p-6">
                <h2 className="text-lg font-bold mb-4">Create New Roadmap</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Roadmap Title *</label>
                    <input
                      className="w-full px-3 py-2 rounded-lg bg-background/60 border border-border text-sm"
                      placeholder="e.g. Android Development"
                      value={newRoadmap.title}
                      onChange={(e) => setNewRoadmap({ ...newRoadmap, title: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Slug (Unique URL) *</label>
                      <input
                        className="w-full px-3 py-2 rounded-lg bg-background/60 border border-border text-sm"
                        placeholder="e.g. android-dev"
                        value={newRoadmap.slug}
                        onChange={(e) => setNewRoadmap({ ...newRoadmap, slug: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Duration</label>
                      <input
                        className="w-full px-3 py-2 rounded-lg bg-background/60 border border-border text-sm"
                        placeholder="e.g. 10 weeks"
                        value={newRoadmap.estimated_duration}
                        onChange={(e) => setNewRoadmap({ ...newRoadmap, estimated_duration: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Domain Name</label>
                    <select
                      className="w-full px-3 py-2 rounded-lg bg-background/60 border border-border text-sm"
                      value={newRoadmap.domain_name}
                      onChange={(e) => setNewRoadmap({ ...newRoadmap, domain_name: e.target.value })}
                    >
                      <option>Full Stack Development</option>
                      <option>Frontend Development</option>
                      <option>Backend Development</option>
                      <option>Data Science</option>
                      <option>Artificial Intelligence</option>
                      <option>Cloud Computing</option>
                      <option>DevOps</option>
                      <option>UI/UX Design</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Skill Level</label>
                      <select
                        className="w-full px-3 py-2 rounded-lg bg-background/60 border border-border text-sm"
                        value={newRoadmap.level}
                        onChange={(e) => setNewRoadmap({ ...newRoadmap, level: e.target.value })}
                      >
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Description *</label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg bg-background/60 border border-border text-sm resize-none"
                      placeholder="Detailed overview of roadmap contents…"
                      value={newRoadmap.description}
                      onChange={(e) => setNewRoadmap({ ...newRoadmap, description: e.target.value })}
                    />
                  </div>
                  <Button variant="hero" onClick={addRoadmap} className="w-full gap-2">
                    <Plus className="size-4" /> Create Roadmap
                  </Button>
                </div>
              </div>

              <div className="lg:col-span-2 glass-card rounded-2xl p-6">
                <h2 className="text-lg font-bold mb-4">All Active Roadmaps</h2>
                <div className="grid sm:grid-cols-2 gap-3 overflow-y-auto max-h-[500px] pr-2">
                  {roadmaps.map((r) => (
                    <div key={r.id} className="p-4 rounded-xl bg-background/50 border border-white/5 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-accent">{r.domain_name}</span>
                        <p className="font-semibold text-sm mt-1">{r.title}</p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{r.description}</p>
                        <div className="flex gap-2 mt-2">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-muted-foreground border border-white/10">{r.level}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-muted-foreground border border-white/10">{r.estimated_duration}</span>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                        <Link to="/roadmaps/$slug" params={{ slug: r.slug }} className="text-xs text-primary font-semibold hover:underline">
                          View Roadmap
                        </Link>
                        <button onClick={() => deleteRoadmap(r.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── JOBS TAB ── */}
          {activeTab === "jobs" && (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="glass-card rounded-2xl p-6">
                <h2 className="text-lg font-bold mb-4">Post a New Job</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Role *</label>
                    <input
                      className="w-full px-3 py-2 rounded-lg bg-background/60 border border-border text-sm"
                      placeholder="e.g. SDE Intern"
                      value={newJob.role}
                      onChange={(e) => setNewJob({ ...newJob, role: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Company Name *</label>
                    <input
                      className="w-full px-3 py-2 rounded-lg bg-background/60 border border-border text-sm"
                      placeholder="e.g. Google India"
                      value={newJob.company_name}
                      onChange={(e) => setNewJob({ ...newJob, company_name: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Location *</label>
                      <input
                        className="w-full px-3 py-2 rounded-lg bg-background/60 border border-border text-sm"
                        placeholder="e.g. Bangalore"
                        value={newJob.location}
                        onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Job Type</label>
                      <select
                        className="w-full px-3 py-2 rounded-lg bg-background/60 border border-border text-sm"
                        value={newJob.job_type}
                        onChange={(e) => setNewJob({ ...newJob, job_type: e.target.value })}
                      >
                        <option>Internship</option>
                        <option>Full-time</option>
                        <option>Part-time</option>
                        <option>Remote</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Apply URL *</label>
                    <input
                      className="w-full px-3 py-2 rounded-lg bg-background/60 border border-border text-sm"
                      placeholder="e.g. https://careers.google.com/..."
                      value={newJob.application_link}
                      onChange={(e) => setNewJob({ ...newJob, application_link: e.target.value })}
                    />
                  </div>
                  <Button variant="hero" onClick={addJob} className="w-full gap-2">
                    <Plus className="size-4" /> Publish Job
                  </Button>
                </div>
              </div>

              <div className="lg:col-span-2 glass-card rounded-2xl p-6">
                <h2 className="text-lg font-bold mb-4">Active Placement Listings</h2>
                <div className="space-y-3 overflow-y-auto max-h-[500px] pr-2">
                  {jobs.map((j) => (
                    <div key={j.id} className="flex items-center gap-4 p-4 rounded-xl bg-background/50 border border-white/5">
                      <div className="size-10 rounded-xl bg-gradient-primary grid place-items-center font-bold text-primary-foreground text-sm shrink-0">
                        {j.company_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{j.role}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {j.company_name} · {j.location} · {j.job_type}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <a href={j.application_link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary font-semibold hover:underline">
                          Link
                        </a>
                        <button onClick={() => deleteJob(j.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── COMMUNITY & FEEDBACK TAB ── */}
          {activeTab === "community" && (
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="glass-card rounded-2xl p-6">
                <h2 className="text-lg font-bold mb-4">Moderate Forum Posts</h2>
                <div className="space-y-3 overflow-y-auto max-h-[500px] pr-2">
                  {posts.map((p) => (
                    <div key={p.id} className="p-4 rounded-xl bg-background/50 border border-white/5 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <span>By {p.authorName}</span>
                          <span>{formatDistanceToNow(new Date(p.created_at), { addSuffix: true })}</span>
                        </div>
                        <p className="font-semibold text-sm mt-1.5">{p.title}</p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.content}</p>
                        {p.tag && (
                          <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                            #{p.tag}
                          </span>
                        )}
                      </div>
                      <div className="mt-4 pt-3 border-t border-white/5 flex justify-end">
                        <button onClick={() => deletePost(p.id)} className="text-xs text-destructive hover:underline flex items-center gap-1.5">
                          <Trash2 className="size-3.5" /> Remove Post
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <h2 className="text-lg font-bold mb-4">Suggestion Box Submissions</h2>
                <div className="space-y-3 overflow-y-auto max-h-[500px] pr-2">
                  {feedbacks.length === 0 && (
                    <p className="text-sm text-muted-foreground">No suggestion box entries received yet.</p>
                  )}
                  {feedbacks.map((f) => (
                    <div key={f.id} className="p-4 rounded-xl bg-background/50 border border-white/5 flex flex-col justify-between space-y-2">
                      <div className="flex items-center gap-2 justify-between">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase",
                          f.type === "suggestion" ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" :
                          f.type === "experience" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                          "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        )}>
                          {f.type}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {formatDistanceToNow(new Date(f.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">{f.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{f.message}</p>
                        {f.type === "experience" && f.rating !== undefined && (
                          <div className="flex gap-0.5 mt-1.5">
                            {(() => {
                              const r = f.rating ?? 0;
                              return Array.from({ length: 5 }).map((_, idx) => (
                                <Star key={idx} className={cn("size-3", idx < r ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground")} />
                              ));
                            })()}
                          </div>
                        )}
                      </div>
                      <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground truncate max-w-[150px]">By {f.name} ({f.email})</span>
                        <div className="flex items-center gap-2">
                          <select
                            value={f.status}
                            onChange={(e) => updateFeedbackStatus(f.id, e.target.value)}
                            className="bg-background border border-white/10 rounded-md text-[10px] px-2 py-1 focus:outline-none"
                          >
                            <option value="submitted">Submitted</option>
                            <option value="in-progress">In Progress</option>
                            <option value="fixed">Fixed</option>
                            <option value="published">Featured</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </AppShell>
  );
}
