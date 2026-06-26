import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "./roadmaps.index";
import { Bookmark, MapPin, Briefcase, ExternalLink, Loader2, BookmarkCheck, Search, Filter, Globe2, Building2, Banknote, Calendar } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/jobs")({ component: JobsPage });

type Job = {
  id: string;
  external_id?: string;
  title: string;
  company: string;
  company_logo?: string;
  location?: string;
  country?: string;
  employment_type: string;
  experience_level?: string;
  salary?: string;
  skills: string[];
  description?: string;
  apply_url: string;
  source: string;
  is_remote: boolean;
  category?: string;
  posted_at: string;
};

function JobsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [category, setCategory] = useState<string | null>(null);

  // Debounce search
  useState(() => {
    const handler = setTimeout(() => setDebouncedQ(q), 500);
    return () => clearTimeout(handler);
  });

  // Fetch Jobs
  const { data: jobs, isLoading } = useQuery({
    queryKey: ["jobs", debouncedQ, remoteOnly, category],
    queryFn: async () => {
      let query = supabase.from("jobs").select("*").order("posted_at", { ascending: false }).limit(50);
      
      if (debouncedQ) {
        query = query.textSearch("fts", debouncedQ, { type: "websearch", config: "english" });
      }
      if (remoteOnly) {
        query = query.eq("is_remote", true);
      }
      if (category) {
        query = query.eq("category", category);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Job[];
    },
  });

  // Fetch Saved Jobs IDs
  const { data: savedJobs = new Set() } = useQuery({
    queryKey: ["saved_jobs", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("saved_jobs").select("job_id").eq("user_id", user!.id);
      return new Set((data ?? []).map((r) => r.job_id));
    },
  });

  // Toggle Save Mutation
  const toggleSave = useMutation({
    mutationFn: async (jobId: string) => {
      if (!user) throw new Error("Sign in to save jobs");
      if (savedJobs.has(jobId)) {
        await supabase.from("saved_jobs").delete().eq("user_id", user.id).eq("job_id", jobId);
        return { jobId, saved: false };
      } else {
        await supabase.from("saved_jobs").insert({ user_id: user.id, job_id: jobId });
        return { jobId, saved: true };
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["saved_jobs", user?.id], (old: Set<string>) => {
        const next = new Set(old);
        if (data.saved) next.add(data.jobId);
        else next.delete(data.jobId);
        return next;
      });
      toast.success(data.saved ? "Job saved!" : "Removed from saved.");
    },
    onError: (err: any) => toast.error(err.message),
  });

  const categories = ["Frontend", "Backend", "Full Stack", "Data Science & AI", "Cloud & DevOps", "Mobile", "Design", "Engineering"];

  return (
    <AppShell>
      <PageHeader title="Jobs & Internships" subtitle="Real-time fresher roles, internships, and off-campus drives." />

      <Tabs defaultValue="find" className="mt-8">
        <TabsList className="mb-6 bg-glass border border-white/10">
          <TabsTrigger value="find">Find Jobs</TabsTrigger>
          <TabsTrigger value="dashboard" disabled={!user}>My Dashboard</TabsTrigger>
        </TabsList>

        <TabsContent value="find" className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-64 glass-card rounded-2xl p-5 shrink-0 sticky top-24">
            <h3 className="font-bold flex items-center gap-2 mb-4"><Filter className="size-4" /> Filters</h3>
            
            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium mb-2 block">Work Mode</label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={remoteOnly} onChange={(e) => setRemoteOnly(e.target.checked)} className="rounded border-white/20 bg-background/50 accent-primary" />
                  Remote Only
                </label>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <div className="space-y-2">
                  <button 
                    onClick={() => setCategory(null)} 
                    className={`block text-left text-sm w-full py-1 ${!category ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    All Categories
                  </button>
                  {categories.map(c => (
                    <button 
                      key={c}
                      onClick={() => setCategory(c)} 
                      className={`block text-left text-sm w-full py-1 ${category === c ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Job Listings */}
          <div className="flex-1 w-full space-y-5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input 
                placeholder="Search jobs, skills, companies…" 
                value={q} 
                onChange={(e) => setQ(e.target.value)} 
                className="pl-10 bg-glass border-white/10 h-12 rounded-xl" 
              />
            </div>

            {isLoading ? (
              <div className="grid place-items-center py-16"><Loader2 className="size-6 animate-spin text-primary" /></div>
            ) : jobs?.length === 0 ? (
              <div className="text-center py-16 glass-card rounded-2xl">
                <p className="text-muted-foreground">No jobs found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {jobs?.map((j) => (
                  <JobCard 
                    key={j.id} 
                    job={j} 
                    isSaved={savedJobs.has(j.id)} 
                    onSave={() => toggleSave.mutate(j.id)} 
                  />
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="dashboard">
          <DashboardTab user={user} savedJobsSet={savedJobs} />
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}

function JobCard({ job, isSaved, onSave }: { job: Job; isSaved: boolean; onSave: () => void }) {
  return (
    <div className="glass-card rounded-2xl p-5 hover:border-primary/30 transition-all flex flex-col">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3 items-start">
          {job.company_logo ? (
            <img src={job.company_logo} alt={job.company} className="size-10 rounded-lg object-contain bg-white/5" />
          ) : (
            <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold uppercase">
              {job.company.charAt(0)}
            </div>
          )}
          <div>
            <h3 className="font-bold leading-tight">{job.title}</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <Building2 className="size-3" /> {job.company}
            </p>
          </div>
        </div>
        <button onClick={onSave} className={isSaved ? "text-primary" : "text-muted-foreground hover:text-primary transition-colors shrink-0"}>
          {isSaved ? <BookmarkCheck className="size-5 fill-primary/20" /> : <Bookmark className="size-5" />}
        </button>
      </div>
      
      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        {job.location && (
          <Badge variant="secondary" className="bg-white/5 font-normal text-muted-foreground">
            <MapPin className="size-3 mr-1" /> {job.location}
          </Badge>
        )}
        {job.is_remote && (
          <Badge variant="secondary" className="bg-green-500/10 text-green-400 font-normal border-green-500/20">
            <Globe2 className="size-3 mr-1" /> Remote
          </Badge>
        )}
        {job.salary && (
          <Badge variant="secondary" className="bg-white/5 font-normal text-muted-foreground">
            <Banknote className="size-3 mr-1" /> {job.salary}
          </Badge>
        )}
        <Badge variant="secondary" className="bg-white/5 font-normal text-muted-foreground">
          <Briefcase className="size-3 mr-1" /> {job.employment_type}
        </Badge>
      </div>

      {job.skills && job.skills.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {job.skills.slice(0, 4).map((s, i) => (
            <span key={i} className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-white/10 text-muted-foreground">
              {s}
            </span>
          ))}
          {job.skills.length > 4 && <span className="text-[10px] text-muted-foreground">+{job.skills.length - 4}</span>}
        </div>
      )}

      <div className="mt-auto pt-5 flex items-center justify-between">
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <Calendar className="size-3" /> {formatDistanceToNow(new Date(job.posted_at), { addSuffix: true })}
        </span>
        <Button variant="hero" size="sm" className="h-8 text-xs" asChild>
          <a href={job.apply_url} target="_blank" rel="noopener noreferrer">
            Apply <ExternalLink className="size-3 ml-1" />
          </a>
        </Button>
      </div>
    </div>
  );
}

function DashboardTab({ user, savedJobsSet }: { user: any, savedJobsSet: Set<string> }) {
  const { data: savedJobsList, isLoading } = useQuery({
    queryKey: ["saved_jobs_details", Array.from(savedJobsSet)],
    enabled: savedJobsSet.size > 0,
    queryFn: async () => {
      const { data, error } = await supabase.from("jobs").select("*").in("id", Array.from(savedJobsSet));
      if (error) throw error;
      return data as Job[];
    }
  });

  if (isLoading) return <div className="py-16 text-center"><Loader2 className="size-6 animate-spin mx-auto text-primary" /></div>;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl text-center">
          <h4 className="text-muted-foreground text-sm">Saved Jobs</h4>
          <p className="text-3xl font-bold mt-2">{savedJobsSet.size}</p>
        </div>
        <div className="glass-card p-5 rounded-2xl text-center">
          <h4 className="text-muted-foreground text-sm">Applications</h4>
          <p className="text-3xl font-bold mt-2">0</p>
          <p className="text-xs text-muted-foreground mt-1">Tracked via external links</p>
        </div>
      </div>

      <div>
        <h3 className="font-bold text-xl mb-4">Your Saved Jobs</h3>
        {savedJobsSet.size === 0 ? (
          <div className="glass-card p-8 rounded-2xl text-center">
            <Bookmark className="size-8 mx-auto text-muted-foreground mb-3 opacity-50" />
            <p className="text-muted-foreground">You haven't saved any jobs yet.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedJobsList?.map(j => (
              <JobCard key={j.id} job={j} isSaved={true} onSave={() => {}} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
