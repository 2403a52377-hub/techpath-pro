import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "./roadmaps.index";
import { PROJECTS_BY_LEVEL } from "@/lib/data";
import { Github, Clock, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/projects")({ component: Projects });

function Projects() {
  return (
    <AppShell>
      <PageHeader
        title="Project Guidance"
        subtitle="Beginner → Advanced projects with required skills, duration, and GitHub references."
      />
      <div className="mt-8 space-y-8">
        {(Object.keys(PROJECTS_BY_LEVEL) as Array<keyof typeof PROJECTS_BY_LEVEL>).map((level) => (
          <section key={level}>
            <h2 className="text-xl font-bold mb-4">{level} projects</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {PROJECTS_BY_LEVEL[level].map((p) => (
                <div
                  key={p.title}
                  className="glass-card rounded-2xl p-5 hover:shadow-elegant transition-all"
                >
                  <h3 className="font-bold">{p.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Clock className="size-3" />
                    {p.duration}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {p.skills.map((s) => (
                      <span
                        key={s}
                        className="text-xs px-2 py-0.5 rounded-full bg-accent/15 text-accent"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <a
                    href={p.github}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                  >
                    <Github className="size-4" /> GitHub references{" "}
                    <ExternalLink className="size-3" />
                  </a>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </AppShell>
  );
}
