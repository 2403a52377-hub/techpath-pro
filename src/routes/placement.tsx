import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "./roadmaps.index";
import { COMPANIES } from "@/lib/data";
import {
  Brain,
  Calculator,
  MessageSquareText,
  FileText,
  ArrowRight,
  ExternalLink,
  BookOpen,
  Target,
  Trophy,
  Clock,
  CheckCircle2,
  Play,
  ChevronRight,
  ChevronLeft,
  TrendingUp,
  Star,
  Zap,
  Users,
  Timer,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/placement")({ component: PlacementMain });

/* ─────────────────────────────────────────────────────────── QUIZ DATA ──── */

type QuizQuestion = {
  q: string;
  options: string[];
  answer: number;
  explanation: string;
};

const QUIZ_BANK: Record<string, QuizQuestion[]> = {
  "Quantitative Aptitude": [
    {
      q: "If 20% of a number is 40, what is 35% of that number?",
      options: ["60", "70", "80", "90"],
      answer: 1,
      explanation: "20% = 40 → number = 200. 35% of 200 = 70.",
    },
    {
      q: "A train 150m long passes a pole in 15 seconds. What is its speed in km/h?",
      options: ["30", "36", "40", "45"],
      answer: 1,
      explanation: "Speed = 150/15 = 10 m/s = 10 × 18/5 = 36 km/h.",
    },
    {
      q: "A man buys an article for ₹80 and sells it for ₹100. What is the profit %?",
      options: ["20%", "25%", "30%", "15%"],
      answer: 1,
      explanation: "Profit = 20. Profit% = (20/80) × 100 = 25%.",
    },
    {
      q: "If A can do a work in 10 days and B in 15 days, how many days together?",
      options: ["5", "6", "7", "8"],
      answer: 1,
      explanation: "Combined rate = 1/10 + 1/15 = 5/30 = 1/6. So 6 days.",
    },
    {
      q: "What is the probability of getting a head in a single coin flip?",
      options: ["1/4", "1/2", "1/3", "3/4"],
      answer: 1,
      explanation: "A fair coin has 2 outcomes. Heads = 1. P = 1/2.",
    },
    {
      q: "Find the LCM of 12 and 18.",
      options: ["24", "36", "48", "54"],
      answer: 1,
      explanation: "12 = 4×3, 18 = 2×9. LCM = 36.",
    },
    {
      q: "If the ratio of two numbers is 3:4 and their sum is 35, what is the larger number?",
      options: ["15", "20", "25", "10"],
      answer: 1,
      explanation: "3x + 4x = 35 → x = 5. Larger = 4×5 = 20.",
    },
    {
      q: "A sum triples in 10 years at simple interest. What is the rate?",
      options: ["15%", "20%", "25%", "30%"],
      answer: 1,
      explanation: "SI = 2P (triples). 2P = P×R×10/100 → R = 20%.",
    },
    {
      q: "Speed of boat in still water = 10 km/h, stream = 2 km/h. Upstream speed?",
      options: ["12", "10", "8", "6"],
      answer: 2,
      explanation: "Upstream = 10 – 2 = 8 km/h.",
    },
    {
      q: "Average of 5 numbers is 12. If one number is removed, average becomes 10. Removed?",
      options: ["16", "18", "20", "22"],
      answer: 2,
      explanation: "Total = 60. New total = 40. Removed = 60 – 40 = 20.",
    },
  ],
  "Logical Reasoning": [
    {
      q: "Find the next in series: 2, 6, 12, 20, 30, ?",
      options: ["40", "42", "44", "46"],
      answer: 1,
      explanation: "Differences: 4, 6, 8, 10, 12. Next = 30 + 12 = 42.",
    },
    {
      q: "If A is B's sister, B is C's brother, C is D's father. How is A related to D?",
      options: ["Aunt", "Mother", "Sister", "Grandmother"],
      answer: 0,
      explanation: "A → sister of B → B is C's brother → C is D's father. A is D's aunt.",
    },
    {
      q: "All dogs are animals. All animals have cells. Therefore?",
      options: ["All dogs have cells", "Some dogs have cells", "No dogs have cells", "None"],
      answer: 0,
      explanation: "This is a valid syllogism. All dogs are animals with cells → All dogs have cells.",
    },
    {
      q: "BDFH : ACEG :: JLNP : ?",
      options: ["IKMO", "KMOP", "KNPR", "LMNO"],
      answer: 0,
      explanation: "BDFH are even letters; ACEG are odd letters before them. JLNP even → IKMO odd.",
    },
    {
      q: "A is taller than B. C is shorter than D. D is shorter than A. Who is shortest?",
      options: ["A", "B", "C", "D"],
      answer: 1,
      explanation: "Order: A > D > C. A > B. Without comparing B and C, B could be shortest.",
    },
    {
      q: "If MANGO is coded as OCPIQ, what is APPLE?",
      options: ["CRRNG", "CQQNG", "CRQNG", "CRNNG"],
      answer: 0,
      explanation: "Each letter is shifted +2. A→C, P→R, P→R, L→N, E→G = CRRNG.",
    },
    {
      q: "5 men take 6 days to complete a task. How many men to finish in 3 days?",
      options: ["8", "10", "12", "15"],
      answer: 1,
      explanation: "5 × 6 = 30 man-days. 30 / 3 = 10 men.",
    },
    {
      q: "Which word cannot be made from COMPUTER? COPE / CUTE / MUTE / MOLE",
      options: ["COPE", "CUTE", "MUTE", "MOLE"],
      answer: 3,
      explanation: "MOLE needs an L, which is not in COMPUTER.",
    },
    {
      q: "Arrange in order: Sentence, Letter, Word, Paragraph",
      options: [
        "Letter, Word, Sentence, Paragraph",
        "Word, Letter, Sentence, Paragraph",
        "Letter, Sentence, Word, Paragraph",
        "Paragraph, Sentence, Word, Letter",
      ],
      answer: 0,
      explanation: "Smallest to largest: Letter → Word → Sentence → Paragraph.",
    },
    {
      q: "If 6 = 66, 7 = 77, 8 = 88, then 9 = ?",
      options: ["89", "98", "99", "109"],
      answer: 2,
      explanation: "Pattern: n = n concatenated twice. 9 = 99.",
    },
  ],
  "Verbal Ability": [
    {
      q: "Choose the synonym of BENEVOLENT:",
      options: ["Cruel", "Kind", "Angry", "Lazy"],
      answer: 1,
      explanation: "Benevolent means kind and generous.",
    },
    {
      q: "Choose the antonym of LOQUACIOUS:",
      options: ["Talkative", "Verbose", "Taciturn", "Garrulous"],
      answer: 2,
      explanation: "Loquacious = very talkative. Antonym = taciturn (reserved, not talkative).",
    },
    {
      q: "Fill in the blank: She is __ European.",
      options: ["a", "an", "the", "no article"],
      answer: 0,
      explanation: "'European' begins with a consonant sound (yoo-ro), so 'a' is correct.",
    },
    {
      q: "Identify the error: 'He don't know the answer.'",
      options: ["He", "don't", "know", "answer"],
      answer: 1,
      explanation: "For third-person singular, use 'doesn't' instead of 'don't'.",
    },
    {
      q: "Choose the word closest in meaning to EPHEMERAL:",
      options: ["Permanent", "Transient", "Solid", "Deep"],
      answer: 1,
      explanation: "Ephemeral = lasting for a very short time. Synonym = transient.",
    },
    {
      q: "Rearrange: 'market / goes / she / every / to / day / the'",
      options: [
        "She goes to the market every day",
        "She every day goes to the market",
        "Every day market she goes to the",
        "She goes every market the day to",
      ],
      answer: 0,
      explanation: "Correct sentence: She goes to the market every day.",
    },
    {
      q: "Which is the correct spelling?",
      options: ["Accomodation", "Accommodation", "Acommodation", "Accomadation"],
      answer: 1,
      explanation: "Correct: Accommodation (double 'c' and double 'm').",
    },
    {
      q: "Choose the correctly punctuated sentence:",
      options: [
        "Its a beautiful day, isn't it.",
        "It's a beautiful day, isn't it?",
        "Its a beautiful day isn't it?",
        "It's a beautiful day isnt it?",
      ],
      answer: 1,
      explanation: "It's = it is (apostrophe needed). 'isn't it?' needs a question mark.",
    },
    {
      q: "Identify the passive voice: 'The book was written by her.'",
      options: ["Active", "Passive", "Imperative", "Interrogative"],
      answer: 1,
      explanation: "The subject (book) receives the action — this is passive voice.",
    },
    {
      q: "Select the correct one-word substitute: 'One who knows everything'",
      options: ["Omnipotent", "Omniscient", "Omnivore", "Omnipresent"],
      answer: 1,
      explanation: "Omniscient = knowing everything. Omnipotent = all-powerful.",
    },
  ],
};

/* ─────────────────────────────────────────────────────────── SECTION DATA ──── */

const SECTIONS = [
  {
    id: "quant",
    icon: Calculator,
    title: "Quantitative Aptitude",
    color: "from-blue-500 to-cyan-500",
    borderColor: "border-blue-500/20",
    description: "Master numbers, speed & accuracy for top placement tests",
    topics: [
      { name: "Percentages", difficulty: "Easy", questions: 45, url: "https://www.indiabix.com/aptitude/percentage/", youtube: "https://www.youtube.com/results?search_query=percentages+aptitude+tricks" },
      { name: "Profit & Loss", difficulty: "Easy", questions: 38, url: "https://www.indiabix.com/aptitude/profit-and-loss/", youtube: "https://www.youtube.com/results?search_query=profit+loss+aptitude" },
      { name: "Time & Work", difficulty: "Medium", questions: 52, url: "https://www.indiabix.com/aptitude/time-and-work/", youtube: "https://www.youtube.com/results?search_query=time+and+work+aptitude+tricks" },
      { name: "Probability", difficulty: "Medium", questions: 30, url: "https://www.indiabix.com/aptitude/probability/", youtube: "https://www.youtube.com/results?search_query=probability+aptitude" },
      { name: "Speed, Distance & Time", difficulty: "Medium", questions: 41, url: "https://www.indiabix.com/aptitude/problems-on-trains/", youtube: "https://www.youtube.com/results?search_query=speed+distance+time+aptitude" },
      { name: "Number Systems", difficulty: "Hard", questions: 28, url: "https://www.indiabix.com/aptitude/numbers/", youtube: "https://www.youtube.com/results?search_query=number+system+aptitude" },
    ],
  },
  {
    id: "reasoning",
    icon: Brain,
    title: "Logical Reasoning",
    color: "from-purple-500 to-violet-500",
    borderColor: "border-purple-500/20",
    description: "Sharpen your analytical thinking for aptitude rounds",
    topics: [
      { name: "Number Series", difficulty: "Easy", questions: 60, url: "https://www.indiabix.com/logical-reasoning/number-series/", youtube: "https://www.youtube.com/results?search_query=number+series+logical+reasoning" },
      { name: "Puzzles", difficulty: "Hard", questions: 35, url: "https://www.indiabix.com/logical-reasoning/puzzles/", youtube: "https://www.youtube.com/results?search_query=puzzles+logical+reasoning" },
      { name: "Syllogism", difficulty: "Medium", questions: 44, url: "https://www.indiabix.com/logical-reasoning/syllogism/", youtube: "https://www.youtube.com/results?search_query=syllogism+tricks" },
      { name: "Blood Relations", difficulty: "Easy", questions: 32, url: "https://www.indiabix.com/logical-reasoning/blood-relations/", youtube: "https://www.youtube.com/results?search_query=blood+relations+logical+reasoning" },
      { name: "Seating Arrangement", difficulty: "Hard", questions: 48, url: "https://www.indiabix.com/logical-reasoning/seating-arrangement/", youtube: "https://www.youtube.com/results?search_query=seating+arrangement+logical+reasoning" },
      { name: "Coding-Decoding", difficulty: "Easy", questions: 55, url: "https://www.indiabix.com/logical-reasoning/coding-decoding/", youtube: "https://www.youtube.com/results?search_query=coding+decoding+reasoning" },
    ],
  },
  {
    id: "verbal",
    icon: MessageSquareText,
    title: "Verbal Ability",
    color: "from-emerald-500 to-teal-500",
    borderColor: "border-emerald-500/20",
    description: "Ace English communication rounds in on-campus drives",
    topics: [
      { name: "Reading Comprehension", difficulty: "Medium", questions: 40, url: "https://www.indiabix.com/verbal-ability/comprehension/", youtube: "https://www.youtube.com/results?search_query=reading+comprehension+aptitude" },
      { name: "Synonyms", difficulty: "Easy", questions: 80, url: "https://www.indiabix.com/verbal-ability/synonyms/", youtube: "https://www.youtube.com/results?search_query=synonyms+verbal+ability" },
      { name: "Grammar Rules", difficulty: "Medium", questions: 65, url: "https://www.indiabix.com/verbal-ability/grammar/", youtube: "https://www.youtube.com/results?search_query=english+grammar+for+placements" },
      { name: "Para Jumbles", difficulty: "Hard", questions: 30, url: "https://www.indiabix.com/verbal-ability/sentence-arrangement/", youtube: "https://www.youtube.com/results?search_query=para+jumbles+verbal+ability" },
      { name: "Sentence Correction", difficulty: "Medium", questions: 55, url: "https://www.indiabix.com/verbal-ability/sentence-correction/", youtube: "https://www.youtube.com/results?search_query=sentence+correction+english" },
      { name: "Antonyms", difficulty: "Easy", questions: 70, url: "https://www.indiabix.com/verbal-ability/antonyms/", youtube: "https://www.youtube.com/results?search_query=antonyms+verbal+ability" },
    ],
  },
];

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  Medium: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  Hard: "bg-rose-500/15 text-rose-400 border-rose-500/20",
};

