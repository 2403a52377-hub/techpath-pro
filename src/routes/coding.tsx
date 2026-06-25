import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "./roadmaps.index";
import { CODING_PLATFORMS, COMPANIES } from "@/lib/data";
import { ExternalLink, Trophy, Flame, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/coding")({ component: CodingPractice });

type Topic = {
  id: string;
  name: string;
  difficulty: string;
  leetcode_url: string | null;
  hackerrank_url: string | null;
  gfg_url: string | null;
  codechef_url: string | null;
};

function CodingPractice() {
  const [topics, setTopics] = useState<Topic[] | null>(null);

  useEffect(() => {
    supabase.from("coding_topics").select("*").order("sort_order").then(({ data }) => setTopics(data ?? []));
  }, []);

  return (
    <AppShell>
      <PageHeader title="Coding Practice" subtitle="Curated DSA paths across the best platforms. Topic-wise, company-wise, and daily challenges." />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {CODING_PLATFORMS.map((p) => (
          <a key={p.name} href={p.url} target="_blank" rel="noreferrer"
            className="glass-card rounded-2xl p-6 hover:shadow-elegant hover:-translate-y-1 transition-all">
            <div className={`size-12 rounded-xl bg-gradient-to-br ${p.color} mb-4 shadow-md`} />
            <p className="font-bold">{p.name}</p>
            <p className="text-xs text-muted-foreground mt-1">{p.desc}</p>
            <p className="mt-3 text-xs flex items-center gap-1 text-accent font-semibold">Open <ExternalLink className="size-3" /></p>
          </a>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-bold flex items-center gap-2"><Flame className="size-5 text-accent" /> Topic-wise practice</h2>
        {!topics && <div className="grid place-items-center py-10"><Loader2 className="size-6 animate-spin text-primary" /></div>}
        <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics?.map((t) => (
            <div key={t.id} className="glass-card rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <p className="font-bold">{t.name}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                  t.difficulty === "Easy" ? "bg-success/15 text-success" :
                  t.difficulty === "Medium" ? "bg-warning/15 text-warning" :
                  "bg-destructive/15 text-destructive"
                }`}>{t.difficulty}</span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {t.leetcode_url && <PlatformLink href={t.leetcode_url} label="LeetCode" />}
                {t.hackerrank_url && <PlatformLink href={t.hackerrank_url} label="HackerRank" />}
                {t.gfg_url && <PlatformLink href={t.gfg_url} label="GfG" />}
                {t.codechef_url && <PlatformLink href={t.codechef_url} label="CodeChef" />}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold flex items-center gap-2"><Trophy className="size-5 text-accent" /> Company-tagged questions</h2>
        <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {COMPANIES.map((c) => (
            <a key={c.slug} href={`https://leetcode.com/company/${c.slug}/`} target="_blank" rel="noreferrer"
              className="glass-card rounded-xl p-4 hover:shadow-elegant transition-all flex items-center justify-between">
              <span className="font-semibold">{c.name}</span>
              <ExternalLink className="size-4 text-muted-foreground" />
            </a>
          ))}
        </div>
      </section>
    </AppShell>
  );
}

function PlatformLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer"
      className="text-xs flex items-center justify-between px-3 py-2 rounded-lg bg-background/60 hover:bg-accent/10 transition-colors">
      {label} <ExternalLink className="size-3" />
    </a>
  );
}
