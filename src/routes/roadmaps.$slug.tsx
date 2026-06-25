import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "./roadmaps.index";
import { Play, ExternalLink, CheckCircle2, Circle, Loader2, User } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/roadmaps/$slug")({ component: RoadmapDetail });

type Roadmap = { id: string; slug: string; title: string; description: string; estimated_duration: string; level: string };
type Module = {
  id: string;
  title: string;
  description: string | null;
  youtube_url: string | null;
  youtube_thumbnail: string | null;
  instructor: string | null;
  duration: string | null;
  sort_order: number;
};

function RoadmapDetail() {
  const { slug } = Route.useParams();
  const { user } = useAuth();
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: r } = await supabase.from("roadmaps").select("*").eq("slug", slug).maybeSingle();
      if (!r) { setRoadmap(null); setLoading(false); return; }
      setRoadmap(r);
      const { data: mods } = await supabase.from("roadmap_modules").select("*").eq("roadmap_id", r.id).order("sort_order");
      setModules(mods ?? []);
      if (user) {
        const { data: prog } = await supabase
          .from("user_progress").select("completed_module_ids").eq("user_id", user.id).eq("roadmap_id", r.id).maybeSingle();
        if (prog?.completed_module_ids) setCompleted(new Set(prog.completed_module_ids));
      }
      setLoading(false);
    })();
  }, [slug, user?.id]);

  async function toggle(moduleId: string) {
    if (!user || !roadmap) return toast.error("Sign in to track progress");
    const next = new Set(completed);
    if (next.has(moduleId)) next.delete(moduleId); else next.add(moduleId);
    setCompleted(next);
    const pct = modules.length ? Math.round((next.size / modules.length) * 100) : 0;
    await supabase.from("user_progress").upsert({
      user_id: user.id,
      roadmap_id: roadmap.id,
      completed_module_ids: Array.from(next),
      completion_percentage: pct,
    }, { onConflict: "user_id,roadmap_id" });
  }

  if (loading) return <AppShell><div className="grid place-items-center py-20"><Loader2 className="size-8 animate-spin text-primary" /></div></AppShell>;
  if (!roadmap) return <AppShell><p className="text-center py-20 text-muted-foreground">Roadmap not found. <Link to="/roadmaps" className="text-primary underline">Back</Link></p></AppShell>;

  const pct = modules.length ? Math.round((completed.size / modules.length) * 100) : 0;

  return (
    <AppShell>
      <PageHeader title={roadmap.title} subtitle={`${roadmap.description} • ${roadmap.estimated_duration} • ${modules.length} modules`} />

      <div className="mt-8 glass-card rounded-2xl p-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-semibold">Overall progress</span>
          <span className="font-bold gradient-text">{pct}%</span>
        </div>
        <div className="h-3 rounded-full bg-muted overflow-hidden">
          <div className="h-full bg-gradient-primary transition-all" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">{completed.size} of {modules.length} modules completed</p>
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-5">
        {modules.map((m, i) => {
          const isDone = completed.has(m.id);
          return (
            <div key={m.id} className="glass-card rounded-2xl overflow-hidden hover:shadow-elegant transition-all">
              {m.youtube_thumbnail && (
                <a href={m.youtube_url ?? "#"} target="_blank" rel="noreferrer" className="block relative aspect-video bg-muted">
                  <img src={m.youtube_thumbnail} alt={m.title} loading="lazy" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 grid place-items-center opacity-0 hover:opacity-100 transition-opacity">
                    <Play className="size-12 text-white" />
                  </div>
                </a>
              )}
              <div className="p-5">
                <div className="flex items-start gap-3">
                  <button onClick={() => toggle(m.id)} className="mt-1">
                    {isDone ? <CheckCircle2 className="size-5 text-success" /> : <Circle className="size-5 text-muted-foreground" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-accent font-semibold">Module {i + 1}</p>
                    <h3 className="font-bold">{m.title}</h3>
                    {m.description && <p className="text-xs text-muted-foreground mt-1">{m.description}</p>}
                    <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                      {m.instructor && <span className="flex items-center gap-1"><User className="size-3" />{m.instructor}</span>}
                      {m.duration && <span>{m.duration}</span>}
                    </div>
                    {m.youtube_url && (
                      <a href={m.youtube_url} target="_blank" rel="noreferrer"
                        className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-primary text-primary-foreground text-xs font-semibold">
                        Watch on YouTube <ExternalLink className="size-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <Link to="/roadmaps" className="text-sm text-accent hover:underline">← All roadmaps</Link>
      </div>
    </AppShell>
  );
}
