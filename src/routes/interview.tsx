import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "./roadmaps.index";
import {
  Mic,
  Video,
  Brain,
  Users,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  CheckCircle2,
  Timer,
  Lightbulb,
  BookOpen,
  Play,
  ThumbsUp,
  Star,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Trophy,
  Target,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/interview")({ component: InterviewPrep });

/* ─────────────────────── QUESTION BANK ──── */
const QUESTION_BANK: Record<string, { q: string; hint: string; sampleAnswer: string }[]> = {
  Technical: [
    {
      q: "Reverse a linked list — explain both iterative and recursive approach.",
      hint: "Think about pointer manipulation and base cases for recursion.",
      sampleAnswer:
        "Iterative: Use three pointers (prev, curr, next). Traverse, reversing links one by one. Recursive: Base case = null or single node. Recurse to tail, then reverse links on the way back.",
    },
    {
      q: "Design a URL shortener system (system design).",
      hint: "Think about: unique ID generation, hashing, database schema, scalability.",
      sampleAnswer:
        "Key-value store: short code → URL. Base62 encode an auto-increment ID. Redis for caching hot URLs. CDN for low latency. Rate limiting to prevent abuse.",
    },
    {
      q: "What is the difference between SQL and NoSQL? When would you use each?",
      hint: "Consider data structure, scalability, consistency, and use cases.",
      sampleAnswer:
        "SQL: structured schema, ACID transactions, great for relational data (banking, ERP). NoSQL: flexible schema, horizontal scaling, great for unstructured data (social feeds, real-time analytics).",
    },
    {
      q: "Explain how React's virtual DOM works and why it's efficient.",
      hint: "Focus on reconciliation and the diffing algorithm.",
      sampleAnswer:
        "React keeps an in-memory copy of the DOM. On state change, it creates a new virtual tree, diffs it against the previous one using reconciliation, and only updates the actual DOM where differences exist — minimizing expensive DOM operations.",
    },
    {
      q: "What happens when you type 'google.com' and press Enter?",
      hint: "Cover: DNS, TCP/IP, TLS handshake, HTTP request/response.",
      sampleAnswer:
        "1. DNS resolves google.com → IP. 2. TCP 3-way handshake. 3. TLS handshake (HTTPS). 4. Browser sends HTTP GET. 5. Server responds with HTML. 6. Browser parses, fetches assets, renders.",
    },
    {
      q: "Explain time and space complexity. What is Big O notation?",
      hint: "Use examples: O(1), O(log n), O(n), O(n²).",
      sampleAnswer:
        "Big O describes worst-case performance as input grows. O(1) = constant (array access). O(log n) = binary search. O(n) = linear scan. O(n²) = nested loops. Helps compare algorithm efficiency.",
    },
  ],
  HR: [
    {
      q: "Tell me about yourself.",
      hint: "Structure: Present → Past → Future. Keep it under 2 minutes.",
      sampleAnswer:
        "Start with current academic year and branch, mention key technical skills, reference a notable project or achievement, end with what you're looking for in this role.",
    },
    {
      q: "Why do you want to join our company?",
      hint: "Research the company! Mention specific products, culture, or values.",
      sampleAnswer:
        "Show genuine interest — mention a specific product, technology they use, or a cultural value. Tie it to how it aligns with your career goals.",
    },
    {
      q: "Where do you see yourself in 5 years?",
      hint: "Be ambitious but realistic. Align with the company's growth.",
      sampleAnswer:
        "I see myself as a strong senior engineer shipping products that impact millions of users. I hope to grow technically through challenging projects and take on mentorship responsibilities.",
    },
    {
      q: "What is your greatest strength and weakness?",
      hint: "For weakness: be honest and show how you're actively improving.",
      sampleAnswer:
        "Strength: Problem solving — I enjoy breaking down complex problems systematically. Weakness: I struggled with time management but now use task trackers and time-boxing.",
    },
    {
      q: "Describe a time you handled pressure or a tight deadline.",
      hint: "Use the STAR method: Situation, Task, Action, Result.",
      sampleAnswer:
        "During our hackathon, we lost 6 hours due to a server crash 12 hours before submission. I reprioritized MVP features, divided tasks, and we shipped a working demo on time — winning 2nd place.",
    },
  ],
  Behavioral: [
    {
      q: "Describe a time you faced a conflict in your team and how you resolved it.",
      hint: "Focus on communication, empathy, and outcome.",
      sampleAnswer:
        "Two members disagreed on the tech stack. I organized a meeting, let both explain their reasoning, then evaluated both options against our deadline. We chose the simpler one and shipped on time.",
    },
    {
      q: "Tell me about a failure and what you learned from it.",
      hint: "Interviewers value self-awareness. Be honest about the failure.",
      sampleAnswer:
        "I underestimated a project's complexity and missed a college deadline. I learned to break projects into milestones, estimate more carefully, and always add buffer time.",
    },
    {
      q: "How do you prioritize tasks when you have multiple deadlines?",
      hint: "Mention a framework: Eisenhower Matrix, MoSCoW, or time-boxing.",
      sampleAnswer:
        "I rank by impact vs. urgency. High-impact, urgent tasks first. I use a to-do app to track deadlines and do a weekly review to re-prioritize based on new information.",
    },
    {
      q: "Tell me about your most impactful project.",
      hint: "Quantify impact: users, performance improvements, revenue saved.",
      sampleAnswer:
        "I built a college event portal adopted by 3 departments, handling 500+ event registrations with React + Node.js. It reduced manual paperwork by 80%.",
    },
    {
      q: "Describe a time you led without formal authority.",
      hint: "Focus on influence, communication, and earned respect.",
      sampleAnswer:
        "Our assigned leader was inactive. I stepped up, created a shared task board, held daily stand-ups, and ensured everyone was unblocked. We delivered on time with positive feedback.",
    },
  ],
};

const PEER_ROOMS = [
  { company: "TCS", type: "Technical Round", participants: 3, url: "https://meet.google.com/new" },
  { company: "Infosys", type: "HR Round", participants: 2, url: "https://meet.google.com/new" },
  { company: "Amazon", type: "System Design", participants: 1, url: "https://meet.google.com/new" },
  { company: "General", type: "Behavioral Round", participants: 4, url: "https://meet.google.com/new" },
];

type ActiveTool = "ai-mock" | "voice" | "video" | "peer" | null;

/* ─────────────────────── MAIN PAGE ──── */
function InterviewPrep() {
  const [activeTool, setActiveTool] = useState<ActiveTool>(null);

  function toggle(tool: ActiveTool) {
    setActiveTool((prev) => (prev === tool ? null : tool));
  }

  return (
    <AppShell>
      <PageHeader
        title="Interview Preparation"
        subtitle="Technical, HR, behavioral questions plus AI mock interview simulator — all right here."
      />

      {/* ── Tool Tiles ── */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <ToolTile
          id="ai-mock"
          active={activeTool === "ai-mock"}
          icon={Brain}
          title="AI Mock Interview"
          desc="Timed Q&A with scoring & feedback"
          gradient="from-violet-500 to-purple-600"
          badge="Most Popular"
          onToggle={toggle}
        />
        <ToolTile
          id="voice"
          active={activeTool === "voice"}
          icon={Mic}
          title="Voice Drills"
          desc="Speak your answers, get feedback"
          gradient="from-emerald-500 to-teal-500"
          onToggle={toggle}
        />
        <ToolTile
          id="video"
          active={activeTool === "video"}
          icon={Video}
          title="Video Practice"
          desc="Record & self-review your answers"
          gradient="from-blue-500 to-cyan-500"
          onToggle={toggle}
        />
        <ToolTile
          id="peer"
          active={activeTool === "peer"}
          icon={Users}
          title="Peer Mocks"
          desc="Practice with other students"
          gradient="from-orange-500 to-rose-500"
          onToggle={toggle}
        />
      </div>

      {/* ── Inline Tool Panels ── */}
      {activeTool === "ai-mock" && <AIMockPanel />}
      {activeTool === "voice" && <VoicePanel />}
      {activeTool === "video" && <VideoPanel />}
      {activeTool === "peer" && <PeerPanel />}

      {/* ── Question Bank ── */}
      <div className="mt-10 space-y-6">
        <h2 className="text-xl font-bold">📚 Question Bank</h2>
        {Object.entries(QUESTION_BANK).map(([cat, qs]) => (
          <CategorySection key={cat} category={cat} questions={qs} />
        ))}
      </div>
    </AppShell>
  );
}

/* ─────────────────────── TOOL TILE ──── */
function ToolTile({
  id, active, icon: Icon, title, desc, gradient, badge, onToggle,
}: {
  id: ActiveTool; active: boolean; icon: React.ComponentType<{ className?: string }>;
  title: string; desc: string; gradient: string; badge?: string; onToggle: (t: ActiveTool) => void;
}) {
  return (
    <button
      onClick={() => onToggle(id)}
      className={cn(
        "glass-card rounded-2xl p-5 text-left transition-all relative group border",
        active
          ? "border-primary/60 shadow-elegant -translate-y-1 bg-primary/5"
          : "border-white/5 hover:border-primary/30 hover:-translate-y-1",
      )}
    >
      {badge && (
        <span className="absolute -top-2 -right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
          {badge}
        </span>
      )}
      <div className={`size-11 rounded-xl bg-gradient-to-br ${gradient} grid place-items-center mb-3`}>
        <Icon className="size-5 text-white" />
      </div>
      <p className="font-bold">{title}</p>
      <p className="text-xs text-muted-foreground mt-1">{desc}</p>
      <p className={cn("mt-3 text-xs font-semibold flex items-center gap-1 transition-all", active ? "text-primary" : "text-primary opacity-0 group-hover:opacity-100")}>
        {active ? "▲ Close" : "▼ Open"} <ChevronRight className="size-3" />
      </p>
    </button>
  );
}

/* ─────────────────────── AI MOCK PANEL ──── */
function AIMockPanel() {
  const allQ = Object.entries(QUESTION_BANK).flatMap(([cat, qs]) =>
    qs.map((q) => ({ ...q, category: cat })),
  );
  const [cat, setCat] = useState("All");
  const questions = cat === "All" ? allQ : QUESTION_BANK[cat].map((q) => ({ ...q, category: cat }));
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [timerOn, setTimerOn] = useState(false);
  const [results, setResults] = useState<{ q: string; score: number }[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!timerOn) return;
    if (timeLeft <= 0) { setTimerOn(false); doSubmit(); return; }
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timerOn, timeLeft]);

  function doSubmit() {
    setTimerOn(false);
    setSubmitted(true);
    const words = answer.trim().split(/\s+/).filter(Boolean).length;
    const s = Math.min(10, Math.round((words / 60) * 10));
    setScore(s);
    setResults((r) => [...r, { q: questions[idx].q, score: s }]);
  }

  function next() {
    if (idx >= questions.length - 1) { setDone(true); return; }
    setIdx((i) => i + 1);
    setAnswer(""); setSubmitted(false); setScore(0); setTimeLeft(120); setTimerOn(false);
  }

  function restart() {
    setIdx(0); setAnswer(""); setSubmitted(false); setScore(0);
    setTimeLeft(120); setTimerOn(false); setResults([]); setDone(false);
  }

  const avg = results.length ? Math.round(results.reduce((s, r) => s + r.score, 0) / results.length) : 0;

  return (
    <div className="mt-6 glass-card rounded-2xl border border-violet-500/20 bg-violet-500/3 overflow-hidden">
      <div className="p-6 border-b border-white/5 flex items-center gap-3">
        <div className="size-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 grid place-items-center">
          <Brain className="size-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold">AI Mock Interview</h3>
          <p className="text-xs text-muted-foreground">Answer in 2 minutes • Get instant score & sample answer</p>
        </div>
        {/* Category Filter */}
        <div className="ml-auto flex gap-2 flex-wrap">
          {["All", ...Object.keys(QUESTION_BANK)].map((c) => (
            <button key={c} onClick={() => { setCat(c); restart(); }}
              className={cn("px-3 py-1 rounded-lg text-xs font-semibold transition-all", cat === c ? "bg-primary text-primary-foreground" : "bg-white/5 text-muted-foreground hover:bg-white/10")}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {done ? (
          /* Results */
          <div className="text-center">
            <div className="size-16 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 grid place-items-center mx-auto mb-3">
              <Star className="size-7 text-white" />
            </div>
            <h3 className="text-xl font-bold">Session Complete!</h3>
            <p className="text-muted-foreground text-sm mt-1">{results.length} questions answered</p>
            <div className="grid grid-cols-3 gap-4 mt-5 max-w-sm mx-auto">
              <div className="glass-card rounded-xl p-3 text-center"><p className="text-xl font-bold gradient-text">{results.length}</p><p className="text-xs text-muted-foreground">Questions</p></div>
              <div className="glass-card rounded-xl p-3 text-center"><p className="text-xl font-bold gradient-text">{avg}/10</p><p className="text-xs text-muted-foreground">Avg Score</p></div>
              <div className="glass-card rounded-xl p-3 text-center">
                <p className={cn("text-xl font-bold", avg >= 7 ? "text-emerald-400" : avg >= 4 ? "text-yellow-400" : "text-rose-400")}>{avg >= 7 ? "Great" : avg >= 4 ? "OK" : "Practice"}</p>
                <p className="text-xs text-muted-foreground">Result</p>
              </div>
            </div>
            <Button variant="hero" className="mt-5" onClick={restart}><RotateCcw className="size-4 mr-1" /> Try Again</Button>
          </div>
        ) : (
          /* Question */
          <div className="max-w-2xl">
            {/* Progress */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-primary rounded-full transition-all" style={{ width: `${((idx + 1) / questions.length) * 100}%` }} />
              </div>
              <span className="text-xs text-muted-foreground">{idx + 1}/{questions.length}</span>
              {/* Timer */}
              <div className={cn("flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-bold ml-2", timerOn ? (timeLeft < 30 ? "bg-rose-500/20 text-rose-400" : "bg-violet-500/10 text-violet-400") : "bg-white/5 text-muted-foreground")}>
                <Timer className="size-3.5" />
                {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
              </div>
            </div>

            <span className="text-xs font-bold uppercase tracking-widest text-violet-400">{questions[idx].category}</span>
            <p className="text-lg font-bold mt-1 mb-3">{questions[idx].q}</p>

            <div className="flex items-start gap-2 text-xs text-yellow-400 bg-yellow-500/10 rounded-lg p-3 mb-4">
              <Lightbulb className="size-3.5 shrink-0 mt-0.5" /> {questions[idx].hint}
            </div>

            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={submitted}
              placeholder="Type your detailed answer here…"
              className="w-full h-32 bg-background/50 border border-white/10 rounded-xl p-4 text-sm resize-none focus:outline-none focus:border-violet-500/50 transition-colors"
            />

            {submitted && (
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full", score >= 7 ? "bg-emerald-500" : score >= 4 ? "bg-yellow-500" : "bg-rose-500")} style={{ width: `${score * 10}%` }} />
                  </div>
                  <span className={cn("text-sm font-bold", score >= 7 ? "text-emerald-400" : score >= 4 ? "text-yellow-400" : "text-rose-400")}>{score}/10</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {score >= 7 ? "✅ Great answer!" : score >= 4 ? "⚠️ Good start — add more specifics." : "❌ Too brief. Aim for 60+ words."}
                </p>
                <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/10 p-4">
                  <p className="text-xs font-bold text-emerald-400 mb-1 flex items-center gap-1"><BookOpen className="size-3" /> Sample Answer</p>
                  <p className="text-xs text-muted-foreground">{questions[idx].sampleAnswer}</p>
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-5">
              {!timerOn && !submitted && (
                <Button variant="outline" onClick={() => { setTimeLeft(120); setTimerOn(true); }} className="gap-2">
                  <Timer className="size-4" /> Start Timer
                </Button>
              )}
              {idx > 0 && !submitted && (
                <Button variant="outline" onClick={() => { setIdx((i) => i - 1); setAnswer(""); setSubmitted(false); setScore(0); setTimeLeft(120); setTimerOn(false); }}>
                  <ChevronLeft className="size-4" />
                </Button>
              )}
              {!submitted ? (
                <Button variant="hero" className="flex-1" onClick={doSubmit} disabled={!answer.trim()}>Submit Answer</Button>
              ) : (
                <Button variant="hero" className="flex-1" onClick={next}>
                  {idx >= questions.length - 1 ? "See Results" : "Next Question"} <ChevronRight className="size-4" />
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────── VOICE DRILLS PANEL ──── */
function VoicePanel() {
  const questions = QUESTION_BANK["Behavioral"];
  const [idx, setIdx] = useState(0);
  const [recording, setRecording] = useState(false);
  const [done, setDone] = useState(false);
  const [secs, setSecs] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function toggleRecord() {
    if (recording) {
      clearInterval(timerRef.current!);
      setRecording(false);
      setDone(true);
    } else {
      setDone(false);
      setSecs(0);
      setRecording(true);
      timerRef.current = setInterval(() => setSecs((s) => s + 1), 1000);
    }
  }

  const current = questions[idx];

  return (
    <div className="mt-6 glass-card rounded-2xl border border-emerald-500/20 bg-emerald-500/3 overflow-hidden">
      <div className="p-6 border-b border-white/5 flex items-center gap-3">
        <div className="size-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 grid place-items-center">
          <Mic className="size-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold">Voice Drills</h3>
          <p className="text-xs text-muted-foreground">Read the question aloud and record your answer. Aim for 45–90 seconds.</p>
        </div>
        <div className="ml-auto text-xs text-muted-foreground">{idx + 1} / {questions.length}</div>
      </div>

      <div className="p-6 max-w-2xl">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Behavioral</span>
        <p className="text-lg font-bold mt-1 mb-3">{current.q}</p>
        <div className="flex items-start gap-2 text-xs text-yellow-400 bg-yellow-500/10 rounded-lg p-3 mb-6">
          <Lightbulb className="size-3.5 shrink-0 mt-0.5" /> {current.hint}
        </div>

        <div className="flex flex-col items-center gap-4">
          <button
            onClick={toggleRecord}
            className={cn("size-20 rounded-full grid place-items-center transition-all text-white", recording ? "bg-rose-500 shadow-[0_0_30px_rgba(239,68,68,0.4)] animate-pulse" : "bg-gradient-to-br from-emerald-500 to-teal-500 hover:scale-105")}
          >
            <Mic className="size-8" />
          </button>
          <p className="text-sm font-semibold text-center">
            {recording ? `🔴 Recording… ${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}` : done ? `✅ Done — spoke for ${secs}s` : "Tap mic to start recording"}
          </p>
          {done && (
            <div className={cn("text-sm font-medium px-4 py-2 rounded-xl", secs >= 45 ? "bg-emerald-500/15 text-emerald-400" : "bg-yellow-500/15 text-yellow-400")}>
              {secs >= 90 ? "🎉 Excellent detail!" : secs >= 45 ? "✅ Good length!" : "⚠️ Try to speak for at least 45 seconds"}
            </div>
          )}
        </div>

        {done && (
          <div className="mt-5 rounded-xl bg-white/3 border border-white/5 p-4">
            <p className="text-xs font-bold text-emerald-400 mb-1 flex items-center gap-1"><ThumbsUp className="size-3" /> Sample Answer Guide</p>
            <p className="text-xs text-muted-foreground">{current.sampleAnswer}</p>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={() => { setDone(false); setSecs(0); setRecording(false); clearInterval(timerRef.current!); }}>
            <RotateCcw className="size-4 mr-1" /> Reset
          </Button>
          <Button variant="outline" disabled={idx === 0} onClick={() => { setIdx((i) => i - 1); setDone(false); setSecs(0); setRecording(false); }}>
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="hero" className="flex-1" onClick={() => { setIdx((i) => (i + 1) % questions.length); setDone(false); setSecs(0); setRecording(false); }}>
            Next Question <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── VIDEO PRACTICE PANEL ──── */
function VideoPanel() {
  const questions = [...QUESTION_BANK["Technical"], ...QUESTION_BANK["HR"]];
  const [idx, setIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [active, setActive] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!active) return;
    if (timeLeft <= 0) { setActive(false); setDone(true); return; }
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [active, timeLeft]);

  function nav(dir: number) {
    setIdx((i) => (i + dir + questions.length) % questions.length);
    setDone(false); setActive(false); setTimeLeft(120);
  }

  return (
    <div className="mt-6 glass-card rounded-2xl border border-blue-500/20 bg-blue-500/3 overflow-hidden">
      <div className="p-6 border-b border-white/5 flex items-center gap-3">
        <div className="size-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 grid place-items-center">
          <Video className="size-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold">Video Practice</h3>
          <p className="text-xs text-muted-foreground">Set the 2-min timer, record yourself, then self-review using the checklist.</p>
        </div>
        <div className="ml-auto text-xs text-muted-foreground">{idx + 1} / {questions.length}</div>
      </div>

      <div className="p-6 max-w-2xl">
        {/* Mock camera placeholder */}
        <div className="w-full h-36 rounded-xl bg-white/3 border border-white/10 grid place-items-center mb-5">
          <div className="text-center">
            <Video className="size-10 text-muted-foreground mx-auto mb-2 opacity-30" />
            <p className="text-xs text-muted-foreground">Use your system camera or</p>
            <a href="https://www.loom.com" target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs text-primary font-semibold hover:underline">
              Open Loom <ExternalLink className="size-3" />
            </a>
          </div>
        </div>

        <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Question {idx + 1}</span>
        <p className="text-lg font-bold mt-1 mb-3">{questions[idx].q}</p>
        <div className="flex items-start gap-2 text-xs text-yellow-400 bg-yellow-500/10 rounded-lg p-3 mb-5">
          <Lightbulb className="size-3.5 shrink-0 mt-0.5" /> {questions[idx].hint}
        </div>

        <div className="flex items-center justify-between mb-5">
          <div className={cn("flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold", active ? "bg-rose-500/20 text-rose-400" : done ? "bg-emerald-500/15 text-emerald-400" : "bg-white/5 text-muted-foreground")}>
            <Timer className="size-4" />{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
          </div>
          {!active ? (
            <Button variant="hero" onClick={() => { setTimeLeft(120); setActive(true); setDone(false); }}>{done ? "Retake" : "Start Timer"}</Button>
          ) : (
            <Button variant="outline" onClick={() => { setActive(false); setDone(true); }}>Stop</Button>
          )}
        </div>

        {done && (
          <div className="rounded-xl bg-blue-500/5 border border-blue-500/10 p-4 mb-4">
            <p className="text-xs font-bold text-blue-400 mb-2">Self-Review Checklist</p>
            {[
              "Did I structure my answer? (Situation → Action → Result)",
              "Did I speak confidently without too many filler words?",
              "Did I make eye contact with the camera?",
              "Was my answer 60–90 seconds long?",
            ].map((c) => (
              <label key={c} className="flex items-center gap-2 text-xs text-muted-foreground mt-2 cursor-pointer">
                <input type="checkbox" className="rounded accent-primary" /> {c}
              </label>
            ))}
          </div>
        )}

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => nav(-1)}><ChevronLeft className="size-4" /></Button>
          <Button variant="hero" className="flex-1" onClick={() => nav(1)}>Next <ChevronRight className="size-4" /></Button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── PEER MOCKS PANEL ──── */
function PeerPanel() {
  return (
    <div className="mt-6 glass-card rounded-2xl border border-orange-500/20 bg-orange-500/3 overflow-hidden">
      <div className="p-6 border-b border-white/5 flex items-center gap-3">
        <div className="size-9 rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 grid place-items-center">
          <Users className="size-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold">Peer Mock Sessions</h3>
          <p className="text-xs text-muted-foreground">Join a mock session with another student. Take turns as interviewer and interviewee.</p>
        </div>
      </div>

      <div className="p-6">
        <div className="grid sm:grid-cols-2 gap-3 mb-6">
          {PEER_ROOMS.map((room, i) => (
            <div key={i} className="rounded-xl border border-white/5 bg-background/40 p-4 flex items-center gap-3 hover:border-orange-500/20 transition-all">
              <div className="size-9 rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 grid place-items-center shrink-0">
                <MessageSquare className="size-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">{room.company} — {room.type}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  {room.participants} student{room.participants !== 1 ? "s" : ""} waiting
                </p>
              </div>
              <Button variant="hero" size="sm" asChild>
                <a href={room.url} target="_blank" rel="noopener noreferrer">Join <ExternalLink className="size-3 ml-1" /></a>
              </Button>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/5 to-accent/5 p-5 text-center">
          <Sparkles className="size-7 text-primary mx-auto mb-2" />
          <h3 className="font-bold">Host Your Own Session</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">Create a Google Meet link and share with a peer. Use the Question Bank below as your guide.</p>
          <Button variant="hero" asChild>
            <a href="https://meet.google.com/new" target="_blank" rel="noopener noreferrer">Create Google Meet <ExternalLink className="size-4 ml-1" /></a>
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── QUESTION BANK SECTION ──── */
function CategorySection({
  category, questions,
}: { category: string; questions: { q: string; hint: string; sampleAnswer: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const colors: Record<string, string> = {
    Technical: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    HR: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    Behavioral: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  };

  return (
    <div>
      <div className={cn("inline-flex items-center gap-2 text-sm font-bold px-3 py-1.5 rounded-full border mb-3", colors[category])}>
        {category === "Technical" ? <Target className="size-3.5" /> : category === "HR" ? <Trophy className="size-3.5" /> : <Star className="size-3.5" />}
        {category} Questions
      </div>
      <div className="space-y-2">
        {questions.map((item, i) => (
          <div key={i} className="glass-card rounded-xl border border-white/5 overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full p-4 flex items-start gap-3 text-left hover:bg-white/2 transition-colors"
            >
              <span className="size-7 rounded-full bg-gradient-primary text-primary-foreground text-xs font-bold grid place-items-center shrink-0">{i + 1}</span>
              <p className="text-sm flex-1">{item.q}</p>
              <ChevronRight className={cn("size-4 text-muted-foreground shrink-0 mt-0.5 transition-transform", open === i && "rotate-90")} />
            </button>
            {open === i && (
              <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-3">
                <div className="flex items-start gap-2 text-xs text-yellow-400 bg-yellow-500/10 rounded-lg p-3">
                  <Lightbulb className="size-3.5 shrink-0 mt-0.5" /> {item.hint}
                </div>
                <div className="flex items-start gap-2 text-xs text-muted-foreground bg-white/3 rounded-lg p-3">
                  <ThumbsUp className="size-3.5 shrink-0 mt-0.5 text-emerald-400" /> {item.sampleAnswer}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
