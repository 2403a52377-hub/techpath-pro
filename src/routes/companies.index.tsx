import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "./roadmaps.index";
import { COMPANIES } from "@/lib/data";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/companies/")({ component: CompaniesIndex });

function CompaniesIndex() {
  return (
    <AppShell>
      <PageHeader
        title="Company Preparation Tracks"
        subtitle="Dedicated prep pages with interview process, required skills, FAQs, and a roadmap for each company."
      />
      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {COMPANIES.map((c) => (
          <Link
            key={c.slug}
            to="/companies/$slug"
            params={{ slug: c.slug }}
            className="group glass-card rounded-2xl p-6 hover:shadow-elegant hover:-translate-y-1 transition-all"
          >
            <div className={`size-14 rounded-2xl bg-gradient-to-br ${c.color} shadow-md mb-4`} />
            <h3 className="text-xl font-bold">{c.name}</h3>
            <p className="text-sm text-muted-foreground">
              {c.role} • {c.ctc}
            </p>
            <p className="mt-4 text-sm font-semibold text-accent flex items-center gap-1">
              Open track <ArrowRight className="size-4" />
            </p>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
