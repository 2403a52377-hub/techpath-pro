import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "./roadmaps.index";
import { CODING_PLATFORMS, COMPANIES } from "@/lib/data";
import { ExternalLink, Trophy, Flame } from "lucide-react";

export const Route = createFileRoute("/coding")({ component: CodingPractice });

const TOPICS = ["Arrays", "Strings", "Linked List", "Trees", "Graphs", "DP", "Greedy", "Backtracking", "Sliding Window", "Heap", "Trie", "Binary Search"];

function CodingPractice() {
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
        <div className="mt-4 flex flex-wrap gap-2">
          {TOPICS.map((t) => (
            <a key={t} href={`https://leetcode.com/tag/${t.toLowerCase().replace(/\s/g, "-")}/`} target="_blank" rel="noreferrer"
              className="px-4 py-2 rounded-full glass-card text-sm font-medium hover:shadow-glow transition-shadow">
              {t}
            </a>
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

      <section className="mt-10 grid lg:grid-cols-2 gap-5">
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-bold text-lg">Today's challenge</h3>
          <p className="mt-2 text-sm text-muted-foreground">Two Sum II — Input Array Is Sorted</p>
          <p className="text-xs text-accent font-semibold mt-1">Medium • 25 min</p>
          <a href="https://leetcode.com/problemset/" target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-semibold">
            Solve now <ExternalLink className="size-4" />
          </a>
        </div>
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-bold text-lg">Weekly contest</h3>
          <p className="mt-2 text-sm text-muted-foreground">Saturday, 8:00 PM IST • LeetCode Weekly 412</p>
          <a href="https://leetcode.com/contest/" target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg glass-card text-sm font-semibold">
            Register <ExternalLink className="size-4" />
          </a>
        </div>
      </section>
    </AppShell>
  );
}
