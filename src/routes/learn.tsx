import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "./roadmaps.index";
import { ROADMAPS } from "@/lib/data";
import { Play, ExternalLink, FileText, BookOpen } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/learn")({ component: LearnHub });

function LearnHub() {
  const slugs = Object.keys(ROADMAPS);
  const [active, setActive] = useState(slugs[0]);
  const r = ROADMAPS[active];
  const skills = r.stages.flatMap((s) => s.skills);

  return (
    <AppShell>
      <PageHeader
        title="Learning Hub"
        subtitle="Tutorials, cheat sheets, notes and curated YouTube courses for every roadmap skill."
      />
      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        {slugs.map((s) => (
          <button
            key={s}
            onClick={() => setActive(s)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${active === s ? "bg-gradient-primary text-primary-foreground shadow-md" : "glass-card hover:shadow-glow"}`}
          >
            {ROADMAPS[s].name}
          </button>
        ))}
      </div>
      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {skills.map((skill) => (
          <a
            key={skill.name}
            href={skill.youtube}
            target="_blank"
            rel="noreferrer"
            className="group glass-card rounded-2xl overflow-hidden hover:shadow-elegant hover:-translate-y-1 transition-all"
          >
            <div className="aspect-video bg-gradient-primary relative grid place-items-center">
              <Play className="size-12 text-primary-foreground opacity-90 group-hover:scale-110 transition-transform" />
              <span className="absolute bottom-2 right-2 text-xs bg-background/90 text-foreground px-2 py-0.5 rounded">
                YouTube
              </span>
            </div>
            <div className="p-4">
              <p className="font-semibold">{skill.name}</p>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                Top-rated course <ExternalLink className="size-3" />
              </p>
              <div className="mt-3 flex gap-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/20 text-secondary-foreground flex items-center gap-1">
                  <FileText className="size-3" />
                  Notes
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent flex items-center gap-1">
                  <BookOpen className="size-3" />
                  Cheat sheet
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </AppShell>
  );
}
