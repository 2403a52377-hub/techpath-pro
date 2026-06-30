import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Map,
  Code2,
  FileText,
  Bot,
  Briefcase,
  Trophy,
  Sparkles,
  CheckCircle2,
  Github,
  Linkedin,
  GraduationCap,
  Star,
  Quote,
} from "lucide-react";

export const Route = createFileRoute("/")({ component: Landing });

const FEATURES = [
  {
    icon: Map,
    title: "Personalized Roadmaps",
    desc: "Beginner → Advanced step-by-step paths across 14 engineering career domains.",
  },
  {
    icon: Code2,
    title: "Coding Practice",
    desc: "Curated DSA, company-tagged & contest problems on LeetCode, HackerRank & more.",
  },
  {
    icon: Bot,
    title: "TechLand AI",
    desc: "Your 24/7 AI career coach — resume review, mock interviews, study plans.",
  },
  {
    icon: FileText,
    title: "ATS Resume Builder",
    desc: "Premium templates, real-time scoring, one-click PDF & LinkedIn sync.",
  },
  {
    icon: Briefcase,
    title: "Placement Prep",
    desc: "Aptitude, reasoning, mock tests and dedicated tracks for top companies.",
  },
  {
    icon: Trophy,
    title: "Gamified Growth",
    desc: "XP, badges, streaks and leaderboards to keep you shipping every day.",
  },
];

const COMPANIES = [
  "Google",
  "Amazon",
  "Microsoft",
  "TCS",
  "Infosys",
  "Accenture",
  "Wipro",
  "Cognizant",
];

