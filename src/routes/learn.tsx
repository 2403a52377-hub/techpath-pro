import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "./roadmaps.index";
import { ROADMAPS } from "@/lib/data";
import { Play, ExternalLink, FileText, BookOpen } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/learn")({ component: LearnHub });

function LearnHub() {
  const slugs = Object.keys(ROADMAPS);
  const [active, setActive] = useState(slugs[0]);
  const r = ROADMAPS[active];
  const skills = r.stages.flatMap((s) => s.skills);

  const [customCourseLinks, setCustomCourseLinks] = useState<Record<string, string>>({});
  const [customNotesLinks, setCustomNotesLinks] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      const courses = JSON.parse(localStorage.getItem("customCourseLinks") ?? "{}");
      const notes = JSON.parse(localStorage.getItem("customNotesLinks") ?? "{}");
      setCustomCourseLinks(courses);
      setCustomNotesLinks(notes);
    } catch {}
  }, [active]);

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
        {skills.map((skill) => {
          const courseUrl = customCourseLinks[skill.name] || skill.youtube;
          const notesUrl = customNotesLinks[skill.name] || "#";
          
          return (
            <div
              key={skill.name}
              className="group glass-card rounded-2xl overflow-hidden hover:shadow-elegant hover:-translate-y-1 transition-all flex flex-col justify-between"
            >
              <a
                href={courseUrl}
                target="_blank"
                rel="noreferrer"
                className="aspect-video bg-gradient-primary relative grid place-items-center cursor-pointer"
              >
                <Play className="size-12 text-primary-foreground opacity-90 group-hover:scale-110 transition-transform" />
                <span className="absolute bottom-2 right-2 text-xs bg-background/90 text-foreground px-2 py-0.5 rounded">
                  YouTube
                </span>
              </a>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <p className="font-semibold text-foreground text-sm">{skill.name}</p>
                  <a
                    href={courseUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-muted-foreground mt-1 flex items-center gap-1 hover:text-primary transition-colors"
                  >
                    Top-rated course <ExternalLink className="size-3" />
                  </a>
                </div>
                <div className="mt-4 flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <a
                    href={notesUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                      "text-xs px-2.5 py-1 rounded-full flex items-center gap-1 transition-all border",
                      notesUrl !== "#" 
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20" 
                        : "bg-white/5 text-muted-foreground border-white/5 cursor-not-allowed"
                    )}
                  >
                    <FileText className="size-3" />
                    Notes
                  </a>
                  <a
                    href={courseUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs px-2.5 py-1 rounded-full bg-accent/20 text-accent border border-accent/20 flex items-center gap-1 hover:bg-accent/30 transition-all"
                  >
                    <BookOpen className="size-3" />
                    Cheat sheet
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
