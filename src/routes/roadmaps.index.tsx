import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Clock, ArrowRight, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/roadmaps/")({ component: RoadmapsIndex });

type Roadmap = {
  id: string;
  slug: string;
  title: string;
  description: string;
  domain_name: string;
  level: string;
  estimated_duration: string;
  icon: string | null;
};

function RoadmapsIndex() {
  const [roadmaps, setRoadmaps] = useState<Roadmap[] | null>(null);
  useEffect(() => {
    supabase
      .from("roadmaps")
      .select("*")
      .order("sort_order")
      .then(({ data }) => setRoadmaps(data ?? []));
  }, []);

  return (
    <AppShell>
      <PageHeader
        title="Career Roadmaps"
        subtitle="Personalized step-by-step paths from beginner to advanced. Track skills, complete milestones, earn badges."
      />
      {!roadmaps && (
        <div className="grid place-items-center py-16">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      )}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
        {roadmaps?.map((r) => (
          <Link
            key={r.id}
            to="/roadmaps/$slug"
            params={{ slug: r.slug }}
            className="group glass-card rounded-2xl p-6 hover:shadow-elegant hover:-translate-y-1 transition-all"
          >
            <div className="size-12 rounded-xl bg-gradient-primary grid place-items-center mb-4 group-hover:shadow-glow text-2xl">
              {r.icon ?? r.title.charAt(0)}
            </div>
            <h3 className="text-lg font-bold">{r.title}</h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{r.description}</p>
            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="size-3.5" />
                {r.estimated_duration}
              </span>
              <span className="flex items-center gap-1 text-accent font-semibold">
                Open <ArrowRight className="size-3.5" />
              </span>
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