function Landing() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/60">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="TechLand Logo" className="size-9 object-contain" />
            <span className="text-xl font-bold gradient-text">TechLand</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground">
              Features
            </a>
            <a href="#roadmaps" className="hover:text-foreground">
              Roadmaps
            </a>
            <a href="#companies" className="hover:text-foreground">
              Companies
            </a>
            <a href="#stats" className="hover:text-foreground">
              Impact
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link to="/auth">Log in</Link>
            </Button>
            <Button variant="hero" asChild>
              <Link to="/auth" search={{ tab: "signup" }}>
                Get Started
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-24 lg:pt-28 lg:pb-32">
        <div className="absolute inset-0 bg-gradient-hero opacity-[0.07]" />
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-sm font-medium mb-6">
              <Sparkles className="size-4 text-accent" />
              <span>AI-powered career platform for engineering students</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
              From <span className="gradient-text">first line of code</span>
              <br />
              to your dream offer letter.
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl">
              TechLand is your end-to-end career ecosystem — roadmaps, coding practice, mock
              interviews, resume builder, mentorship and an AI coach, all in one premium platform
              built for engineers.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button variant="hero" size="xl" asChild>
                <Link to="/auth" search={{ tab: "signup" }}>
                  Start your journey <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <a href="#features">Explore platform</a>
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
              {[
                "Free for students",
                "14 career domains",
                "Institute email verified",
                "AI mock interviews",
              ].map((t) => (
                <div key={t} className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-success" />
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* Floating preview card */}
          <div className="mt-16 lg:absolute lg:right-6 lg:top-32 lg:mt-0 lg:max-w-md w-full">
            <div className="glass-card rounded-2xl p-6 shadow-elegant">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-muted-foreground">Placement Readiness</p>
                  <p className="text-3xl font-bold gradient-text">78%</p>
                </div>
                <div className="size-12 rounded-xl bg-gradient-accent grid place-items-center">
                  <Trophy className="size-6 text-accent-foreground" />
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { l: "DSA Patterns", v: 85 },
                  { l: "System Design", v: 60 },
                  { l: "Resume Score", v: 92 },
                  { l: "Mock Interviews", v: 70 },
                ].map((r) => (
                  <div key={r.l}>
                    <div className="flex justify-between text-xs mb-1">
                      <span>{r.l}</span>
                      <span className="font-semibold">{r.v}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-gradient-primary" style={{ width: `${r.v}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="py-16 border-y border-border/60 bg-background/40">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {[
            { v: "50K+", l: "Active students" },
            { v: "14", l: "Career domains" },
            { v: "1200+", l: "Curated resources" },
            { v: "92%", l: "Placement success" },
          ].map((s) => (
            <div key={s.l}>
              <p className="text-4xl lg:text-5xl font-bold gradient-text">{s.v}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-accent uppercase tracking-widest">
              Everything you need
            </p>
            <h2 className="mt-3 text-4xl lg:text-5xl font-bold">A complete career ecosystem.</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Stop juggling 15 tabs. TechLand brings learning, practice, preparation, and placement
              under one roof.
            </p>
          </div>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="group glass-card rounded-2xl p-6 hover:shadow-elegant hover:-translate-y-1 transition-all"
                >
                  <div className="size-12 rounded-xl bg-gradient-primary grid place-items-center mb-4 group-hover:shadow-glow transition-shadow">
                    <Icon className="size-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Roadmaps */}
      <section id="roadmaps" className="py-24 bg-background/40 border-y border-border/60">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl lg:text-5xl font-bold">Choose a path. We'll guide the rest.</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            14 industry-aligned career roadmaps designed with mentors from Google, Amazon, Microsoft
            and IITs.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            {[
              "Full Stack",
              "Frontend",
              "Backend",
              "Data Analyst",
              "Data Scientist",
              "AI/ML",
              "Cybersecurity",
              "Cloud",
              "DevOps",
              "Mobile",
              "UI/UX",
              "Blockchain",
              "Testing",
              "Analytics",
            ].map((d) => (
              <span
                key={d}
                className="px-4 py-2 rounded-full glass-card text-sm font-medium hover:shadow-glow transition-shadow cursor-default"
              >
                {d}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Companies */}
      <section id="companies" className="py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm font-semibold text-accent uppercase tracking-widest">
            Dedicated tracks
          </p>
          <h2 className="mt-3 text-4xl lg:text-5xl font-bold">Prep for the companies you want.</h2>
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {COMPANIES.map((c) => (
              <div
                key={c}
                className="glass-card rounded-xl p-6 hover:shadow-elegant transition-all"
              >
                <Building />
                <p className="mt-2 font-semibold">{c}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-background/40 border-y border-border/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-sm font-semibold text-accent uppercase tracking-widest">
              Loved by students
            </p>
            <h2 className="mt-3 text-4xl lg:text-5xl font-bold">Real wins. Real offers.</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              From first-year explorers to final-year placement champs.
            </p>
          </div>
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {[
              {
                n: "Ananya Sharma",
                r: "SDE Intern @ Amazon",
                q: "The AI mock interviews felt scarily real. I walked into my Amazon loop calm and confident.",
                c: "IIT Roorkee · CSE",
              },
              {
                n: "Rohan Mehta",
                r: "Data Analyst @ Flipkart",
                q: "Roadmaps + YouTube playlists in one place. I stopped doom-scrolling tutorials and actually shipped projects.",
                c: "VIT · IT",
              },
              {
                n: "Priya Iyer",
                r: "Frontend Engineer @ Razorpay",
                q: "Resume builder bumped my ATS score from 52 to 91. Got 4 interview calls in the same week.",
                c: "BITS Pilani · ECE",
              },
            ].map((t) => (
              <div
                key={t.n}
                className="glass-card rounded-2xl p-6 hover:shadow-elegant transition-all"
              >
                <Quote className="size-6 text-accent mb-3" />
                <p className="text-sm leading-relaxed">"{t.q}"</p>
                <div className="mt-4 flex items-center gap-1 text-accent">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-4 fill-current" />
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-border/60">
                  <p className="font-semibold text-sm">{t.n}</p>
                  <p className="text-xs text-muted-foreground">{t.r}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.c}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-12 lg:p-16 shadow-elegant">
            <div className="absolute -top-20 -right-20 size-72 rounded-full bg-accent/30 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 size-72 rounded-full bg-secondary/30 blur-3xl" />
            <div className="relative">
              <GraduationCap className="size-12 text-primary-foreground mb-4" />
              <h2 className="text-4xl lg:text-5xl font-bold text-primary-foreground">
                Your offer letter starts here.
              </h2>
              <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl">
                Join thousands of engineering students already shipping projects, cracking
                interviews, and landing offers with TechLand.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button
                  size="xl"
                  className="bg-background text-foreground hover:bg-background/90"
                  asChild
                >
                  <Link to="/auth" search={{ tab: "signup" }}>
                    Create free account <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-gradient-primary grid place-items-center text-primary-foreground font-bold">
              T
            </div>
            <span className="font-bold gradient-text">TechLand</span>
            <span className="text-sm text-muted-foreground">© 2026</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Built for engineering students. Powered by AI.
          </p>
          <div className="flex gap-4 text-muted-foreground">
            <a href="#" aria-label="GitHub">
              <Github className="size-5 hover:text-foreground" />
            </a>
            <a href="#" aria-label="LinkedIn">
              <Linkedin className="size-5 hover:text-foreground" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Building() {
  return <div className="size-10 rounded-lg bg-gradient-primary mx-auto" />;
}
