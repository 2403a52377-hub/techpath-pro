import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "./roadmaps.index";
import { useEffect, useRef, useState } from "react";
import { Send, Bot, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/assistant")({ component: Assistant });

const SUGGESTIONS = [
  "Review my resume and suggest improvements",
  "Build me a 30-day plan for cracking Amazon SDE",
  "Explain dynamic programming with examples",
  "What projects should I build for a Full Stack role?",
];

function Assistant() {
  const { user } = useAuth();
  const [initialMessages, setInitialMessages] = useState<UIMessage[] | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load saved history once
  useEffect(() => {
    if (!user) { setInitialMessages([]); return; }
    (async () => {
      const { data } = await supabase
        .from("chat_messages")
        .select("id, role, content, created_at")
        .order("created_at", { ascending: true })
        .limit(200);
      const greeting: UIMessage = {
        id: "greeting",
        role: "assistant",
        parts: [{ type: "text", text: `Hi ${user.fullName.split(" ")[0] || "there"}! I'm TechLand AI — your career copilot. Ask me anything about your roadmap, resume, interviews, or career.` }],
      };
      const history: UIMessage[] = (data ?? []).map((r) => ({
        id: r.id,
        role: r.role === "user" ? "user" : "assistant",
        parts: [{ type: "text", text: r.content }],
      }));
      setInitialMessages(history.length ? history : [greeting]);
    })();
  }, [user?.id]);

  if (!initialMessages) {
    return (
      <AppShell>
        <div className="grid place-items-center h-96"><Loader2 className="size-6 animate-spin text-primary" /></div>
      </AppShell>
    );
  }

  return <AssistantChat key={user?.id ?? "anon"} initialMessages={initialMessages} />;
}

function AssistantChat({ initialMessages }: { initialMessages: UIMessage[] }) {
  const { user } = useAuth();
  const transport = useRef(new DefaultChatTransport({ api: "/api/chat" }));
  const { messages, sendMessage, status, error } = useChat({
    id: user?.id ?? "guest",
    messages: initialMessages,
    transport: transport.current,
    onError: (e) => toast.error(e.message ?? "Chat failed"),
    onFinish: async ({ message }) => {
      if (!user) return;
      const last = messages[messages.length - 1];
      // Persist the latest user msg + the assistant reply
      try {
        const text = message.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
        if (last?.role === "user") {
          const userText = last.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
          await supabase.from("chat_messages").insert([
            { user_id: user.id, role: "user", content: userText },
            { user_id: user.id, role: "assistant", content: text },
          ]);
        } else {
          await supabase.from("chat_messages").insert({ user_id: user.id, role: "assistant", content: text });
        }
      } catch { /* ignore */ }
    },
  });
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  const send = (text: string) => {
    if (!text.trim() || status === "submitted" || status === "streaming") return;
    sendMessage({ text: text.trim() });
    setInput("");
  };

  return (
    <AppShell>
      <PageHeader title="TechLand AI" subtitle="Your 24/7 AI career coach — guidance, study plans, resume reviews and interview feedback." />

      <div className="mt-8 grid lg:grid-cols-[1fr_280px] gap-6">
        <div className="glass-card rounded-2xl flex flex-col h-[calc(100vh-300px)] min-h-[480px]">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((m) => {
              const text = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
              return (
                <div key={m.id} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`size-9 rounded-full grid place-items-center shrink-0 ${m.role === "assistant" ? "bg-gradient-primary" : "bg-gradient-accent"}`}>
                    {m.role === "assistant" ? <Bot className="size-5 text-primary-foreground" /> : <span className="text-sm font-bold text-accent-foreground">{user?.fullName.charAt(0)}</span>}
                  </div>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${m.role === "assistant" ? "bg-background/70" : "bg-gradient-primary text-primary-foreground"}`}>
                    {text || (status === "streaming" ? "…" : "")}
                  </div>
                </div>
              );
            })}
            {status === "submitted" && (
              <div className="flex gap-3">
                <div className="size-9 rounded-full bg-gradient-primary grid place-items-center"><Bot className="size-5 text-primary-foreground" /></div>
                <div className="rounded-2xl px-4 py-3 text-sm bg-background/70"><span className="inline-flex gap-1"><span className="size-1.5 bg-primary rounded-full animate-pulse" /><span className="size-1.5 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} /><span className="size-1.5 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} /></span></div>
              </div>
            )}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="border-t border-border p-4 flex gap-2">
            <input
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask TechLand AI…"
              className="flex-1 h-11 px-4 rounded-lg bg-background border border-input text-sm outline-none focus:border-primary"
              disabled={status === "submitted" || status === "streaming"}
            />
            <Button type="submit" variant="hero" size="icon" className="h-11 w-11" disabled={status === "submitted" || status === "streaming"}>
              {status === "submitted" || status === "streaming" ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            </Button>
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
