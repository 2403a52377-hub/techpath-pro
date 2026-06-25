import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "./roadmaps.index";
import { useState, useRef, useEffect } from "react";
import { Send, Bot, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/assistant")({ component: Assistant });

type Msg = { role: "user" | "ai"; text: string };

const SUGGESTIONS = [
  "Review my resume and suggest improvements",
  "Build me a 30-day plan for cracking Amazon SDE",
  "Explain dynamic programming with examples",
  "What projects should I build for a Full Stack role?",
];

function Assistant() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Msg[]>([
    { role: "ai", text: `Hi ${user?.fullName.split(" ")[0] ?? "there"}! I'm TechLand AI — your career copilot. Ask me anything about your roadmap, resume, interviews, or career.` },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function send(text: string) {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [...m, {
        role: "ai",
        text: `Great question! Based on your ${user?.domain ?? "interests"} path at the ${user?.level ?? "current"} level, here's a tailored answer:\n\n• Focus on consistent daily practice (1-2 hours)\n• Build 2-3 portfolio projects this month\n• Solve 5 LeetCode problems per week\n• Schedule a mock interview every 2 weeks\n\nWant me to draft a detailed weekly plan?`,
      }]);
    }, 700);
  }

  return (
    <AppShell>
      <PageHeader title="TechLand AI" subtitle="Your 24/7 AI career coach — guidance, study plans, resume reviews and interview feedback." />

      <div className="mt-8 grid lg:grid-cols-[1fr_280px] gap-6">
        <div className="glass-card rounded-2xl flex flex-col h-[calc(100vh-300px)] min-h-[480px]">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`size-9 rounded-full grid place-items-center shrink-0 ${m.role === "ai" ? "bg-gradient-primary" : "bg-gradient-accent"}`}>
                  {m.role === "ai" ? <Bot className="size-5 text-primary-foreground" /> : <span className="text-sm font-bold text-accent-foreground">{user?.fullName.charAt(0)}</span>}
                </div>
                <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm whitespace-pre-line ${m.role === "ai" ? "bg-background/70" : "bg-gradient-primary text-primary-foreground"}`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="border-t border-border p-4 flex gap-2">
            <input
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask TechLand AI…"
              className="flex-1 h-11 px-4 rounded-lg bg-background border border-input text-sm outline-none focus:border-primary"
            />
            <Button type="submit" variant="hero" size="icon" className="h-11 w-11"><Send className="size-4" /></Button>
          </form>
        </div>

        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-5">
            <p className="font-bold flex items-center gap-2"><Sparkles className="size-4 text-accent" /> Try asking</p>
            <div className="mt-3 space-y-2">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => send(s)} className="block w-full text-left p-3 rounded-lg bg-background/60 hover:bg-accent/10 text-sm transition-colors">
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="glass-card rounded-2xl p-5">
            <p className="font-bold">Capabilities</p>
            <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
              <li>• Career guidance</li>
              <li>• Resume review</li>
              <li>• Interview feedback</li>
              <li>• Personalized study plans</li>
              <li>• Roadmap suggestions</li>
            </ul>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