const PREP_TIPS = [
  { icon: Clock, tip: "Solve 20 questions/day for 30 days before your drive" },
  { icon: Target, tip: "Focus on weak topics first. Take sectional tests" },
  { icon: TrendingUp, tip: "Speed + accuracy: practice with a timer always" },
  { icon: Trophy, tip: "Aim for 80%+ accuracy before a full-length mock" },
];

const TOP_RESOURCES = [
  { name: "IndiaBix", desc: "1000+ practice questions with solutions", url: "https://www.indiabix.com/", color: "from-blue-500 to-indigo-500", icon: BookOpen },
  { name: "PrepInsta", desc: "Company-specific placement preparation", url: "https://prepinsta.com/", color: "from-violet-500 to-purple-500", icon: Target },
  { name: "FreshersWorld", desc: "Previous year placement papers", url: "https://www.freshersworld.com/placement-papers", color: "from-emerald-500 to-teal-500", icon: FileText },
  { name: "GeeksForGeeks", desc: "CS fundamentals + aptitude questions", url: "https://www.geeksforgeeks.org/placements-gq/", color: "from-green-500 to-emerald-600", icon: Zap },
  { name: "Testbook", desc: "Live mock tests & performance analysis", url: "https://testbook.com/", color: "from-orange-500 to-amber-500", icon: Trophy },
  { name: "Unacademy", desc: "Aptitude video lectures & live classes", url: "https://unacademy.com/", color: "from-rose-500 to-pink-500", icon: Play },
];

