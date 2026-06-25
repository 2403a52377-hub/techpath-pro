import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "./roadmaps.index";
import { COMPANIES } from "@/lib/data";
import { Brain, Calculator, MessageSquareText, FileText, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/placement")({ component: Placement });

const SECTIONS = [
  { icon: Calculator, title: "Quantitative Aptitude", topics: ["Percentages", "Profit & Loss", "Time & Work", "Probability"] },
  { icon: Brain, title: "Logical Reasoning", topics: ["Series", "Puzzles", "Syllogism", "Blood Relations"] },
  { icon: MessageSquareText, title: "Verbal Ability", topics: ["Reading Comp", "Synonyms", "Grammar", "Para Jumbles"] },
  { icon: FileText, title: "Mock Tests", topics: ["Full-length", "Sectional", "Adaptive", "Previous papers"] },
];

function Placement() {
  return (
    <AppShell>
      <PageHeader title="Placement Preparation" subtitle="Aptitude, reasoning, mock tests, and company-specific tracks — built around top recruiter patterns." />

      <div className="grid sm:grid-cols-2 gap-5 mt-8">
        {SECTIONS.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.title} className="glass-card rounded-2xl p-6">
              <div className="size-12 rounded-xl bg-gradient-primary grid place-items-center mb-3">
                <Icon className="size-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-bold">{s.title}</h3>
              <ul className="mt-3 grid grid-cols-2 gap-2">
                {s.topics.map((t) => (
                  <li key={t} className="text-sm px-3 py-1.5 rounded-lg bg-background/60 hover:bg-accent/10 transition-colors cursor-pointer">{t}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-bold">Company-specific preparation</h2>
        <p className="text-sm text-muted-foreground">Dedicated tracks with interview process, top questions, and prep roadmaps.</p>
        <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {COMPANIES.map((c) => (
            <Link key={c.slug} to="/companies/$slug" params={{ slug: c.slug }}
              className="group glass-card rounded-2xl p-5 hover:shadow-elegant hover:-translate-y-1 transition-all">
              <div className={`size-10 rounded-lg bg-gradient-to-br ${c.color} mb-3`} />
              <p className="font-bold">{c.name}</p>
              <p className="text-xs text-muted-foreground">{c.role} • {c.ctc}</p>
              <p className="mt-3 text-xs flex items-center gap-1 text-accent font-semibold">Open track <ArrowRight className="size-3" /></p>
            </Link>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
