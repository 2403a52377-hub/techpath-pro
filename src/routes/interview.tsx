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
  XCircle,
  Timer,
  Sparkles,
  Star,
  ExternalLink,
  Lightbulb,
  BookOpen,
  MessageSquare,
  ThumbsUp,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/interview")({ component: InterviewPrep });

/* ─────────────────────────────────────────────── DATA ──── */

const QUESTION_BANK: Record<string, { q: string; hint: string; sampleAnswer: string }[]> = {
  Technical: [
    {
      q: "Reverse a linked list — explain both iterative and recursive approach.",
      hint: "Think about pointer manipulation and base cases for recursion.",
      sampleAnswer:
        "Iterative: Use three pointers (prev, curr, next). Traverse the list, reversing links one by one. Recursive: Base case is null or single node. Recurse to the tail, then reverse links on the way back.",
    },
    {
      q: "Design a URL shortener system (system design).",
      hint: "Think about: unique ID generation, hashing, database schema, scalability.",
      sampleAnswer:
        "Use a key-value store mapping short codes to URLs. Generate short codes via base62 encoding of an auto-increment ID. Use Redis for caching hot URLs. CDN for global low latency.",
    },
    {
      q: "What is the difference between SQL and NoSQL? When would you use each?",
      hint: "Consider data structure, scalability, consistency, and use cases.",
      sampleAnswer:
        "SQL: structured schema, ACID transactions, great for relational data (banking, ERP). NoSQL: flexible schema, horizontal scaling, great for unstructured data (social feeds, real-time analytics).",
    },
    {
      q: "Explain how React's virtual DOM works and why it's efficient.",
      hint: "Focus on reconciliation and diffing algorithm.",
      sampleAnswer:
        "React keeps a lightweight in-memory copy of the DOM. On state change, it creates a new virtual DOM tree, diffs it against the previous one using its reconciliation algorithm, and only updates the actual DOM where differences exist.",
    },
    {
      q: "What happens when you type 'google.com' and press Enter?",
      hint: "Cover: DNS, TCP/IP, TLS, HTTP request/response.",
      sampleAnswer:
        "1. DNS resolves google.com → IP. 2. TCP 3-way handshake. 3. TLS handshake (HTTPS). 4. Browser sends HTTP GET. 5. Server responds with HTML. 6. Browser parses HTML, fetches assets, renders.",
    },
    {
      q: "Explain time and space complexity. What is Big O notation?",
      hint: "Use examples: O(1), O(log n), O(n), O(n²).",
      sampleAnswer:
        "Big O describes worst-case algorithm performance as input size grows. O(1) = constant time (array access). O(log n) = binary search. O(n) = linear scan. O(n²) = nested loops. It helps compare algorithm efficiency.",
    },
  ],
  HR: [
    {
      q: "Tell me about yourself.",
      hint: "Structure: Present → Past → Future. Keep it under 2 minutes.",
      sampleAnswer:
        "Start with your current academic year and branch, mention key technical skills you've built, reference a notable project or achievement, and end with what you're looking for in this role.",
    },
    {
      q: "Why do you want to join our company?",
      hint: "Research the company! Mention specific products, culture, or values.",
      sampleAnswer:
        "Show genuine interest — mention a specific product they build, a technology they use, or a cultural value that resonates with you. Tie it to how it aligns with your career goals.",
    },
    {
      q: "Where do you see yourself in 5 years?",
      hint: "Be ambitious but realistic. Align with the company's growth.",
      sampleAnswer:
        "In 5 years, I see myself as a strong senior engineer who has shipped products that impact millions of users. I hope to grow technically through challenging projects and take on mentorship responsibilities.",
    },
    {
      q: "What is your greatest strength and weakness?",
      hint: "For weakness: be honest and show how you're actively improving.",
      sampleAnswer:
        "Strength: Problem solving — I enjoy breaking down complex problems systematically. Weakness: I used to struggle with time management during projects, but I now use task trackers like Notion and time-box my work.",
    },
    {
      q: "Describe a time you handled pressure or a tight deadline.",
      hint: "Use the STAR method: Situation, Task, Action, Result.",
      sampleAnswer:
        "During our college hackathon, we lost 6 hours due to a server crash 12 hours before submission. I reprioritized our MVP features, divided tasks clearly, and we shipped a working demo on time, winning 2nd place.",
    },
  ],
  Behavioral: [
    {
      q: "Describe a time you faced a conflict in your team and how you resolved it.",
      hint: "Focus on communication, empathy, and outcome.",
      sampleAnswer:
        "In a team project, two members disagreed on the tech stack. I organized a short meeting, let both explain their reasoning, then we evaluated both options against our deadline and resources. We chose the simpler one and shipped on time.",
    },
    {
      q: "Tell me about a failure and what you learned from it.",
      hint: "Interviewers value self-awareness. Be honest about the failure.",
      sampleAnswer:
        "In my 2nd year, I underestimated the complexity of a project and missed a college deadline. I learned to break projects into milestones, estimate more carefully, and always add buffer time.",
    },
    {
      q: "How do you prioritize tasks when you have multiple deadlines?",
      hint: "Mention a framework: Eisenhower Matrix, MoSCoW, or time-boxing.",
      sampleAnswer:
        "I use impact vs. urgency to rank tasks. High-impact, urgent tasks first. I use a to-do app to track deadlines and do a weekly review to re-prioritize based on new information.",
    },
    {
      q: "Tell me about your most impactful project.",
      hint: "Quantify impact: users, performance improvements, revenue saved.",
      sampleAnswer:
        "I built a college event management portal that was adopted by 3 departments, handling 500+ event registrations. I used React + Node.js, handled authentication, and reduced manual paperwork by 80%.",
    },
    {
      q: "Describe a time you led without formal authority.",
      hint: "Focus on influence, communication, and earned respect.",
      sampleAnswer:
        "During a group project, our assigned leader was inactive. I stepped up by creating a shared task board, holding daily stand-ups, and ensuring everyone was unblocked. We delivered the project on time with positive feedback.",
    },
  ],
};

