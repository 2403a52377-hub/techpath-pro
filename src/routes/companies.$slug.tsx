import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "./roadmaps.index";
import { COMPANIES } from "@/lib/data";

export const Route = createFileRoute("/companies/$slug")({
  component: CompanyTrack,
  loader: ({ params }) => {
    const c = COMPANIES.find((c) => c.slug === params.slug);
    if (!c) throw notFound();
    return c;
  },
});

function CompanyTrack() {
  const c = Route.useLoaderData();

  return (
    <AppShell>
      <PageHeader
        title={`${c.name} Preparation Track`}
        subtitle={`Role: ${c.role} • Avg CTC: ${c.ctc}. Complete prep — process, skills, roadmap, FAQs.`}
      />

      <div className="grid lg:grid-cols-2 gap-6 mt-8">
        <Card title="Required skills">
          <ul className="space-y-2 text-sm">
            {[
              "DSA (Arrays, Trees, DP)",
              "System Design Basics",
              "OOP & Databases",
              "Behavioral / Leadership Principles",
              "Resume & GitHub portfolio",
            ].map((s) => (
              <li key={s} className="flex gap-2">
                <span className="size-1.5 rounded-full bg-accent mt-2" />
                {s}
              </li>
            ))}
          </ul>
        </Card>
        <Card title="Interview process">
          <ol className="space-y-3 text-sm">
            {[
              "Online Assessment (2 coding + MCQs)",
              "Technical Round 1 (DSA)",
              "Technical Round 2 (Project deep-dive)",
              "System Design (for SDE-2+)",
              "HR / Behavioral round",
            ].map((s, i) => (
              <li key={s} className="flex gap-3">
                <span className="size-6 rounded-full bg-gradient-primary text-primary-foreground text-xs font-bold grid place-items-center shrink-0">
                  {i + 1}
                </span>
                {s}
              </li>
            ))}
          </ol>
        </Card>
      </div>

      <div className="mt-6 glass-card rounded-2xl p-6">
        <h2 className="font-bold text-lg mb-4">8-week preparation roadmap</h2>
        <div className="grid sm:grid-cols-4 gap-3">
          {[
            { w: "Week 1-2", f: "DSA fundamentals" },
            { w: "Week 3-4", f: "Patterns & company tagged" },
            { w: "Week 5-6", f: "System design + projects" },
            { w: "Week 7-8", f: "Mock interviews + HR" },
          ].map((p) => (
            <div key={p.w} className="p-4 rounded-xl bg-background/60">
              <p className="text-xs text-accent font-bold uppercase tracking-widest">{p.w}</p>
              <p className="font-semibold mt-1">{p.f}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 glass-card rounded-2xl p-6">
        <h2 className="font-bold text-lg mb-4">Frequently asked questions</h2>
        <div className="space-y-3">
          {[
            {
              q: `What's the eligibility for ${c.name}?`,
              a: "Typically 7+ CGPA, no active backlogs. Some roles open to all branches.",
            },
            {
              q: "How many rounds are there?",
              a: "3-5 rounds depending on role and experience level.",
            },
            {
              q: "Is the OA tough?",
              a: "Medium to Hard on LeetCode. Practice company-tagged questions from the last 6 months.",
            },
          ].map((f) => (
            <details key={f.q} className="rounded-lg bg-background/60 p-4">
              <summary className="font-semibold cursor-pointer">{f.q}</summary>
              <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </div>

      <Link to="/companies" className="inline-block mt-8 text-sm text-accent hover:underline">
        ← All companies
      </Link>
    </AppShell>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-card rounded-2xl p-6">
      <h2 className="font-bold text-lg mb-4">{title}</h2>
      {children}
    </div>
  );
}
