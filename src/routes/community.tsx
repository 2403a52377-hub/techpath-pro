import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "./roadmaps.index";
import { MessageSquare, Users, BookOpen, Hash } from "lucide-react";

export const Route = createFileRoute("/community")({ component: Community });

const POSTS = [
  { user: "Aarav P.", college: "IIT Bombay", topic: "DSA", title: "How I solved 500 LeetCode problems in 90 days", replies: 42, time: "2h" },
  { user: "Ishita R.", college: "BITS Pilani", topic: "Career", title: "Got Microsoft offer — sharing prep strategy", replies: 128, time: "5h" },
  { user: "Karthik V.", college: "NIT Trichy", topic: "Doubt", title: "Stuck on Graph traversal — need help", replies: 7, time: "1d" },
  { user: "Sanya K.", college: "VIT Vellore", topic: "Resources", title: "Best free AWS courses for beginners?", replies: 23, time: "1d" },
];

const GROUPS = ["Full Stack Devs", "DSA Daily", "Off-Campus Drives", "AI/ML India", "System Design", "Resume Reviews"];

function Community() {
  return (
    <AppShell>
      <PageHeader title="Community" subtitle="Discussion forums, doubt solving, study groups and domain-based communities." />

      <div className="grid lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2"><MessageSquare className="size-5 text-accent" /> Trending discussions</h2>
          {POSTS.map((p) => (
            <div key={p.title} className="glass-card rounded-2xl p-5 hover:shadow-elegant transition-all cursor-pointer">
              <div className="flex items-start gap-3">
                <div className="size-10 rounded-full bg-gradient-accent grid place-items-center text-accent-foreground font-bold text-sm shrink-0">{p.user.charAt(0)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">{p.user} • {p.college} • {p.time} ago</p>
                  <h3 className="font-semibold mt-1">{p.title}</h3>
                  <div className="mt-2 flex items-center gap-3 text-xs">
                    <span className="px-2 py-0.5 rounded-full bg-primary/15 text-primary font-medium flex items-center gap-1"><Hash className="size-3" />{p.topic}</span>
                    <span className="text-muted-foreground">{p.replies} replies</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2"><Users className="size-5 text-accent" /> Study groups</h2>
          <div className="glass-card rounded-2xl p-4 space-y-2">
            {GROUPS.map((g) => (
              <button key={g} className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-accent/10 transition-colors text-left">
                <div className="size-9 rounded-lg bg-gradient-primary grid place-items-center"><BookOpen className="size-4 text-primary-foreground" /></div>
                <div>
                  <p className="font-semibold text-sm">{g}</p>
                  <p className="text-xs text-muted-foreground">{Math.floor(Math.random() * 4000) + 500} members</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