const PEER_MOCK_ROOMS = [
  {
    company: "TCS",
    type: "Technical Round",
    participants: 3,
    status: "Open",
    url: "https://meet.google.com/new",
  },
  {
    company: "Infosys",
    type: "HR Round",
    participants: 2,
    status: "Open",
    url: "https://meet.google.com/new",
  },
  {
    company: "Amazon",
    type: "System Design",
    participants: 1,
    status: "Open",
    url: "https://meet.google.com/new",
  },
  {
    company: "General",
    type: "Behavioral Round",
    participants: 4,
    status: "Open",
    url: "https://meet.google.com/new",
  },
];

/* ─────────────────────────────────────────────── MAIN PAGE ──── */

type Mode = "home" | "ai-mock" | "voice-drills" | "video-practice" | "peer-mocks";

function InterviewPrep() {
  const [mode, setMode] = useState<Mode>("home");

  if (mode === "ai-mock") return <AIMockInterviewer onBack={() => setMode("home")} />;
  if (mode === "voice-drills") return <VoiceDrills onBack={() => setMode("home")} />;
  if (mode === "video-practice") return <VideoPractice onBack={() => setMode("home")} />;
  if (mode === "peer-mocks") return <PeerMocks onBack={() => setMode("home")} />;

  return (
    <AppShell>
      <PageHeader
        title="Interview Preparation"
        subtitle="Technical, HR, behavioral questions plus AI mock interview simulator with feedback reports."
      />

      {/* Feature Tiles */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <FeatureTile
          icon={Brain}
          title="AI Mock Interview"
          desc="Timed Q&A with instant AI feedback"
          gradient="from-violet-500 to-purple-600"
          onClick={() => setMode("ai-mock")}
          badge="Most Popular"
        />
        <FeatureTile
          icon={Video}
          title="Video Practice"
          desc="Record & review your answers"
          gradient="from-blue-500 to-cyan-500"
          onClick={() => setMode("video-practice")}
        />
        <FeatureTile
          icon={Mic}
          title="Voice Drills"
          desc="HR & behavioral round practice"
          gradient="from-emerald-500 to-teal-500"
          onClick={() => setMode("voice-drills")}
        />
        <FeatureTile
          icon={Users}
          title="Peer Mocks"
          desc="Practice with other students"
          gradient="from-orange-500 to-rose-500"
          onClick={() => setMode("peer-mocks")}
        />
      </div>

      {/* Question Bank Preview */}
      <div className="mt-10 space-y-6">
        {Object.entries(QUESTION_BANK).map(([cat, qs]) => (
          <section key={cat}>
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
              <span className="size-6 rounded-full bg-gradient-primary text-primary-foreground text-xs font-bold grid place-items-center">
                {cat[0]}
              </span>
              {cat} Questions
            </h2>
            <div className="space-y-2">
              {qs.slice(0, 3).map((item, i) => (
                <QuestionCard key={i} index={i + 1} item={item} />
              ))}
            </div>
            <button
              onClick={() => setMode("ai-mock")}
              className="mt-3 text-sm text-primary font-semibold flex items-center gap-1 hover:gap-2 transition-all"
            >
              Practice all {cat} questions <ChevronRight className="size-4" />
            </button>
          </section>
        ))}
      </div>
    </AppShell>
  );
}

/* ─────────────────────────────────────────────── SUB-COMPONENTS ──── */

function FeatureTile({
  icon: Icon,
  title,
  desc,
  gradient,
  onClick,
  badge,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  gradient: string;
  onClick: () => void;
  badge?: string;
}) {
  return (
    <button
      onClick={onClick}
      className="glass-card rounded-2xl p-5 hover:shadow-elegant hover:-translate-y-1 transition-all text-left relative group"
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
      <p className="mt-3 text-xs text-primary font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        Start now <ChevronRight className="size-3" />
      </p>
    </button>
  );
}

function QuestionCard({
  index,
  item,
}: {
  index: number;
  item: { q: string; hint: string; sampleAnswer: string };
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="glass-card rounded-xl border border-white/5 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-start gap-3 text-left hover:bg-white/2 transition-colors"
      >
        <span className="size-7 rounded-full bg-gradient-primary text-primary-foreground text-xs font-bold grid place-items-center shrink-0">
          {index}
        </span>
        <p className="text-sm flex-1">{item.q}</p>
        <ChevronRight className={cn("size-4 text-muted-foreground shrink-0 mt-0.5 transition-transform", expanded && "rotate-90")} />
      </button>
      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-3">
          <div className="flex items-start gap-2 text-xs text-yellow-400 bg-yellow-500/10 rounded-lg p-3">
            <Lightbulb className="size-3.5 shrink-0 mt-0.5" />
            <span>{item.hint}</span>
          </div>
          <div className="flex items-start gap-2 text-xs text-muted-foreground bg-white/3 rounded-lg p-3">
            <ThumbsUp className="size-3.5 shrink-0 mt-0.5 text-emerald-400" />
            <span>{item.sampleAnswer}</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────── AI MOCK INTERVIEWER ──── */

function AIMockInterviewer({ onBack }: { onBack: () => void }) {
  const allCategories = Object.keys(QUESTION_BANK) as (keyof typeof QUESTION_BANK)[];
  const allQuestions = allCategories.flatMap((cat) =>
    QUESTION_BANK[cat].map((q) => ({ ...q, category: cat })),
  );

  const [category, setCategory] = useState<string>("All");
  const [qIndex, setQIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [timerActive, setTimerActive] = useState(false);
  const [history, setHistory] = useState<{ q: string; a: string; score: number }[]>([]);
  const [sessionDone, setSessionDone] = useState(false);

  const questions =
    category === "All" ? allQuestions : QUESTION_BANK[category as keyof typeof QUESTION_BANK].map((q) => ({ ...q, category }));

  const currentQ = questions[qIndex];

  const tick = useCallback(() => {
    setTimeLeft((t) => {
      if (t <= 1) {
        setTimerActive(false);
        handleSubmit();
        return 0;
      }
      return t - 1;
    });
  }, []);

  useEffect(() => {
    if (!timerActive) return;
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [timerActive, tick]);

  function startTimer() {
    setTimeLeft(120);
    setTimerActive(true);
  }

  function handleSubmit() {
    setTimerActive(false);
    setSubmitted(true);
    // Simple scoring: award points based on answer length (proxy for effort)
    const words = answer.trim().split(/\s+/).filter(Boolean).length;
    const earnedScore = Math.min(10, Math.round((words / 60) * 10));
    setScore(earnedScore);
    setHistory((h) => [...h, { q: currentQ.q, a: answer, score: earnedScore }]);
  }

  function nextQuestion() {
    if (qIndex >= questions.length - 1) {
      setSessionDone(true);
      return;
    }
    setQIndex((i) => i + 1);
    setAnswer("");
    setSubmitted(false);
    setScore(0);
    setTimeLeft(120);
    setTimerActive(false);
  }

  function restart() {
    setQIndex(0);
    setAnswer("");
    setSubmitted(false);
    setScore(0);
    setTimeLeft(120);
    setTimerActive(false);
    setHistory([]);
    setSessionDone(false);
  }

  if (sessionDone) {
    const avg = history.length ? Math.round(history.reduce((s, h) => s + h.score, 0) / history.length) : 0;
    return (
      <AppShell>
        <div className="max-w-2xl mx-auto py-8">
          <button onClick={onBack} className="text-sm text-muted-foreground flex items-center gap-1 mb-6 hover:text-foreground">
            <ChevronLeft className="size-4" /> Back to Interview Prep
          </button>
          <div className="glass-card rounded-2xl p-8 text-center">
            <div className="size-16 rounded-full bg-gradient-primary grid place-items-center mx-auto mb-4">
              <Trophy className="size-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold">Session Complete!</h2>
            <p className="text-muted-foreground mt-1">You answered {history.length} questions</p>
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="glass-card rounded-xl p-4">
                <p className="text-2xl font-bold gradient-text">{history.length}</p>
                <p className="text-xs text-muted-foreground">Questions</p>
              </div>
              <div className="glass-card rounded-xl p-4">
                <p className="text-2xl font-bold gradient-text">{avg}/10</p>
                <p className="text-xs text-muted-foreground">Avg Score</p>
              </div>
              <div className="glass-card rounded-xl p-4">
                <p className="text-2xl font-bold gradient-text">{avg >= 7 ? "Good" : avg >= 4 ? "OK" : "Practice More"}</p>
                <p className="text-xs text-muted-foreground">Result</p>
              </div>
            </div>
            <div className="mt-6 space-y-3 text-left">
              <h3 className="font-bold text-sm">Review Your Answers</h3>
              {history.map((h, i) => (
                <div key={i} className="rounded-xl bg-white/3 border border-white/5 p-4">
                  <p className="text-sm font-medium">{h.q}</p>
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{h.a || "(No answer)"}</p>
                  <p className={cn("text-xs font-bold mt-2", h.score >= 7 ? "text-emerald-400" : h.score >= 4 ? "text-yellow-400" : "text-rose-400")}>
                    Score: {h.score}/10
                  </p>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1" onClick={restart}>
                <RotateCcw className="size-4 mr-2" /> Retry
              </Button>
              <Button variant="hero" className="flex-1" onClick={onBack}>
                Done
              </Button>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto py-8">
        <button onClick={onBack} className="text-sm text-muted-foreground flex items-center gap-1 mb-6 hover:text-foreground">
          <ChevronLeft className="size-4" /> Back
        </button>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="size-6 text-primary" /> AI Mock Interview
          </h1>
          <div className="flex gap-2">
            {["All", ...Object.keys(QUESTION_BANK)].map((c) => (
              <button
                key={c}
                onClick={() => { setCategory(c); setQIndex(0); setAnswer(""); setSubmitted(false); setTimerActive(false); setTimeLeft(120); }}
                className={cn("px-3 py-1.5 rounded-lg text-xs font-semibold transition-all", category === c ? "bg-primary text-primary-foreground" : "bg-white/5 text-muted-foreground hover:bg-white/10")}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-primary rounded-full transition-all" style={{ width: `${((qIndex + 1) / questions.length) * 100}%` }} />
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">{qIndex + 1}/{questions.length}</span>
        </div>

        {/* Question Card */}
        <div className="glass-card rounded-2xl p-6 border border-white/5">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary">{currentQ.category}</span>
              <h2 className="text-lg font-bold mt-1">{currentQ.q}</h2>
            </div>
            <div className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold shrink-0", timerActive ? (timeLeft < 30 ? "bg-rose-500/20 text-rose-400" : "bg-primary/10 text-primary") : "bg-white/5 text-muted-foreground")}>
              <Timer className="size-4" />
              {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
            </div>
          </div>

          {/* Hint */}
          <div className="flex items-start gap-2 text-xs text-yellow-400 bg-yellow-500/10 rounded-lg p-3 mb-4">
            <Lightbulb className="size-3.5 shrink-0 mt-0.5" />
            <span>{currentQ.hint}</span>
          </div>

          {/* Answer Area */}
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={submitted}
            placeholder="Type your answer here... Be as detailed as possible."
            className="w-full h-36 bg-background/50 border border-white/10 rounded-xl p-4 text-sm resize-none focus:outline-none focus:border-primary/50 transition-colors"
          />

          {/* Submitted Feedback */}
          {submitted && (
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full transition-all", score >= 7 ? "bg-emerald-500" : score >= 4 ? "bg-yellow-500" : "bg-rose-500")} style={{ width: `${score * 10}%` }} />
                </div>
                <span className={cn("text-sm font-bold", score >= 7 ? "text-emerald-400" : score >= 4 ? "text-yellow-400" : "text-rose-400")}>
                  {score}/10
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {score >= 7 ? "✅ Great answer! Clear and detailed." : score >= 4 ? "⚠️ Decent start. Try to add more specifics and examples." : "❌ Too brief. Aim for 3–5 sentences minimum."}
              </p>
              <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/10 p-4">
                <p className="text-xs font-bold text-emerald-400 mb-1 flex items-center gap-1"><BookOpen className="size-3" /> Sample Answer</p>
                <p className="text-xs text-muted-foreground">{currentQ.sampleAnswer}</p>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 mt-5">
            {!timerActive && !submitted && (
              <Button variant="outline" onClick={startTimer} className="gap-2">
                <Timer className="size-4" /> Start Timer
              </Button>
            )}
            {!submitted ? (
              <Button variant="hero" className="flex-1" onClick={handleSubmit} disabled={!answer.trim()}>
                Submit Answer
              </Button>
            ) : (
              <Button variant="hero" className="flex-1" onClick={nextQuestion}>
                {qIndex >= questions.length - 1 ? "See Results" : "Next Question"} <ChevronRight className="size-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Trophy({ className }: { className?: string }) {
  return <Star className={className} />;
}

/* ─────────────────────────────────── VOICE DRILLS ──── */

function VoiceDrills({ onBack }: { onBack: () => void }) {
  const drills = QUESTION_BANK["Behavioral"];
  const [idx, setIdx] = useState(0);
  const [recording, setRecording] = useState(false);
  const [done, setDone] = useState(false);
  const [timeSpoken, setTimeSpoken] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function toggleRecord() {
    if (recording) {
      clearInterval(timerRef.current!);
      setRecording(false);
      setDone(true);
    } else {
      setDone(false);
      setTimeSpoken(0);
      setRecording(true);
      timerRef.current = setInterval(() => setTimeSpoken((t) => t + 1), 1000);
    }
  }

  function next() {
    setIdx((i) => (i + 1) % drills.length);
    setDone(false);
    setTimeSpoken(0);
    setRecording(false);
  }

  const current = drills[idx];

  return (
    <AppShell>
      <div className="max-w-xl mx-auto py-8">
        <button onClick={onBack} className="text-sm text-muted-foreground flex items-center gap-1 mb-6 hover:text-foreground">
          <ChevronLeft className="size-4" /> Back
        </button>
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2"><Mic className="size-6 text-emerald-400" /> Voice Drills</h1>
        <p className="text-sm text-muted-foreground mb-6">Read the question aloud, then record yourself answering. Aim for 60–90 seconds.</p>

        <div className="glass-card rounded-2xl p-6 border border-white/5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Behavioral</span>
            <span className="text-xs text-muted-foreground">{idx + 1} / {drills.length}</span>
          </div>
          <h2 className="text-lg font-bold mb-3">{current.q}</h2>
          <div className="flex items-start gap-2 text-xs text-yellow-400 bg-yellow-500/10 rounded-lg p-3 mb-6">
            <Lightbulb className="size-3.5 shrink-0 mt-0.5" />
            {current.hint}
          </div>

          {/* Mic Area */}
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={toggleRecord}
              className={cn(
                "size-20 rounded-full grid place-items-center transition-all",
                recording
                  ? "bg-rose-500 shadow-[0_0_30px_rgba(239,68,68,0.5)] animate-pulse"
                  : "bg-gradient-to-br from-emerald-500 to-teal-500 hover:scale-105",
              )}
            >
              <Mic className="size-8 text-white" />
            </button>
            <p className="text-sm font-semibold">
              {recording ? `Recording… ${Math.floor(timeSpoken / 60)}:${String(timeSpoken % 60).padStart(2, "0")}` : done ? `Done! You spoke for ${timeSpoken}s` : "Tap to start recording"}
            </p>
            {done && (
              <div className={cn("text-sm font-medium px-4 py-2 rounded-xl", timeSpoken >= 45 ? "bg-emerald-500/15 text-emerald-400" : "bg-yellow-500/15 text-yellow-400")}>
                {timeSpoken >= 90 ? "🎉 Excellent detail!" : timeSpoken >= 45 ? "✅ Good length" : "⚠️ Try to speak for 45+ seconds"}
              </div>
            )}
          </div>

          {done && (
            <div className="mt-5 rounded-xl bg-white/3 border border-white/5 p-4">
              <p className="text-xs font-bold text-emerald-400 mb-1">Sample Answer Guide</p>
              <p className="text-xs text-muted-foreground">{current.sampleAnswer}</p>
            </div>
          )}

          <div className="flex gap-3 mt-5">
            <Button variant="outline" onClick={() => { setDone(false); setTimeSpoken(0); setRecording(false); }} className="flex-1">
              <RotateCcw className="size-4 mr-1" /> Reset
            </Button>
            <Button variant="hero" onClick={next} className="flex-1">
              Next Question <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

/* ─────────────────────────────────── VIDEO PRACTICE ──── */

function VideoPractice({ onBack }: { onBack: () => void }) {
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

  function start() { setTimeLeft(120); setActive(true); setDone(false); }

  return (
    <AppShell>
      <div className="max-w-xl mx-auto py-8">
        <button onClick={onBack} className="text-sm text-muted-foreground flex items-center gap-1 mb-6 hover:text-foreground">
          <ChevronLeft className="size-4" /> Back
        </button>
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2"><Video className="size-6 text-blue-400" /> Video Practice</h1>
        <p className="text-sm text-muted-foreground mb-6">Use your device camera app or Loom to record yourself answering. Then review and improve.</p>

        <div className="glass-card rounded-2xl p-6 border border-white/5">
          <div className="w-full h-40 rounded-xl bg-white/3 border border-white/10 grid place-items-center mb-5">
            <div className="text-center">
              <Video className="size-10 text-muted-foreground mx-auto mb-2 opacity-40" />
              <p className="text-xs text-muted-foreground">Use your system camera app or Loom to record</p>
              <a href="https://www.loom.com" target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs text-primary font-semibold hover:underline">
                Open Loom <ExternalLink className="size-3" />
              </a>
            </div>
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Question {idx + 1}</span>
          <h2 className="text-lg font-bold mt-1 mb-3">{questions[idx].q}</h2>

          <div className="flex items-start gap-2 text-xs text-yellow-400 bg-yellow-500/10 rounded-lg p-3 mb-5">
            <Lightbulb className="size-3.5 shrink-0 mt-0.5" /> {questions[idx].hint}
          </div>

          <div className="flex items-center justify-between mb-5">
            <div className={cn("flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold", active ? "bg-rose-500/20 text-rose-400" : done ? "bg-emerald-500/15 text-emerald-400" : "bg-white/5 text-muted-foreground")}>
              <Timer className="size-4" />
              {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
            </div>
            {!active ? (
              <Button variant="hero" onClick={start}>{done ? "Retake" : "Start Timer"}</Button>
            ) : (
              <Button variant="outline" onClick={() => { setActive(false); setDone(true); }}>Stop</Button>
            )}
          </div>

          {done && (
            <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/10 p-4 mb-4">
              <p className="text-xs font-bold text-emerald-400 mb-1">Self-Review Checklist</p>
              {["Did I structure my answer? (Situation → Action → Result)", "Did I speak confidently without too many filler words?", "Did I make eye contact with the camera?", "Was my answer 60–90 seconds long?"].map((c) => (
                <label key={c} className="flex items-center gap-2 text-xs text-muted-foreground mt-2 cursor-pointer">
                  <input type="checkbox" className="rounded accent-primary" />
                  {c}
                </label>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => { setIdx((i) => (i - 1 + questions.length) % questions.length); setDone(false); setActive(false); setTimeLeft(120); }}>
              <ChevronLeft className="size-4" /> Prev
            </Button>
            <Button variant="hero" className="flex-1" onClick={() => { setIdx((i) => (i + 1) % questions.length); setDone(false); setActive(false); setTimeLeft(120); }}>
              Next <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

/* ─────────────────────────────────── PEER MOCKS ──── */

function PeerMocks({ onBack }: { onBack: () => void }) {
  return (
    <AppShell>
      <div className="max-w-2xl mx-auto py-8">
        <button onClick={onBack} className="text-sm text-muted-foreground flex items-center gap-1 mb-6 hover:text-foreground">
          <ChevronLeft className="size-4" /> Back
        </button>
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2"><Users className="size-6 text-orange-400" /> Peer Mock Sessions</h1>
        <p className="text-sm text-muted-foreground mb-6">Join a mock session with other TechLand students. Practice interview roles — interviewer or interviewee.</p>

        <div className="space-y-3 mb-8">
          {PEER_MOCK_ROOMS.map((room, i) => (
            <div key={i} className="glass-card rounded-2xl p-5 flex items-center gap-4 border border-white/5 hover:border-primary/20 transition-all">
              <div className="size-10 rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 grid place-items-center shrink-0">
                <MessageSquare className="size-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-bold">{room.company} — {room.type}</p>
                <p className="text-xs text-muted-foreground">{room.participants} student{room.participants !== 1 ? "s" : ""} waiting</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-semibold text-emerald-400">{room.status}</span>
              </div>
              <Button variant="hero" size="sm" asChild>
                <a href={room.url} target="_blank" rel="noopener noreferrer">Join <ExternalLink className="size-3 ml-1" /></a>
              </Button>
            </div>
          ))}
        </div>

        <div className="glass-card rounded-2xl p-6 border border-primary/10 bg-gradient-to-br from-primary/5 to-accent/5 text-center">
          <Sparkles className="size-8 text-primary mx-auto mb-3" />
          <h3 className="font-bold text-lg">Host Your Own Mock Session</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">Create a Google Meet / Zoom link and share with a peer. Use our question bank as a guide.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button variant="hero" asChild>
              <a href="https://meet.google.com/new" target="_blank" rel="noopener noreferrer">Create Google Meet <ExternalLink className="size-4 ml-1" /></a>
            </Button>
            <Button variant="outline" onClick={onBack}>Browse Questions</Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
