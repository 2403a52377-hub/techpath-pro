import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Users, Map, Briefcase, MessagesSquare, ShieldAlert, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({ component: AdminPage });

interface Counts { users: number; roadmaps: number; jobs: number; posts: number }
interface JobRow { id: string; role: string; company_name: string; location: string | null; posted_at: string }
interface RoadmapRow { id: string; title: string; slug: string; level: string | null }

function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [counts, setCounts] = useState<Counts | null>(null);
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [roadmaps, setRoadmaps] = useState<RoadmapRow[]>([]);
  const [newJob, setNewJob] = useState({ role: "", company_name: "", location: "", job_type: "Internship", application_link: "" });

  useEffect(() => {
    if (loading || !user) return;
    (async () => {
      const { data, error } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
      if (error || !data) { setIsAdmin(false); return; }
      setIsAdmin(true);
      const [u, r, j, p, jl, rl] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("roadmaps").select("id", { count: "exact", head: true }),
        supabase.from("jobs").select("id", { count: "exact", head: true }),
        supabase.from("community_posts").select("id", { count: "exact", head: true }),
        supabase.from("jobs").select("id,role,company_name,location,posted_at").order("posted_at", { ascending: false }).limit(10),
        supabase.from("roadmaps").select("id,title,slug,level").order("title").limit(24),
      ]);
      setCounts({ users: u.count ?? 0, roadmaps: r.count ?? 0, jobs: j.count ?? 0, posts: p.count ?? 0 });
      setJobs((jl.data as unknown as JobRow[]) ?? []);
      setRoadmaps((rl.data as unknown as RoadmapRow[]) ?? []);
    })();
  }, [user?.id, loading]);

  async function addJob() {
    if (!newJob.role || !newJob.company_name || !newJob.location || !newJob.application_link) {
      toast.error("Role, company, location and apply link are required");
      return;
    }
    const { error } = await supabase.from("jobs").insert({
      role: newJob.role.trim(),
      company_name: newJob.company_name.trim(),
      location: newJob.location.trim(),
      job_type: newJob.job_type,
      application_link: newJob.application_link.trim(),
    } as never);
    if (error) { toast.error(error.message); return; }
    toast.success("Job posted");
    setNewJob({ role: "", company_name: "", location: "", job_type: "Internship", application_link: "" });
    const { data } = await supabase.from("jobs").select("id,role,company_name,location,posted_at").order("posted_at", { ascending: false }).limit(10);
    setJobs((data as unknown as JobRow[]) ?? []);
  }

  async function deleteJob(id: string) {
    const { error } = await supabase.from("jobs").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    setJobs((prev) => prev.filter((j) => j.id !== id));
    toast.success("Job removed");
  }

  if (loading || isAdmin === null) {
    return (
      <AppShell>
        <div className="grid place-items-center py-20"><Loader2 className="size-6 animate-spin text-primary" /></div>
      </AppShell>
    );
  }

  if (!isAdmin) {
    return (
      <AppShell>
        <div className="glass-card rounded-2xl p-10 text-center max-w-md mx-auto">
          <ShieldAlert className="size-12 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Admin access required</h2>
          <p className="mt-2 text-muted-foreground text-sm">
            This area is restricted to TechLand administrators. Ask an admin to grant you the role.
          </p>
          <Button className="mt-6" onClick={() => router.navigate({ to: "/dashboard" })}>Back to dashboard</Button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-accent font-semibold">Admin</p>
        <h1 className="text-3xl lg:text-4xl font-bold mt-1">Content & platform management</h1>
        <p className="text-muted-foreground mt-2">Manage roadmaps, jobs, and monitor the community.</p>
      </div>

      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Stat icon={Users} label="Users" value={counts?.users ?? 0} color="from-primary to-primary-glow" />
        <Stat icon={Map} label="Roadmaps" value={counts?.roadmaps ?? 0} color="from-secondary to-primary" />
        <Stat icon={Briefcase} label="Jobs" value={counts?.jobs ?? 0} color="from-accent to-pink-500" />
        <Stat icon={MessagesSquare} label="Community posts" value={counts?.posts ?? 0} color="from-emerald-500 to-cyan-500" />
      </section>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-4">Post a new job</h2>
          <div className="space-y-3">
            <input className="w-full px-3 py-2 rounded-lg bg-background/60 border border-border" placeholder="Role (e.g. SDE Intern)"
              value={newJob.role} onChange={(e) => setNewJob({ ...newJob, role: e.target.value })} />
            <input className="w-full px-3 py-2 rounded-lg bg-background/60 border border-border" placeholder="Company"
              value={newJob.company_name} onChange={(e) => setNewJob({ ...newJob, company_name: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <input className="px-3 py-2 rounded-lg bg-background/60 border border-border" placeholder="Location"
                value={newJob.location} onChange={(e) => setNewJob({ ...newJob, location: e.target.value })} />
              <select className="px-3 py-2 rounded-lg bg-background/60 border border-border"
                value={newJob.job_type} onChange={(e) => setNewJob({ ...newJob, job_type: e.target.value })}>
                <option>Internship</option><option>Full-time</option><option>Part-time</option><option>Contract</option>
              </select>
            </div>
            <input className="w-full px-3 py-2 rounded-lg bg-background/60 border border-border" placeholder="Apply URL"
              value={newJob.application_link} onChange={(e) => setNewJob({ ...newJob, application_link: e.target.value })} />
            <Button variant="hero" onClick={addJob} className="w-full">Publish job</Button>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-4">Recent jobs</h2>
          <ul className="space-y-2 max-h-96 overflow-y-auto">
            {jobs.length === 0 && <p className="text-sm text-muted-foreground">No jobs yet.</p>}
            {jobs.map((j) => (
              <li key={j.id} className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{j.role}</p>
                  <p className="text-xs text-muted-foreground truncate">{j.company_name} · {j.location}</p>
                </div>
                <button onClick={() => deleteJob(j.id)} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 mt-6">
        <h2 className="text-lg font-bold mb-4">Roadmaps</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {roadmaps.map((r) => (
            <Link key={r.id} to="/roadmaps/$slug" params={{ slug: r.slug }} className="p-3 rounded-lg bg-background/50 hover:bg-accent/10 transition-colors">
              <p className="text-sm font-semibold truncate">{r.title}</p>
              <p className="text-xs text-muted-foreground">{r.level ?? "—"}</p>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

function Stat({ icon: Icon, label, value, color }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number; color: string }) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className={`size-10 rounded-xl bg-gradient-to-br ${color} grid place-items-center mb-3 shadow-md`}>
        <Icon className="size-5 text-white" />
      </div>
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}