/* ─────────────────────────────────────────────────────────── MOCK TEST ──── */

type MockTestState = "select" | "running" | "results";

function MockTestModule({ onBack }: { onBack: () => void }) {
  const [state, setState] = useState<MockTestState>("select");
  const [selectedCategory, setSelectedCategory] = useState<string>("Quantitative Aptitude");
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [quizCategories, setQuizCategories] = useState<string[]>(Object.keys(QUIZ_BANK));

  useEffect(() => {
    try {
      const baseQuestions = QUIZ_BANK[selectedCategory] ?? [];
      const customQuizBank = JSON.parse(localStorage.getItem("customQuizBank") ?? "{}");
      const customQuestions = customQuizBank[selectedCategory] ?? [];
      setQuestions([...baseQuestions, ...customQuestions]);
    } catch {
      setQuestions(QUIZ_BANK[selectedCategory] ?? []);
    }
  }, [selectedCategory]);

  useEffect(() => {
    try {
      const customQuizBank = JSON.parse(localStorage.getItem("customQuizBank") ?? "{}");
      const cats = Array.from(new Set([...Object.keys(QUIZ_BANK), ...Object.keys(customQuizBank)]));
      setQuizCategories(cats);
    } catch {}
  }, []);

  function getQuestionCount(cat: string) {
    try {
      const baseCount = QUIZ_BANK[cat]?.length ?? 0;
      const customQuizBank = JSON.parse(localStorage.getItem("customQuizBank") ?? "{}");
      const customCount = customQuizBank[cat]?.length ?? 0;
      return baseCount + customCount;
    } catch {
      return QUIZ_BANK[cat]?.length ?? 0;
    }
  }

  useEffect(() => {
    if (state !== "running") return;
    if (timeLeft <= 0) { endTest(); return; }
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [state, timeLeft]);

  function startTest() {
    setQIndex(0);
    setSelected(null);
    setConfirmed(false);
    setAnswers(new Array(questions.length).fill(null));
    setTimeLeft(600);
    setState("running");
  }

  function confirmAnswer() {
    if (selected === null) return;
    const updated = [...answers];
    updated[qIndex] = selected;
    setAnswers(updated);
    setConfirmed(true);
  }

  function goNext() {
    if (qIndex >= questions.length - 1) { endTest(); return; }
    setQIndex((i) => i + 1);
    setSelected(answers[qIndex + 1] ?? null);
    setConfirmed(answers[qIndex + 1] !== null);
  }

  function goPrev() {
    if (qIndex <= 0) return;
    setQIndex((i) => i - 1);
    setSelected(answers[qIndex - 1] ?? null);
    setConfirmed(answers[qIndex - 1] !== null);
  }

  function endTest() { setState("results"); }

  const score = answers.filter((a, i) => a === questions[i]?.answer).length;

  if (state === "select") {
    return (
      <AppShell>
        <div className="max-w-2xl mx-auto py-8">
          <button onClick={onBack} className="text-sm text-muted-foreground flex items-center gap-1 mb-6 hover:text-foreground">
            <ChevronLeft className="size-4" /> Back to Placement Prep
          </button>
          <h1 className="text-2xl font-bold mb-2 flex items-center gap-2"><FileText className="size-6 text-orange-400" /> Mock Test</h1>
          <p className="text-sm text-muted-foreground mb-6">10 questions · 10 minutes · Instant scoring & explanations</p>

          <div className="space-y-3 mb-6">
            {quizCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn("w-full text-left glass-card rounded-2xl p-5 border transition-all flex items-center gap-4",
                  selectedCategory === cat ? "border-primary/40 bg-primary/5" : "border-white/5 hover:border-white/15")}
              >
                <div className={cn("size-4 rounded-full border-2 shrink-0", selectedCategory === cat ? "border-primary bg-primary" : "border-white/30")} />
                <div>
                  <p className="font-bold">{cat}</p>
                  <p className="text-xs text-muted-foreground">{getQuestionCount(cat)} questions · 10 min</p>
                </div>
                {selectedCategory === cat && <CheckCircle2 className="size-5 text-primary ml-auto" />}
              </button>
            ))}
          </div>
          <Button variant="hero" size="lg" className="w-full" onClick={startTest}>
            Start Mock Test <ChevronRight className="size-5" />
          </Button>
        </div>
      </AppShell>
    );
  }

  if (state === "results") {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <AppShell>
        <div className="max-w-2xl mx-auto py-8">
          <button onClick={() => setState("select")} className="text-sm text-muted-foreground flex items-center gap-1 mb-6 hover:text-foreground">
            <ChevronLeft className="size-4" /> Back
          </button>
          <div className="glass-card rounded-2xl p-8 text-center mb-6">
            <div className={cn("size-20 rounded-full grid place-items-center mx-auto mb-4 text-white text-2xl font-bold", pct >= 70 ? "bg-gradient-to-br from-emerald-500 to-teal-500" : pct >= 50 ? "bg-gradient-to-br from-yellow-500 to-orange-500" : "bg-gradient-to-br from-rose-500 to-pink-600")}>
              {pct}%
            </div>
            <h2 className="text-2xl font-bold">{pct >= 70 ? "Excellent! 🎉" : pct >= 50 ? "Good effort! 👍" : "Keep practicing! 💪"}</h2>
            <p className="text-muted-foreground mt-1">{score}/{questions.length} correct in {selectedCategory}</p>
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-emerald-500/10 rounded-xl p-3">
                <p className="text-xl font-bold text-emerald-400">{score}</p>
                <p className="text-xs text-muted-foreground">Correct</p>
              </div>
              <div className="bg-rose-500/10 rounded-xl p-3">
                <p className="text-xl font-bold text-rose-400">{questions.length - score}</p>
                <p className="text-xs text-muted-foreground">Wrong</p>
              </div>
              <div className="bg-primary/10 rounded-xl p-3">
                <p className="text-xl font-bold text-primary">{pct}%</p>
                <p className="text-xs text-muted-foreground">Score</p>
              </div>
            </div>
          </div>

          <h3 className="font-bold text-lg mb-3">Review All Questions</h3>
          <div className="space-y-3 mb-6">
            {questions.map((q, i) => {
              const userAns = answers[i];
              const correct = userAns === q.answer;
              return (
                <div key={i} className={cn("glass-card rounded-xl p-4 border", correct ? "border-emerald-500/20" : "border-rose-500/20")}>
                  <div className="flex items-start gap-2 mb-2">
                    {correct ? <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" /> : <XCircle className="size-4 text-rose-400 shrink-0 mt-0.5" />}
                    <p className="text-sm font-medium">{q.q}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 mb-2">
                    {q.options.map((opt, oi) => (
                      <div key={oi} className={cn("text-xs px-3 py-1.5 rounded-lg",
                        oi === q.answer ? "bg-emerald-500/15 text-emerald-400 font-semibold" :
                        oi === userAns && !correct ? "bg-rose-500/15 text-rose-400 line-through" :
                        "text-muted-foreground")}>
                        {oi === q.answer && "✓ "}{opt}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground bg-white/3 rounded-lg px-3 py-2">💡 {q.explanation}</p>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setState("select")}>
              <RotateCcw className="size-4 mr-2" /> Try Another
            </Button>
            <Button variant="hero" className="flex-1" onClick={startTest}>
              Retry Same
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

  // Running state
  const currentQ = questions[qIndex];
  return (
    <AppShell>
      <div className="max-w-xl mx-auto py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <button onClick={onBack} className="text-sm text-muted-foreground flex items-center gap-1 hover:text-foreground">
            <ChevronLeft className="size-4" /> Quit
          </button>
          <div className={cn("flex items-center gap-2 px-4 py-1.5 rounded-xl text-sm font-bold", timeLeft < 120 ? "bg-rose-500/20 text-rose-400" : "bg-primary/10 text-primary")}>
            <Timer className="size-4" />
            {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-5">
          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-primary rounded-full transition-all" style={{ width: `${((qIndex + 1) / questions.length) * 100}%` }} />
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">{qIndex + 1}/{questions.length}</span>
        </div>

        {/* Question */}
        <div className="glass-card rounded-2xl p-6 border border-white/5">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-400">{selectedCategory}</span>
          <h2 className="text-lg font-bold mt-1 mb-5">{currentQ.q}</h2>

          {/* Options */}
          <div className="space-y-3 mb-5">
            {currentQ.options.map((opt, oi) => {
              let cls = "border border-white/10 bg-background/40 hover:border-primary/40 hover:bg-primary/5 cursor-pointer";
              if (confirmed) {
                if (oi === currentQ.answer) cls = "border-emerald-500/50 bg-emerald-500/10 text-emerald-300";
                else if (oi === selected) cls = "border-rose-500/50 bg-rose-500/10 text-rose-300 line-through";
                else cls = "border-white/5 bg-background/20 opacity-50";
              } else if (oi === selected) {
                cls = "border-primary/60 bg-primary/10";
              }
              return (
                <button
                  key={oi}
                  disabled={confirmed}
                  onClick={() => setSelected(oi)}
                  className={cn("w-full text-left px-4 py-3 rounded-xl text-sm transition-all flex items-center gap-3", cls)}
                >
                  <span className={cn("size-6 rounded-full border text-xs font-bold grid place-items-center shrink-0", oi === selected && !confirmed ? "border-primary text-primary" : "border-white/20")}>
                    {["A", "B", "C", "D"][oi]}
                  </span>
                  {opt}
                  {confirmed && oi === currentQ.answer && <CheckCircle2 className="size-4 text-emerald-400 ml-auto" />}
                  {confirmed && oi === selected && oi !== currentQ.answer && <XCircle className="size-4 text-rose-400 ml-auto" />}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {confirmed && (
            <div className="bg-white/3 border border-white/5 rounded-xl p-4 mb-4">
              <p className="text-xs font-bold text-primary mb-1">💡 Explanation</p>
              <p className="text-xs text-muted-foreground">{currentQ.explanation}</p>
            </div>
          )}

          {/* Nav Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={goPrev} disabled={qIndex === 0}><ChevronLeft className="size-4" /></Button>
            {!confirmed ? (
              <Button variant="hero" className="flex-1" onClick={confirmAnswer} disabled={selected === null}>
                Confirm
              </Button>
            ) : (
              <Button variant="hero" className="flex-1" onClick={goNext}>
                {qIndex >= questions.length - 1 ? "See Results" : "Next"} <ChevronRight className="size-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Question navigator dots */}
        <div className="flex flex-wrap gap-1.5 mt-4 justify-center">
          {questions.map((_, i) => (
            <div key={i} className={cn("size-2.5 rounded-full", i === qIndex ? "bg-primary" : answers[i] !== null ? answers[i] === questions[i].answer ? "bg-emerald-500" : "bg-rose-500" : "bg-white/15")} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}

/* ─────────────────────────────────────────────────────────── MAIN PAGE ──── */

function PlacementMain() {
  const [mockMode, setMockMode] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  if (mockMode) return <MockTestModule onBack={() => setMockMode(false)} />;

  return (
    <AppShell>
      <PageHeader
        title="Placement Preparation"
        subtitle="Aptitude, reasoning, mock tests, and company-specific tracks — built around top recruiter patterns."
      />

      {/* Stats Bar */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Practice Questions", value: "5,000+", icon: BookOpen },
          { label: "Mock Tests", value: "30+ In-App", icon: FileText },
          { label: "Companies Covered", value: "50+", icon: Users },
          { label: "Students Placed", value: "92%", icon: Trophy },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="glass-card rounded-2xl p-4 flex items-center gap-3">
              <div className="size-9 rounded-xl bg-primary/10 grid place-items-center shrink-0">
                <Icon className="size-4 text-primary" />
              </div>
              <div>
                <p className="text-lg font-bold gradient-text">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Tips */}
      <div className="mt-6 glass-card rounded-2xl p-5 border border-primary/10">
        <h3 className="font-bold text-sm uppercase tracking-widest text-primary mb-3 flex items-center gap-2">
          <Star className="size-4" /> Placement Prep Tips
        </h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {PREP_TIPS.map(({ icon: Icon, tip }) => (
            <div key={tip} className="flex items-start gap-2.5">
              <div className="size-6 rounded-lg bg-primary/10 grid place-items-center shrink-0 mt-0.5">
                <Icon className="size-3.5 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── In-App Mock Test CTA ── */}
      <div
        onClick={() => setMockMode(true)}
        className="mt-6 cursor-pointer glass-card rounded-2xl p-6 border border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-rose-500/5 hover:shadow-elegant hover:-translate-y-0.5 transition-all flex items-center justify-between group"
      >
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 grid place-items-center">
            <FileText className="size-6 text-white" />
          </div>
          <div>
            <p className="font-bold text-lg">📝 Take In-App Mock Test</p>
            <p className="text-sm text-muted-foreground">10 questions · 10 mins · Instant results & explanations</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-orange-400 font-semibold text-sm shrink-0">
          Start Now <ChevronRight className="size-5 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* Aptitude Sections */}
      <div className="mt-6 space-y-4">
        {SECTIONS.map((section) => {
          const Icon = section.icon;
          const isOpen = activeSection === section.id;
          return (
            <div key={section.id} className={cn("glass-card rounded-2xl overflow-hidden border transition-all duration-300", isOpen ? section.borderColor : "border-white/5")}>
              <button
                onClick={() => setActiveSection(isOpen ? null : section.id)}
                className="w-full p-5 flex items-center gap-4 text-left hover:bg-white/2 transition-colors"
              >
                <div className={`size-12 rounded-xl bg-gradient-to-br ${section.color} grid place-items-center shrink-0`}>
                  <Icon className="size-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold">{section.title}</h3>
                  <p className="text-sm text-muted-foreground">{section.description}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Badge variant="secondary" className="hidden sm:flex bg-white/5 text-muted-foreground">{section.topics.length} topics</Badge>
                  <ChevronRight className={cn("size-5 text-muted-foreground transition-transform duration-300", isOpen && "rotate-90")} />
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5">
                  <div className="h-px bg-white/5 mb-5" />
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {section.topics.map((topic) => (
                      <div key={topic.name} className="rounded-xl border border-white/5 bg-background/40 p-4 flex flex-col gap-3 hover:border-primary/20 transition-all">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold text-sm leading-snug">{topic.name}</p>
                          <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0", DIFFICULTY_COLORS[topic.difficulty])}>{topic.difficulty}</span>
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <CheckCircle2 className="size-3 text-emerald-400" />{topic.questions} practice questions
                        </p>
                        <div className="flex gap-2 mt-auto">
                          <a href={topic.url} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                            <BookOpen className="size-3" /> Practice
                          </a>
                          <a href={topic.youtube} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors">
                            <Play className="size-3" /> Watch
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Free Resources */}
      <section className="mt-10">
        <div className="mb-4">
          <h2 className="text-xl font-bold">Free Study Resources</h2>
          <p className="text-sm text-muted-foreground">Best free platforms used by placed students</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOP_RESOURCES.map((r) => {
            const Icon = r.icon;
            return (
              <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer" className="group glass-card rounded-2xl p-5 hover:shadow-elegant hover:-translate-y-1 transition-all flex items-start gap-4 border border-white/5 hover:border-primary/20">
                <div className={`size-10 rounded-xl bg-gradient-to-br ${r.color} grid place-items-center shrink-0`}>
                  <Icon className="size-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold group-hover:text-primary transition-colors">{r.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{r.desc}</p>
                </div>
                <ExternalLink className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5" />
              </a>
            );
          })}
        </div>
      </section>

      {/* Company Tracks */}
      <section className="mt-10">
        <div className="mb-4">
          <h2 className="text-xl font-bold">Company-specific preparation</h2>
          <p className="text-sm text-muted-foreground">Dedicated tracks with interview process, top questions, and prep roadmaps.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {COMPANIES.map((c) => (
            <Link key={c.slug} to="/companies/$slug" params={{ slug: c.slug }} className="group glass-card rounded-2xl p-5 hover:shadow-elegant hover:-translate-y-1 transition-all border border-white/5 hover:border-primary/20">
              <div className={`size-10 rounded-xl bg-gradient-to-br ${c.color} mb-3`} />
              <p className="font-bold">{c.name}</p>
              <p className="text-xs text-muted-foreground">{c.role} • {c.ctc}</p>
              <p className="mt-3 text-xs flex items-center gap-1 text-primary font-semibold">Open track <ArrowRight className="size-3" /></p>
            </Link>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
