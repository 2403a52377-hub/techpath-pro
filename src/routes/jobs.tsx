import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "./roadmaps.index";
import { JOBS } from "@/lib/data";
import { Bookmark, MapPin, Briefcase, IndianRupee } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/jobs")({ component: JobsPage });

function JobsPage() {
  const [q, setQ] = useState("");
  const filtered = JOBS.filter((j) => (j.role + j.company + j.tags.join(" ")).toLowerCase().includes(q.toLowerCase()));
  return (
    <AppShell>
      <PageHeader title="Jobs & Internships" subtitle="Internships, fresher roles, off-campus drives and referral opportunities — all in one feed." />

      <div className="mt-6 flex gap-3">
        <Input placeholder="Search role, company, tag…" value={q} onChange={(e) => setQ(e.target.value)} className="flex-1" />
        <Button variant="hero">Filters</Button>
      </div>

      <div className="mt-6 grid sm:grid-cols-2 gap-5">
        {filtered.map((j) => (
          <div key={j.role + j.company} className="glass-card rounded-2xl p-5 hover:shadow-elegant transition-all">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-lg">{j.role}</h3>
                <p className="text-sm text-muted-foreground">{j.company}</p>
              </div>
              <button className="text-muted-foreground hover:text-accent"><Bookmark className="size-5" /></button>
            </div>
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="size-3.5" />{j.location}</span>
              <span className="flex items-center gap-1"><Briefcase className="size-3.5" />{j.type}</span>
              <span className="flex items-center gap-1"><IndianRupee className="size-3.5" />{j.stipend}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {j.tags.map((t) => <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-primary/15 text-primary font-medium">{t}</span>)}
            </div>
            <Button variant="hero" className="w-full mt-4">Apply now</Button>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
