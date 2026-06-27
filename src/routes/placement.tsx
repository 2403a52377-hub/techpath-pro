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
  TrendingUp,
  Star,
  Zap,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/placement")({ component: Placement });

/* ─────────────────────────────────────────────────────────── DATA ──── */

const SECTIONS = [
  {
    id: "quant",
    icon: Calculator,
    title: "Quantitative Aptitude",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    description: "Master numbers, speed & accuracy for top placement tests",
    topics: [
      {
        name: "Percentages",
        difficulty: "Easy",
        questions: 45,
        url: "https://www.indiabix.com/aptitude/percentage/",
        youtube: "https://www.youtube.com/results?search_query=percentages+aptitude+tricks",
      },
      {
        name: "Profit & Loss",
        difficulty: "Easy",
        questions: 38,
        url: "https://www.indiabix.com/aptitude/profit-and-loss/",
        youtube: "https://www.youtube.com/results?search_query=profit+loss+aptitude",
      },
      {
        name: "Time & Work",
        difficulty: "Medium",
        questions: 52,
        url: "https://www.indiabix.com/aptitude/time-and-work/",
        youtube: "https://www.youtube.com/results?search_query=time+and+work+aptitude+tricks",
      },
      {
        name: "Probability",
        difficulty: "Medium",
        questions: 30,
        url: "https://www.indiabix.com/aptitude/probability/",
        youtube: "https://www.youtube.com/results?search_query=probability+aptitude",
      },
      {
        name: "Speed, Distance & Time",
        difficulty: "Medium",
        questions: 41,
        url: "https://www.indiabix.com/aptitude/problems-on-trains/",
        youtube: "https://www.youtube.com/results?search_query=speed+distance+time+aptitude",
      },
      {
        name: "Number Systems",
        difficulty: "Hard",
        questions: 28,
        url: "https://www.indiabix.com/aptitude/numbers/",
        youtube: "https://www.youtube.com/results?search_query=number+system+aptitude",
      },
    ],
  },
  {
    id: "reasoning",
    icon: Brain,
    title: "Logical Reasoning",
    color: "from-purple-500 to-violet-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    description: "Sharpen your analytical thinking for aptitude rounds",
    topics: [
      {
        name: "Number Series",
        difficulty: "Easy",
        questions: 60,
        url: "https://www.indiabix.com/logical-reasoning/number-series/",
        youtube: "https://www.youtube.com/results?search_query=number+series+logical+reasoning",
      },
      {
        name: "Puzzles",
        difficulty: "Hard",
        questions: 35,
        url: "https://www.indiabix.com/logical-reasoning/puzzles/",
        youtube: "https://www.youtube.com/results?search_query=puzzles+logical+reasoning",
      },
      {
        name: "Syllogism",
        difficulty: "Medium",
        questions: 44,
        url: "https://www.indiabix.com/logical-reasoning/syllogism/",
        youtube: "https://www.youtube.com/results?search_query=syllogism+tricks",
      },
      {
        name: "Blood Relations",
        difficulty: "Easy",
        questions: 32,
        url: "https://www.indiabix.com/logical-reasoning/blood-relations/",
        youtube: "https://www.youtube.com/results?search_query=blood+relations+logical+reasoning",
      },
      {
        name: "Seating Arrangement",
        difficulty: "Hard",
        questions: 48,
        url: "https://www.indiabix.com/logical-reasoning/seating-arrangement/",
        youtube: "https://www.youtube.com/results?search_query=seating+arrangement+logical+reasoning",
      },
      {
        name: "Coding-Decoding",
        difficulty: "Easy",
        questions: 55,
        url: "https://www.indiabix.com/logical-reasoning/coding-decoding/",
        youtube: "https://www.youtube.com/results?search_query=coding+decoding+reasoning",
      },
    ],
  },
  {
    id: "verbal",
    icon: MessageSquareText,
    title: "Verbal Ability",
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
    description: "Ace English communication rounds in on-campus drives",
    topics: [
      {
        name: "Reading Comprehension",
        difficulty: "Medium",
        questions: 40,
        url: "https://www.indiabix.com/verbal-ability/comprehension/",
        youtube: "https://www.youtube.com/results?search_query=reading+comprehension+aptitude",
      },
      {
        name: "Synonyms",
        difficulty: "Easy",
        questions: 80,
        url: "https://www.indiabix.com/verbal-ability/synonyms/",
        youtube: "https://www.youtube.com/results?search_query=synonyms+verbal+ability",
      },
      {
        name: "Grammar Rules",
        difficulty: "Medium",
        questions: 65,
        url: "https://www.indiabix.com/verbal-ability/grammar/",
        youtube: "https://www.youtube.com/results?search_query=english+grammar+for+placements",
      },
      {
        name: "Para Jumbles",
        difficulty: "Hard",
        questions: 30,
        url: "https://www.indiabix.com/verbal-ability/sentence-arrangement/",
        youtube: "https://www.youtube.com/results?search_query=para+jumbles+verbal+ability",
      },
      {
        name: "Sentence Correction",
        difficulty: "Medium",
        questions: 55,
        url: "https://www.indiabix.com/verbal-ability/sentence-correction/",
        youtube: "https://www.youtube.com/results?search_query=sentence+correction+english",
      },
      {
        name: "Antonyms",
        difficulty: "Easy",
        questions: 70,
        url: "https://www.indiabix.com/verbal-ability/antonyms/",
        youtube: "https://www.youtube.com/results?search_query=antonyms+verbal+ability",
      },
    ],
  },
  {
    id: "mock",
    icon: FileText,
    title: "Mock Tests",
    color: "from-orange-500 to-rose-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
    description: "Simulate real placement exams with timed tests",
    topics: [
      {
        name: "Full-Length Test (TCS)",
        difficulty: "Hard",
        questions: 90,
        url: "https://www.freshersworld.com/placement-papers/tcs",
        youtube: "https://www.youtube.com/results?search_query=TCS+placement+paper",
      },
      {
        name: "Sectional — Quant",
        difficulty: "Medium",
        questions: 30,
        url: "https://www.m4maths.com/placement-puzzles.php",
        youtube: "https://www.youtube.com/results?search_query=quantitative+aptitude+test",
      },
      {
        name: "Adaptive Test (Infosys)",
        difficulty: "Medium",
        questions: 65,
        url: "https://www.freshersworld.com/placement-papers/infosys",
        youtube: "https://www.youtube.com/results?search_query=infosys+aptitude+test",
      },
      {
        name: "Previous Papers (Wipro)",
        difficulty: "Easy",
        questions: 50,
        url: "https://www.freshersworld.com/placement-papers/wipro",
        youtube: "https://www.youtube.com/results?search_query=wipro+placement+papers",
      },
      {
        name: "Full-Length Test (Cognizant)",
        difficulty: "Hard",
        questions: 75,
        url: "https://www.freshersworld.com/placement-papers/cognizant",
        youtube: "https://www.youtube.com/results?search_query=cognizant+placement+paper",
      },
      {
        name: "AMCAT Practice Test",
        difficulty: "Medium",
        questions: 60,
        url: "https://www.myamcat.com/",
        youtube: "https://www.youtube.com/results?search_query=AMCAT+test+preparation",
      },
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
  {
    name: "IndiaBix",
    desc: "1000+ practice questions with solutions",
    url: "https://www.indiabix.com/",
    color: "from-blue-500 to-indigo-500",
    icon: BookOpen,
  },
  {
    name: "PrepInsta",
    desc: "Company-specific placement preparation",
    url: "https://prepinsta.com/",
    color: "from-violet-500 to-purple-500",
    icon: Target,
  },
  {
    name: "FreshersWorld",
    desc: "Previous year placement papers",
    url: "https://www.freshersworld.com/placement-papers",
    color: "from-emerald-500 to-teal-500",
    icon: FileText,
  },
  {
    name: "GeeksForGeeks",
    desc: "CS fundamentals + aptitude questions",
    url: "https://www.geeksforgeeks.org/placements-gq/",
    color: "from-green-500 to-emerald-600",
    icon: Zap,
  },
  {
    name: "Testbook",
    desc: "Live mock tests & performance analysis",
    url: "https://testbook.com/",
    color: "from-orange-500 to-amber-500",
    icon: Trophy,
  },
  {
    name: "Unacademy",
    desc: "Aptitude video lectures & live classes",
    url: "https://unacademy.com/",
    color: "from-rose-500 to-pink-500",
    icon: Play,
  },
];

/* ─────────────────────────────────────────────────────── COMPONENT ──── */

function Placement() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  return (
    <AppShell>
      <PageHeader
        title="Placement Preparation"
        subtitle="Aptitude, reasoning, mock tests, and company-specific tracks — built around top recruiter patterns."
      />

      {/* ── Stats Bar ── */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Practice Questions", value: "5,000+", icon: BookOpen },
          { label: "Mock Tests", value: "200+", icon: FileText },
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

      {/* ── Quick Tips ── */}
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

      {/* ── Aptitude Sections ── */}
      <div className="mt-8 space-y-4">
        {SECTIONS.map((section) => {
          const Icon = section.icon;
          const isOpen = activeSection === section.id;
          return (
            <div
              key={section.id}
              className={cn(
                "glass-card rounded-2xl overflow-hidden border transition-all duration-300",
                isOpen ? section.borderColor : "border-white/5",
              )}
            >
              {/* Section Header — clickable */}
              <button
                id={`placement-section-${section.id}`}
                onClick={() => setActiveSection(isOpen ? null : section.id)}
                className="w-full p-5 flex items-center gap-4 text-left hover:bg-white/2 transition-colors"
              >
                <div
                  className={`size-12 rounded-xl bg-gradient-to-br ${section.color} grid place-items-center shrink-0`}
                >
                  <Icon className="size-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold">{section.title}</h3>
                  <p className="text-sm text-muted-foreground">{section.description}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Badge variant="secondary" className="hidden sm:flex bg-white/5 text-muted-foreground">
                    {section.topics.length} topics
                  </Badge>
                  <ChevronRight
                    className={cn(
                      "size-5 text-muted-foreground transition-transform duration-300",
                      isOpen && "rotate-90",
                    )}
                  />
                </div>
              </button>

              {/* Expanded Topics Grid */}
              {isOpen && (
                <div className="px-5 pb-5">
                  <div className="h-px bg-white/5 mb-5" />
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {section.topics.map((topic) => (
                      <div
                        key={topic.name}
                        className="rounded-xl border border-white/5 bg-background/40 p-4 flex flex-col gap-3 hover:border-primary/20 transition-all group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold text-sm leading-snug">{topic.name}</p>
                          <span
                            className={cn(
                              "text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0",
                              DIFFICULTY_COLORS[topic.difficulty],
                            )}
                          >
                            {topic.difficulty}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <CheckCircle2 className="size-3 text-emerald-400" />
                          {topic.questions} practice questions
                        </p>
                        <div className="flex gap-2 mt-auto">
                          <a
                            href={topic.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                          >
                            <BookOpen className="size-3" /> Practice
                          </a>
                          <a
                            href={topic.youtube}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                          >
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

      {/* ── Top Resources ── */}
      <section className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">Free Study Resources</h2>
            <p className="text-sm text-muted-foreground">Best free platforms used by placed students</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOP_RESOURCES.map((r) => {
            const Icon = r.icon;
            return (
              <a
                key={r.name}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group glass-card rounded-2xl p-5 hover:shadow-elegant hover:-translate-y-1 transition-all flex items-start gap-4 border border-white/5 hover:border-primary/20"
              >
                <div
                  className={`size-10 rounded-xl bg-gradient-to-br ${r.color} grid place-items-center shrink-0`}
                >
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

      {/* ── Company Tracks ── */}
      <section className="mt-10">
        <div className="mb-4">
          <h2 className="text-xl font-bold">Company-specific preparation</h2>
          <p className="text-sm text-muted-foreground">
            Dedicated tracks with interview process, top questions, and prep roadmaps.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {COMPANIES.map((c) => (
            <Link
              key={c.slug}
              to="/companies/$slug"
              params={{ slug: c.slug }}
              className="group glass-card rounded-2xl p-5 hover:shadow-elegant hover:-translate-y-1 transition-all border border-white/5 hover:border-primary/20"
            >
              <div className={`size-10 rounded-xl bg-gradient-to-br ${c.color} mb-3`} />
              <p className="font-bold">{c.name}</p>
              <p className="text-xs text-muted-foreground">
                {c.role} • {c.ctc}
              </p>
              <p className="mt-3 text-xs flex items-center gap-1 text-primary font-semibold">
                Open track <ArrowRight className="size-3" />
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <div className="mt-10 glass-card rounded-2xl p-8 text-center border border-primary/10 bg-gradient-to-br from-primary/5 to-accent/5">
        <Trophy className="size-10 mx-auto text-primary mb-3" />
        <h3 className="text-2xl font-bold mb-2">Ready for the Full Mock Test?</h3>
        <p className="text-muted-foreground text-sm mb-5 max-w-md mx-auto">
          Simulate a real 90-minute placement exam with auto-scoring, section-wise analysis, and a
          detailed report.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Button variant="hero" size="lg" asChild>
            <a href="https://www.m4maths.com/placement-puzzles.php" target="_blank" rel="noopener noreferrer">
              Take Free Mock Test <ExternalLink className="size-4 ml-1" />
            </a>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <a href="https://www.freshersworld.com/placement-papers" target="_blank" rel="noopener noreferrer">
              Browse Papers <ChevronRight className="size-4" />
            </a>
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
