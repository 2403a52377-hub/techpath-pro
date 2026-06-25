import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ROADMAPS } from "@/lib/data";
import { PageHeader } from "./roadmaps.index";
import { Play, ExternalLink, CheckCircle2, Circle } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/roadmaps/$slug")({
  component: RoadmapDetail,
  loader: ({ params }) => {
    if (!ROADMAPS[params.slug]) throw notFound();
    return { slug: params.slug };
  },
});

function RoadmapDetail() {
  const { slug } = Route.useParams();
  const r = ROADMAPS[slug];
  const [done, setDone] = useState<Record<string, boolean>>({});
  const all = r.stages.flatMap((s) => s.skills.map((k) => `${s.title}::${k.name}`));
  const completed = all.filter((k) => done[k]).length;
  const pct = Math.round((completed / all.length) * 100);

  return (
    <AppShell>
      <PageHeader title={r.name} subtitle={`${r.tagline} • ${r.duration} • ${r.stages.length} stages`} />
      <div className="mt-8 glass-card rounded-2xl p-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-semibold">Overall progress</span>
          <span className="font-bold gradient-text">{pct}%</span>
        </div>
        <div className="h-3 rounded-full bg-muted overflow-hidden">
          <div className="h-full bg-gradient-primary transition-all" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">{completed} of {all.length} skills completed</p>
      </div>

      <div className="mt-6 space-y-6">
        {r.stages.map((stage, i) => (
          <div key={stage.title} className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-10 rounded-xl bg-gradient-primary grid place-items-center text-primary-foreground font-bold">{i + 1}</div>
              <div>
                <h2 className="text-xl font-bold">{stage.title}</h2>
                <p className="text-xs text-accent font-semibold uppercase tracking-widest">{stage.level}</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {stage.skills.map((skill) => {
                const key = `${stage.title}::${skill.name}`;
                const isDone = done[key];
                return (
                  <div key={skill.name} className="flex items-center gap-3 p-3 rounded-lg bg-background/50 hover:bg-accent/5 transition-colors">
                    <button onClick={() => setDone((d) => ({ ...d, [key]: !d[key] }))}>
                      {isDone ? <CheckCircle2 className="size-5 text-success" /> : <Circle className="size-5 text-muted-foreground" />}
                    </button>
                    <span className={`flex-1 text-sm font-medium ${isDone ? "line-through text-muted-foreground" : ""}`}>{skill.name}</span>
                    <a href={skill.youtube} target="_blank" rel="noreferrer" className="text-xs flex items-center gap-1 text-accent hover:underline">
                      <Play className="size-3.5" /> Learn <ExternalLink className="size-3" />
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Link to="/roadmaps" className="text-sm text-accent hover:underline">← All roadmaps</Link>
      </div>
    </AppShell>
  );
}
