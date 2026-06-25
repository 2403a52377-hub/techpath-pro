import { useEffect, useRef, useState } from "react";
import { Bot, Send, X, Loader2, Sparkles } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export function ChatbotWidget() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const transport = useRef(new DefaultChatTransport({ api: "/api/chat" }));

  const initial: UIMessage[] = [{
    id: "greet",
    role: "assistant",
    parts: [{ type: "text", text: `Hi${user ? " " + user.fullName.split(" ")[0] : ""}! I'm TechLand AI. Ask me anything about roadmaps, coding, resumes, or interviews.` }],
  }];

  const { messages, sendMessage, status } = useChat({
    id: `widget-${user?.id ?? "guest"}`,
    messages: initial,
    transport: transport.current,
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status, open]);

  const busy = status === "submitted" || status === "streaming";
  const send = (t: string) => {
    if (!t.trim() || busy) return;
    sendMessage({ text: t.trim() });
    setInput("");
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open AI assistant"
        className={cn(
          "fixed z-50 bottom-6 right-6 size-14 rounded-full bg-gradient-primary shadow-elegant grid place-items-center text-primary-foreground hover:shadow-glow transition-all",
          open && "scale-90",
        )}
      >
        {open ? <X className="size-6" /> : <Bot className="size-6" />}
      </button>

      {open && (
        <div className="fixed z-50 bottom-24 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-96 h-[70vh] sm:h-[540px] glass-card rounded-2xl shadow-elegant flex flex-col overflow-hidden border border-border/60">
          <div className="px-4 py-3 border-b border-border/60 bg-gradient-primary text-primary-foreground flex items-center gap-2">
            <Sparkles className="size-4" />
            <p className="font-bold text-sm">TechLand AI</p>
            <span className="ml-auto text-xs opacity-80">{busy ? "Thinking…" : "Online"}</span>
          </div>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-background/40">
            {messages.map((m) => {
              const text = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
              return (
                <div key={m.id} className={cn("flex gap-2", m.role === "user" && "flex-row-reverse")}>
                  <div className={cn("size-7 rounded-full grid place-items-center shrink-0", m.role === "assistant" ? "bg-gradient-primary" : "bg-gradient-accent")}>
                    {m.role === "assistant" ? <Bot className="size-4 text-primary-foreground" /> : <span className="text-xs font-bold text-accent-foreground">{(user?.fullName ?? "U").charAt(0)}</span>}
                  </div>
                  <div className={cn(
                    "max-w-[80%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap",
                    m.role === "assistant" ? "bg-background/80" : "bg-gradient-primary text-primary-foreground",
                  )}>
                    {text || (busy ? "…" : "")}
                  </div>
                </div>
              );
            })}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="border-t border-border/60 p-3 flex gap-2 bg-background/70">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything…"
              className="flex-1 h-10 px-3 rounded-lg bg-background border border-input text-sm outline-none focus:border-primary"
              disabled={busy}
            />
            <button type="submit" disabled={busy} className="size-10 rounded-lg bg-gradient-primary text-primary-foreground grid place-items-center disabled:opacity-50">
              {busy ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
