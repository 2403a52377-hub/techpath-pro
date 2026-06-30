import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "./roadmaps.index";
import {
  Bookmark, BookmarkCheck, Search, Globe2, Building2,
  Calendar, RefreshCw, ExternalLink, X, MapPin, Tag,
  Briefcase, Loader2, ChevronRight, Wifi, WifiOff,
  Filter, Zap,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/jobs")({ component: JobsPage });

/* ──────────────────────── TYPES ──── */
type LiveJob = {
  id: string;
  title: string;
  company: string;
  location: string;
  remote: boolean;
  tags: string[];
  jobTypes: string[];
  description: string;
  applyUrl: string;
  source: string;
  postedAt: number;
};

/* ──────────────────────── DOMAIN MAP ──── */
const DOMAINS: Record<string, string[]> = {
  "All":               [],
  "Frontend":          ["react","vue","angular","svelte","html","css","javascript","typescript","nextjs","frontend","ui"],
  "Backend":           ["node","nodejs","python","java","golang","go","php","ruby","backend","django","spring","fastapi","laravel"],
  "Full Stack":        ["fullstack","full-stack","mern","mean","react","node","postgresql","mongodb"],
  "Data Science & AI": ["python","ml","machine-learning","data-science","ai","tensorflow","pytorch","data","analytics","nlp","llm"],
  "Cloud & DevOps":    ["aws","azure","gcp","docker","kubernetes","devops","terraform","cloud","ci-cd","linux"],
  "Mobile":            ["android","ios","flutter","react-native","swift","kotlin","mobile"],
  "Design":            ["figma","ui-ux","design","ux","product-design","css"],
};

const DOMAIN_COLORS: Record<string, string> = {
  "All":               "bg-primary/10 text-primary border-primary/20",
  "Frontend":          "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  "Backend":           "bg-green-500/10 text-green-400 border-green-500/20",
  "Full Stack":        "bg-violet-500/10 text-violet-400 border-violet-500/20",
  "Data Science & AI": "bg-orange-500/10 text-orange-400 border-orange-500/20",
  "Cloud & DevOps":    "bg-sky-500/10 text-sky-400 border-sky-500/20",
  "Mobile":            "bg-pink-500/10 text-pink-400 border-pink-500/20",
  "Design":            "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function matchesDomain(job: LiveJob, domain: string): boolean {
  if (domain === "All") return true;
  const tags = DOMAINS[domain];
  return job.tags.some((t) => tags.some((d) => t.toLowerCase().includes(d)));
}

/* ──────────────────────── FETCH LIVE JOBS ──── */
async function fetchArbeitnow(page = 1): Promise<LiveJob[]> {
  const res = await fetch(`https://arbeitnow.com/api/job-board-api?page=${page}`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error("Arbeitnow fetch failed");
  const json = await res.json();
  return (json.data ?? []).map((j: any) => ({
    id: j.slug,
    title: j.title,
    company: j.company_name,
    location: j.location || "Remote",
    remote: j.remote ?? false,
    tags: j.tags ?? [],
    jobTypes: j.job_types ?? [],
    description: stripHtml(j.description ?? ""),
    applyUrl: j.url,
    source: "Arbeitnow",
    postedAt: j.created_at * 1000,
  }));
}

async function fetchRemotive(category = "software-dev"): Promise<LiveJob[]> {
  try {
    const res = await fetch(
      `https://remotive.com/api/remote-jobs?category=${category}&limit=30`,
    );
    if (!res.ok) return [];
    const json = await res.json();
    return (json.jobs ?? []).map((j: any) => ({
      id: `rem-${j.id}`,
      title: j.title,
      company: j.company_name,
      location: j.candidate_required_location || "Remote",
      remote: true,
      tags: (j.tags ?? []).map((t: string) => t.toLowerCase()),
      jobTypes: [j.job_type ?? "full-time"],
      description: stripHtml(j.description ?? ""),
      applyUrl: j.url,
      source: "Remotive",
      postedAt: new Date(j.publication_date).getTime(),
    }));
  } catch {
    return [];
  }
}

/* ──────────────────────── MAIN PAGE ──── */
function JobsPage() {
  const [jobs, setJobs] = useState<LiveJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [q, setQ] = useState("");
  const [domain, setDomain] = useState("All");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [saved, setSaved] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem("savedJobs") ?? "[]")); }
    catch { return new Set(); }
  });
  const [selected, setSelected] = useState<LiveJob | null>(null);

  const loadJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [page1, page2, remotive] = await Promise.allSettled([
        fetchArbeitnow(1),
        fetchArbeitnow(2),
        fetchRemotive("software-dev"),
      ]);
      const all: LiveJob[] = [];
      if (page1.status === "fulfilled") all.push(...page1.value);
      if (page2.status === "fulfilled") all.push(...page2.value);
      if (remotive.status === "fulfilled") all.push(...remotive.value);
      // Deduplicate by id
      const seen = new Set<string>();
      const unique = all.filter((j) => { if (seen.has(j.id)) return false; seen.add(j.id); return true; });
      setJobs(unique);
      setLastUpdated(new Date());
    } catch (e: any) {
      setError("Could not load live jobs. Check your connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadJobs(); }, []);

  // Auto-refresh every 30 minutes
  useEffect(() => {
    const id = setInterval(loadJobs, 30 * 60 * 1000);
    return () => clearInterval(id);
  }, [loadJobs]);

  function toggleSave(id: string) {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem("savedJobs", JSON.stringify([...next]));
      return next;
    });
  }

  const filtered = jobs.filter((j) => {
    if (remoteOnly && !j.remote) return false;
    if (!matchesDomain(j, domain)) return false;
    if (q) {
      const sq = q.toLowerCase();
      return j.title.toLowerCase().includes(sq) || j.company.toLowerCase().includes(sq) || j.tags.some((t) => t.includes(sq));
    }
    return true;
  });

  const counts: Record<string, number> = {};
  Object.keys(DOMAINS).forEach((d) => {
    counts[d] = d === "All" ? jobs.length : jobs.filter((j) => matchesDomain(j, d)).length;
  });

  return (
    <AppShell>
      <div className="flex items-start justify-between flex-wrap gap-3">
        <PageHeader
          title="Jobs & Internships"
          subtitle="Live opportunities fetched in real-time — browse, filter, and apply without leaving the app."
        />
        <div className="flex items-center gap-2 mt-2">
          {lastUpdated && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              {error ? <WifiOff className="size-3 text-rose-400" /> : <Wifi className="size-3 text-emerald-400" />}
              Updated {formatDistanceToNow(lastUpdated, { addSuffix: true })}
            </span>
          )}
          <Button variant="outline" size="sm" onClick={loadJobs} disabled={loading}>
            <RefreshCw className={cn("size-4", loading && "animate-spin")} /> Refresh
          </Button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Live Jobs", value: jobs.length || "—" },
          { label: "Remote", value: jobs.filter((j) => j.remote).length || "—" },
          { label: "Sources", value: "2 APIs" },
          { label: "Saved", value: saved.size },
        ].map((s) => (
          <div key={s.label} className="glass-card rounded-xl p-3 text-center">
            <p className="text-xl font-bold gradient-text">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Domain Tabs */}
      <div className="mt-5 flex gap-2 flex-wrap">
        {Object.keys(DOMAINS).map((d) => (
          <button
            key={d}
            onClick={() => setDomain(d)}
            className={cn(
              "text-xs px-3 py-1.5 rounded-full border font-semibold transition-all",
              domain === d ? DOMAIN_COLORS[d] : "border-white/10 text-muted-foreground hover:border-white/20",
            )}
          >
            {d} <span className="opacity-60">({counts[d] ?? 0})</span>
          </button>
        ))}
      </div>

      {/* Search + Filter Row */}
      <div className="mt-4 flex gap-3 items-center flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search role, company, skill…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-10 bg-glass border-white/10 h-10 rounded-xl"
          />
        </div>
        <label className="flex items-center gap-2 text-sm cursor-pointer glass-card px-3 py-2 rounded-xl border border-white/10">
          <input type="checkbox" checked={remoteOnly} onChange={(e) => setRemoteOnly(e.target.checked)} className="accent-primary" />
          <Globe2 className="size-4 text-emerald-400" /> Remote only
        </label>
        {(q || remoteOnly || domain !== "All") && (
          <Button variant="outline" size="sm" onClick={() => { setQ(""); setRemoteOnly(false); setDomain("All"); }}>
            <X className="size-3 mr-1" /> Clear
          </Button>
        )}
      </div>

      {/* Main Content */}
      <div className={cn("mt-5 flex gap-5 items-start", selected && "lg:flex-row")}>
        {/* Job List */}
        <div className={cn("flex-1 min-w-0", selected ? "hidden lg:block" : "")}>
          {loading ? (
            <div className="grid place-items-center py-24">
              <div className="text-center">
                <Loader2 className="size-8 animate-spin text-primary mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">Fetching live jobs…</p>
              </div>
            </div>
          ) : error ? (
            <div className="glass-card rounded-2xl p-8 text-center">
              <WifiOff className="size-8 text-rose-400 mx-auto mb-3" />
              <p className="text-rose-400 font-semibold">{error}</p>
              <Button variant="hero" className="mt-4" onClick={loadJobs}>Retry</Button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="glass-card rounded-2xl p-10 text-center">
              <p className="text-muted-foreground">No jobs match your filters. Try a different domain or search term.</p>
            </div>
          ) : (
            <>
              <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
                <Zap className="size-3 text-primary" /> Showing {filtered.length} live opportunities
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {filtered.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    isSaved={saved.has(job.id)}
                    isSelected={selected?.id === job.id}
                    onSave={() => toggleSave(job.id)}
                    onSelect={() => setSelected(selected?.id === job.id ? null : job)}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* In-App Job Detail Panel */}
        {selected && <JobDetailPanel job={selected} isSaved={saved.has(selected.id)} onSave={() => toggleSave(selected.id)} onClose={() => setSelected(null)} />}
      </div>

      {/* Mobile Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 lg:hidden bg-background/95 backdrop-blur overflow-y-auto">
          <JobDetailPanel job={selected} isSaved={saved.has(selected.id)} onSave={() => toggleSave(selected.id)} onClose={() => setSelected(null)} mobile />
        </div>
      )}
    </AppShell>
  );
}

/* ──────────────────────── JOB CARD ──── */
function JobCard({ job, isSaved, isSelected, onSave, onSelect }: {
  job: LiveJob; isSaved: boolean; isSelected: boolean;
  onSave: () => void; onSelect: () => void;
}) {
  return (
    <div
      className={cn(
        "glass-card rounded-2xl p-5 flex flex-col border transition-all cursor-pointer hover:-translate-y-0.5",
        isSelected ? "border-primary/50 bg-primary/5 shadow-elegant" : "border-white/5 hover:border-primary/25",
      )}
      onClick={onSelect}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="size-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 grid place-items-center shrink-0 font-bold text-primary">
          {job.company.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm leading-tight line-clamp-2">{job.title}</h3>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
            <Building2 className="size-3" /> {job.company}
          </p>
        </div>
        <button onClick={(e) => { e.stopPropagation(); onSave(); }} className={cn("shrink-0 transition-colors", isSaved ? "text-primary" : "text-muted-foreground hover:text-primary")}>
          {isSaved ? <BookmarkCheck className="size-5 fill-primary/20" /> : <Bookmark className="size-5" />}
        </button>
      </div>

      {/* Badges */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {job.remote && (
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]">
            <Globe2 className="size-2.5 mr-1" /> Remote
          </Badge>
        )}
        {job.location && !job.remote && (
          <Badge className="bg-white/5 text-muted-foreground text-[10px]">
            <MapPin className="size-2.5 mr-1" /> {job.location}
          </Badge>
        )}
        {job.jobTypes.slice(0, 1).map((t) => (
          <Badge key={t} className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px] capitalize">
            <Briefcase className="size-2.5 mr-1" /> {t}
          </Badge>
        ))}
        <Badge className="bg-white/5 text-muted-foreground text-[10px]">{job.source}</Badge>
      </div>

      {/* Tags */}
      <div className="mt-2 flex flex-wrap gap-1">
        {job.tags.slice(0, 4).map((t) => (
          <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/5 text-muted-foreground border border-white/5 capitalize">{t}</span>
        ))}
        {job.tags.length > 4 && <span className="text-[10px] text-muted-foreground">+{job.tags.length - 4}</span>}
      </div>

      {/* Footer */}
      <div className="mt-auto pt-4 flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
          <Calendar className="size-3" /> {formatDistanceToNow(job.postedAt, { addSuffix: true })}
        </span>
        <span className="text-xs text-primary font-semibold flex items-center gap-1">
          View details <ChevronRight className="size-3" />
        </span>
      </div>
    </div>
  );
}

/* ──────────────────────── JOB DETAIL PANEL ──── */
function JobDetailPanel({ job, isSaved, onSave, onClose, mobile }: {
  job: LiveJob; isSaved: boolean; onSave: () => void; onClose: () => void; mobile?: boolean;
}) {
  return (
    <div className={cn(
      "glass-card border border-primary/20 rounded-2xl overflow-y-auto",
      mobile ? "min-h-screen p-5" : "w-full lg:w-[42%] sticky top-24 max-h-[calc(100vh-6rem)]",
    )}>
      {/* Top bar */}
      <div className="flex items-start justify-between gap-3 p-5 border-b border-white/5">
        <div className="flex gap-3 items-start">
          <div className="size-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 grid place-items-center font-bold text-lg text-primary shrink-0">
            {job.company.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="font-bold text-base leading-tight">{job.title}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">{job.company}</p>
          </div>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
          <X className="size-5" />
        </button>
      </div>

      <div className="p-5 space-y-5">
        {/* Quick Meta */}
        <div className="flex flex-wrap gap-2">
          {job.remote && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 font-semibold flex items-center gap-1">
              <Globe2 className="size-3" /> Remote
            </span>
          )}
          {job.location && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-muted-foreground border border-white/10 flex items-center gap-1">
              <MapPin className="size-3" /> {job.location}
            </span>
          )}
          {job.jobTypes.map((t) => (
            <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 capitalize flex items-center gap-1">
              <Briefcase className="size-3" /> {t}
            </span>
          ))}
        </div>

        {/* Tags / Skills */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1">
            <Tag className="size-3" /> Skills & Tags
          </p>
          <div className="flex flex-wrap gap-1.5">
            {job.tags.map((t) => (
              <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-primary/8 text-primary border border-primary/15 capitalize font-medium">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Job Description</p>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line line-clamp-[20]">
            {job.description.slice(0, 1800)}{job.description.length > 1800 ? "…" : ""}
          </p>
        </div>

        {/* Posted + Source */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Calendar className="size-3" /> Posted {formatDistanceToNow(job.postedAt, { addSuffix: true })}</span>
          <span>Source: {job.source}</span>
        </div>

        {/* CTA */}
        <div className="flex gap-3 pt-2">
          <Button
            onClick={onSave}
            variant="outline"
            className={cn("flex-1", isSaved && "border-primary/40 text-primary")}
          >
            {isSaved ? <><BookmarkCheck className="size-4" /> Saved</> : <><Bookmark className="size-4" /> Save Job</>}
          </Button>
          <Button variant="hero" className="flex-1" asChild>
            <a href={job.applyUrl} target="_blank" rel="noopener noreferrer">
              Apply Now <ExternalLink className="size-4 ml-1" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
