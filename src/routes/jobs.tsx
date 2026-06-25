import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "./roadmaps.index";
import { Bookmark, MapPin, Briefcase, ExternalLink, Loader2, BookmarkCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/jobs")({ component: JobsPage });

type Job = {
  id: string;
  company_name: string;
  role: string;
  location: string;
  job_type: string;
  experience: string | null;
  description: string | null;
  application_link: string;
};

function JobsPage() {
  const { user } = useAuth();
  const [q, setQ] = useState("");
  const [jobs, setJobs] = useState<Job[] | null>(null);
  const [saved, setSaved] = useState<Set<string>>(new Set());

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("jobs").select("*").order("posted_at", { ascending: false });
      setJobs(data ?? []);
    })();
  }, []);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from("saved_jobs").select("job_id").eq("user_id", user.id);
      setSaved(new Set((data ?? []).map((r) => r.job_id)));
    })();
  }, [user?.id]);

  async function toggleSave(jobId: string) {
    if (!user) return toast.error("Sign in to save jobs");
    if (saved.has(jobId)) {
      await supabase.from("saved_jobs").delete().eq("user_id", user.id).eq("job_id", jobId);
      setSaved((s) => { const n = new Set(s); n.delete(jobId); return n; });
      toast.success("Removed from saved");
    } else {
      await supabase.from("saved_jobs").insert({ user_id: user.id, job_id: jobId });
      setSaved((s) => new Set(s).add(jobId));
      toast.success("Saved");
    }
  }

  const filtered = (jobs ?? []).filter((j) =>
    (j.role + j.company_name + j.location).toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <AppShell>
      <PageHeader title="Jobs & Internships" subtitle="Internships, fresher roles and off-campus drives — all in one feed." />

      <div className="mt-6 flex gap-3">
        <Input placeholder="Search role, company, location…" value={q} onChange={(e) => setQ(e.target.value)} className="flex-1" />
      </div>

      {!jobs && <div className="grid place-items-center py-16"><Loader2 className="size-6 animate-spin text-primary" /></div>}

      <div className="mt-6 grid sm:grid-cols-2 gap-5">
        {filtered.map((j) => {
          const isSaved = saved.has(j.id);
          return (
            <div key={j.id} className="glass-card rounded-2xl p-5 hover:shadow-elegant transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-lg">{j.role}</h3>
                  <p className="text-sm text-muted-foreground">{j.company_name}</p>
                </div>
                <button onClick={() => toggleSave(j.id)} className={isSaved ? "text-accent" : "text-muted-foreground hover:text-accent"}>
                  {isSaved ? <BookmarkCheck className="size-5" /> : <Bookmark className="size-5" />}
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="size-3.5" />{j.location}</span>
                <span className="flex items-center gap-1"><Briefcase className="size-3.5" />{j.job_type}</span>
                {j.experience && <span>{j.experience}</span>}
              </div>
              {j.description && <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{j.description}</p>}
              <Button variant="hero" className="w-full mt-4" asChild>
                <a href={j.application_link} target="_blank" rel="noopener noreferrer">
                  Apply now <ExternalLink className="size-4" />
                </a>
              </Button>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
