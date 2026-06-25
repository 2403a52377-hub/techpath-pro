import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "./roadmaps.index";
import { Mic, Video, Brain, Users } from "lucide-react";

export const Route = createFileRoute("/interview")({ component: InterviewPrep });

const QUESTIONS = {
  Technical: [
    "Reverse a linked list — explain both iterative and recursive.",
    "Design a URL shortener (system design).",
    "Difference between SQL & NoSQL with use cases.",
    "Explain how React's virtual DOM works.",
    "What happens when you type google.com and press Enter?",
  ],
  HR: [
    "Tell me about yourself.",
    "Why do you want to join our company?",
    "Where do you see yourself in 5 years?",
    "Your greatest strength and weakness?",
    "Are you willing to relocate?",
  ],
  Behavioral: [
    "Describe a time you faced conflict in a team.",
    "Tell me about a failure and what you learned.",
    "How do you prioritize tasks?",
    "Tell me about your most impactful project.",
    "Describe a time you led without authority.",
  ],
};

function InterviewPrep() {
  return (
    <AppShell>
      <PageHeader title="Interview Preparation" subtitle="Technical, HR, behavioral questions plus AI mock interview simulator with feedback reports." />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <FeatureTile icon={Brain} title="AI Mock Interview" desc="Practice with TechLand AI" />
        <FeatureTile icon={Video} title="Video Practice" desc="Record & review yourself" />
        <FeatureTile icon={Mic} title="Voice Drills" desc="HR & behavioral rounds" />
        <FeatureTile icon={Users} title="Peer Mocks" desc="With other students" />
      </div>

      <div className="mt-10 space-y-8">
        {Object.entries(QUESTIONS).map(([cat, qs]) => (
          <section key={cat}>
            <h2 className="text-xl font-bold mb-4">{cat} questions</h2>
            <div className="space-y-2">
              {qs.map((q, i) => (
                <div key={q} className="glass-card rounded-xl p-4 flex items-start gap-3 hover:shadow-elegant transition-all">
                  <span className="size-7 rounded-full bg-gradient-primary text-primary-foreground text-xs font-bold grid place-items-center shrink-0">{i + 1}</span>
                  <p className="text-sm">{q}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </AppShell>
  );
}

function FeatureTile({ icon: Icon, title, desc }: { icon: React.ComponentType<{ className?: string }>; title: string; desc: string }) {
  return (
    <div className="glass-card rounded-2xl p-5 hover:shadow-elegant hover:-translate-y-1 transition-all cursor-pointer">
      <div className="size-10 rounded-xl bg-gradient-accent grid place-items-center mb-3">
        <Icon className="size-5 text-accent-foreground" />
      </div>
      <p className="font-bold">{title}</p>
      <p className="text-xs text-muted-foreground mt-1">{desc}</p>
    </div>
  );
}
