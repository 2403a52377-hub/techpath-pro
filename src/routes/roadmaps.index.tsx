import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ROADMAPS } from "@/lib/data";
import { Clock, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/roadmaps/")({ component: RoadmapsIndex });

function RoadmapsIndex() {
  const entries = Object.entries(ROADMAPS);
  return (
    <AppShell>
      <PageHeader title="Career Roadmaps" subtitle="Personalized step-by-step paths from beginner to advanced. Track skills, complete milestones, earn badges." />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
        {entries.map(([slug, r]) => (
          <Link key={slug} to="/roadmaps/$slug" params={{ slug }} className="group glass-card rounded-2xl p-6 hover:shadow-elegant hover:-translate-y-1 transition-all">
            <div className="size-12 rounded-xl bg-gradient-primary grid place-items-center mb-4 group-hover:shadow-glow">
              <span className="text-primary-foreground font-bold">{r.name.charAt(0)}</span>
            </div>
            <h3 className="text-lg font-bold">{r.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{r.tagline}</p>
            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="size-3.5" />{r.duration}</span>
              <span className="flex items-center gap-1 text-accent font-semibold">Open <ArrowRight className="size-3.5" /></span>
            </div>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-8 shadow-elegant">
      <div className="absolute -top-20 -right-20 size-64 rounded-full bg-accent/30 blur-3xl" />
      <div className="relative text-primary-foreground">
        <h1 className="text-3xl lg:text-4xl font-bold">{title}</h1>
        <p className="mt-2 opacity-90 max-w-2xl">{subtitle}</p>
      </div>
    </div>
  );
}
