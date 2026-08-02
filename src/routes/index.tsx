import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Map,
  Code2,
  FileText,
  Briefcase,
  Trophy,
  Sparkles,
  CheckCircle2,
  Github,
  Linkedin,
  GraduationCap,
  Star,
  Quote,
  Zap,
  Target,
  Users,
  BookOpen,
  FolderGit2,
  MessagesSquare,
  TrendingUp,
  Award,
  Clock,
  ChevronRight,
  Flame,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/")({ component: Landing });

/* ── Animated counter hook ── */
function useCounter(end: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration, start]);
  return count;
}

/* ── Data ── */
const STATS = [
  { value: 12400, suffix: "+", label: "Students Enrolled", icon: Users },
  { value: 14, suffix: "", label: "Career Domains", icon: Map },
  { value: 128, suffix: "+", label: "Mock Test Questions", icon: Target },
  { value: 89, suffix: "%", label: "Placement Rate", icon: Trophy },
];

const FEATURES = [
  {
    icon: Map,
    title: "Smart Roadmaps",
    desc: "14 industry-aligned paths from beginner to job-ready. Built with mentors from Google, Amazon & IITs.",
    tag: "14 domains",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Code2,
    title: "Coding Practice",
    desc: "DSA, company-tagged & contest problems with LeetCode, HackerRank tracks and detailed solutions.",
    tag: "500+ problems",
    color: "from-violet-500 to-purple-500",
  },
  {
    icon: Target,
    title: "Placement Prep",
    desc: "128+ aptitude, reasoning & verbal questions. Mock tests with session-wise randomization.",
    tag: "128+ questions",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: FileText,
    title: "Resume Builder",
    desc: "ATS-optimized templates, real-time scoring, certifications with PDF upload & one-click export.",
    tag: "ATS Friendly",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: MessagesSquare,
    title: "Interview Prep",
    desc: "Technical + HR mock interviews. Real questions from top companies with expert feedback.",
    tag: "Mock Interviews",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: Sparkles,
    title: "Free Mentorship",
    desc: "1:1 sessions with engineers from Google, Amazon, Razorpay. Learn directly from the industry.",
    tag: "1:1 Sessions",
    color: "from-amber-500 to-yellow-500",
  },
];

const JOURNEY = [
  { step: "01", title: "Pick Your Path", desc: "Choose from 14 career roadmaps tailored to your goal", icon: Map },
  { step: "02", title: "Learn & Practice", desc: "Follow structured modules, code daily, build projects", icon: BookOpen },
  { step: "03", title: "Prep for Placements", desc: "Mock tests, interview prep, ATS resume — all in one place", icon: Target },
  { step: "04", title: "Land Your Offer", desc: "Apply with confidence. Track companies. Get placed.", icon: Award },
];

const COMPANIES = [
  { name: "Google", color: "from-blue-500 to-green-500" },
  { name: "Amazon", color: "from-orange-400 to-yellow-500" },
  { name: "Microsoft", color: "from-blue-400 to-blue-600" },
  { name: "TCS", color: "from-blue-600 to-indigo-600" },
  { name: "Infosys", color: "from-indigo-500 to-blue-500" },
  { name: "Wipro", color: "from-violet-500 to-purple-500" },
  { name: "Accenture", color: "from-purple-500 to-pink-500" },
  { name: "Cognizant", color: "from-blue-500 to-cyan-500" },
  { name: "Zoho", color: "from-red-500 to-orange-500" },
  { name: "Razorpay", color: "from-blue-600 to-cyan-600" },
  { name: "Flipkart", color: "from-yellow-500 to-orange-500" },
  { name: "Swiggy", color: "from-orange-500 to-red-500" },
];

const TESTIMONIALS = [
  {
    name: "Ananya Sharma",
    role: "SDE Intern @ Amazon",
    college: "IIT Roorkee · CSE · 2025",
    quote: "The mock interviews felt scarily real. I walked into my Amazon loop completely calm and confident. Got the offer in 3 rounds.",
    avatar: "AS",
    color: "from-violet-500 to-purple-600",
    xp: "4200 XP",
  },
  {
    name: "Rohan Mehta",
    role: "Data Analyst @ Flipkart",
    college: "VIT Vellore · IT · 2024",
    quote: "Roadmaps + resources in one place changed everything. I stopped doom-scrolling tutorials and actually shipped 3 full-stack projects.",
    avatar: "RM",
    color: "from-blue-500 to-cyan-600",
    xp: "5800 XP",
  },
  {
    name: "Priya Iyer",
    role: "Frontend Engineer @ Razorpay",
    college: "BITS Pilani · ECE · 2025",
    quote: "Resume builder bumped my ATS score from 52 to 91. Got 4 interview calls the same week. TechLand is genuinely a game changer.",
    avatar: "PI",
    color: "from-emerald-500 to-teal-600",
    xp: "3900 XP",
  },
];

/* ── Stats section with IntersectionObserver ── */
function StatsSection() {
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} id="stats" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((s) => {
            const count = useCounter(s.value, 2000, started);
            const Icon = s.icon;
            return (
              <div key={s.label} className="glass-card rounded-2xl p-6 text-center group hover:-translate-y-1 transition-all duration-300">
                <div className="size-12 rounded-xl bg-gradient-primary grid place-items-center mx-auto mb-4 group-hover:shadow-glow transition-shadow">
                  <Icon className="size-6 text-primary-foreground" />
                </div>
                <p className="text-4xl lg:text-5xl font-extrabold gradient-text tabular-nums">
                  {count.toLocaleString()}{s.suffix}
                </p>
                <p className="mt-2 text-sm text-muted-foreground font-medium">{s.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── Main ── */
function Landing() {
  return (
    <div className="min-h-screen overflow-x-hidden">

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/60">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="bg-white p-1 rounded-xl size-9 flex items-center justify-center shrink-0 shadow-md">
              <img src="/logo.png" alt="TechLand" className="size-full object-contain" />
            </div>
            <span className="text-xl font-bold gradient-text">TechLand</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#journey" className="hover:text-foreground transition-colors">How it works</a>
            <a href="#companies" className="hover:text-foreground transition-colors">Companies</a>
            <a href="#testimonials" className="hover:text-foreground transition-colors">Stories</a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/auth">Log in</Link>
            </Button>
            <Button variant="hero" size="sm" asChild>
              <Link to="/auth" search={{ tab: "signup" }}>Get Started Free</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        <div className="absolute top-20 left-1/4 size-96 rounded-full bg-primary/15 blur-3xl animate-pulse" style={{ animationDuration: "4s" }} />
        <div className="absolute bottom-20 right-1/4 size-80 rounded-full bg-accent/15 blur-3xl animate-pulse" style={{ animationDuration: "6s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] rounded-full bg-secondary/8 blur-3xl" />

        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-32 relative w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left copy */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm font-semibold mb-8 border border-primary/20">
                <Flame className="size-4 text-orange-400" />
                <span>12,400+ students already building their future</span>
              </div>

              <h1 className="text-5xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight leading-[1.05]">
                Turn your{" "}
                <span className="gradient-text">code skills</span>
                <br />into your dream{" "}
                <span className="relative">
                  <span className="gradient-text">career.</span>
                  <svg className="absolute -bottom-2 left-0 w-full" height="6" viewBox="0 0 200 6" fill="none">
                    <path d="M0 3 Q50 0 100 3 Q150 6 200 3" stroke="url(#u)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                    <defs><linearGradient id="u" x1="0" x2="200" gradientUnits="userSpaceOnUse"><stop stopColor="var(--primary)"/><stop offset="1" stopColor="var(--accent)"/></linearGradient></defs>
                  </svg>
                </span>
              </h1>

              <p className="mt-7 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl">
                TechLand is the all-in-one placement platform — roadmaps, DSA practice, mock tests, ATS resume builder, interview prep and mentorship. <strong className="text-foreground">Everything free for students.</strong>
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Button variant="hero" size="xl" asChild className="shadow-elegant">
                  <Link to="/auth" search={{ tab: "signup" }}>
                    Start for free <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="xl" asChild>
                  <a href="#features">See what's inside</a>
                </Button>
              </div>

              <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
                {["100% Free for students", "No credit card needed", "Institute email verified", "128+ placement questions"].map((t) => (
                  <div key={t} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                    {t}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — live dashboard card */}
            <div className="relative lg:flex lg:justify-end">
              {/* Main card */}
              <div className="glass-card rounded-3xl p-6 shadow-elegant max-w-sm w-full border border-primary/20 relative z-10">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Placement Readiness</p>
                    <p className="text-4xl font-extrabold gradient-text">78%</p>
                  </div>
                  <div className="size-14 rounded-2xl bg-gradient-primary grid place-items-center shadow-glow">
                    <Trophy className="size-7 text-primary-foreground" />
                  </div>
                </div>

                <div className="space-y-3.5">
                  {[
                    { l: "DSA Patterns", v: 85, color: "bg-gradient-to-r from-blue-500 to-cyan-500" },
                    { l: "System Design", v: 60, color: "bg-gradient-to-r from-violet-500 to-purple-500" },
                    { l: "Resume Score", v: 92, color: "bg-gradient-to-r from-emerald-500 to-teal-500" },
                    { l: "Mock Interviews", v: 70, color: "bg-gradient-to-r from-orange-500 to-amber-500" },
                  ].map((r) => (
                    <div key={r.l}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="font-medium">{r.l}</span>
                        <span className="font-bold">{r.v}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div className={`h-full rounded-full ${r.color}`} style={{ width: `${r.v}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 pt-4 border-t border-border/60 flex items-center gap-3">
                  <div className="size-8 rounded-full bg-gradient-to-br from-primary to-accent grid place-items-center text-primary-foreground text-xs font-bold">R</div>
                  <div>
                    <p className="text-xs font-semibold">Rohan Mehta</p>
                    <p className="text-[10px] text-muted-foreground">VIT · 5800 XP · 🔥 24-day streak</p>
                  </div>
                  <div className="ml-auto">
                    <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">Active</span>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -top-4 -left-4 glass-card rounded-2xl px-4 py-3 shadow-md border border-emerald-500/20 flex items-center gap-2 z-20">
                <div className="size-7 rounded-full bg-emerald-500/20 grid place-items-center">
                  <Zap className="size-4 text-emerald-500" />
                </div>
                <div>
                  <p className="text-xs font-bold">+350 XP earned</p>
                  <p className="text-[10px] text-muted-foreground">Today's session</p>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 glass-card rounded-2xl px-4 py-3 shadow-md border border-primary/20 flex items-center gap-2 z-20">
                <div className="size-7 rounded-full bg-primary/20 grid place-items-center">
                  <Award className="size-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold">Resume: 92/100</p>
                  <p className="text-[10px] text-muted-foreground">ATS Score</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <StatsSection />

      {/* ── Features ── */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold uppercase tracking-widest mb-4">
              <Sparkles className="size-3" /> Everything you need
            </div>
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
              One platform.<br />
              <span className="gradient-text">Complete placement prep.</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Stop juggling 15 tabs. TechLand brings learning, practice, preparation and placement under one roof — completely free.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="group glass-card rounded-2xl p-6 hover:shadow-elegant hover:-translate-y-1.5 transition-all duration-300 border border-border/40 hover:border-primary/30 relative overflow-hidden">
                  <div className={`absolute top-0 right-0 size-32 rounded-full bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-5 blur-2xl transition-opacity duration-500`} />
                  <div className={`size-12 rounded-xl bg-gradient-to-br ${f.color} grid place-items-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="size-6 text-white" />
                  </div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-lg font-bold">{f.title}</h3>
                    <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full shrink-0 mt-0.5">{f.tag}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-primary text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore <ChevronRight className="size-3" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Journey / How it works ── */}
      <section id="journey" className="py-24 bg-background/40 border-y border-border/60 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-widest mb-4">
              <Clock className="size-3" /> Your journey
            </div>
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
              From zero to <span className="gradient-text">placed</span> — here's how.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connector line */}
            <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

            {JOURNEY.map((j, i) => {
              const Icon = j.icon;
              return (
                <div key={j.step} className="glass-card rounded-2xl p-6 text-center group hover:-translate-y-1 transition-all duration-300 relative">
                  <div className="relative mb-5">
                    <div className="size-16 rounded-2xl bg-gradient-primary grid place-items-center mx-auto shadow-md group-hover:shadow-glow transition-shadow duration-300">
                      <Icon className="size-8 text-primary-foreground" />
                    </div>
                    <span className="absolute -top-2 -right-2 size-6 rounded-full bg-accent text-accent-foreground text-xs font-extrabold grid place-items-center shadow-md">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-2">{j.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{j.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Roadmap Domains ── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-semibold uppercase tracking-widest mb-4">
                <Map className="size-3" /> Career paths
              </div>
              <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
                14 paths. One platform.<br />
                <span className="gradient-text">You choose.</span>
              </h2>
            </div>
            <p className="text-muted-foreground max-w-sm">Curated by industry mentors from top companies and IITs. Step-by-step from beginner to job-ready.</p>
          </div>

          <div className="flex flex-wrap gap-3">
            {[
              { name: "Full Stack", hot: true }, { name: "Frontend", hot: false }, { name: "Backend", hot: false },
              { name: "Data Science", hot: true }, { name: "AI / ML", hot: true }, { name: "Data Analyst", hot: false },
              { name: "Cybersecurity", hot: false }, { name: "Cloud & DevOps", hot: true }, { name: "Mobile Dev", hot: false },
              { name: "UI / UX Design", hot: false }, { name: "Blockchain", hot: false }, { name: "QA & Testing", hot: false },
              { name: "Analytics", hot: false }, { name: "System Design", hot: true },
            ].map((d) => (
              <span key={d.name} className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-default hover:-translate-y-0.5 ${d.hot ? "bg-gradient-primary text-primary-foreground shadow-md hover:shadow-glow" : "glass-card hover:shadow-elegant border border-border/60"}`}>
                {d.name}
                {d.hot && <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full">🔥 Hot</span>}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Companies ── */}
      <section id="companies" className="py-24 bg-background/40 border-y border-border/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold uppercase tracking-widest mb-4">
              <Briefcase className="size-3" /> Company tracks
            </div>
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
              Prep for the companies<br />
              <span className="gradient-text">you actually want.</span>
            </h2>
            <p className="mt-4 text-muted-foreground">Dedicated company-wise mock tests, interview patterns, past questions and salary benchmarks.</p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {COMPANIES.map((c) => (
              <div key={c.name} className="group glass-card rounded-2xl p-5 hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 text-center border border-border/40 hover:border-primary/20">
                <div className={`size-10 rounded-xl bg-gradient-to-br ${c.color} mx-auto mb-3 shadow-sm group-hover:shadow-md transition-shadow`} />
                <p className="text-sm font-bold">{c.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-semibold uppercase tracking-widest mb-4">
              <Star className="size-3 fill-current" /> Student wins
            </div>
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
              Real students.<br />
              <span className="gradient-text">Real offers.</span>
            </h2>
            <p className="mt-4 text-muted-foreground">From first-year explorers to final-year placement champs — here's what they built.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="glass-card rounded-2xl p-6 hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 border border-border/40 flex flex-col">
                <Quote className="size-8 text-accent mb-4 opacity-60" />
                <p className="text-sm leading-relaxed flex-1">"{t.quote}"</p>
                <div className="flex mt-3 mb-5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-4 text-amber-400 fill-current" />
                  ))}
                </div>
                <div className="pt-4 border-t border-border/60 flex items-center gap-3">
                  <div className={`size-10 rounded-full bg-gradient-to-br ${t.color} grid place-items-center text-white text-sm font-extrabold shrink-0`}>
                    {t.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{t.role}</p>
                    <p className="text-[10px] text-muted-foreground">{t.college}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{t.xp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-12 lg:p-20 shadow-elegant text-center">
            <div className="absolute -top-24 -right-24 size-80 rounded-full bg-accent/25 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 size-80 rounded-full bg-secondary/25 blur-3xl" />
            <div className="absolute inset-0 bg-gradient-mesh opacity-20" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 text-white text-sm font-semibold mb-8 border border-white/20">
                <Zap className="size-4" /> Start building today — it's completely free
              </div>
              <h2 className="text-4xl lg:text-6xl font-extrabold text-primary-foreground leading-tight">
                Your offer letter<br />starts here.
              </h2>
              <p className="mt-6 text-lg text-primary-foreground/80 max-w-2xl mx-auto">
                Join 12,400+ engineering students already using TechLand to crack placements at Google, Amazon, Microsoft and more.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Button size="xl" className="bg-white text-primary hover:bg-white/90 font-bold shadow-elegant" asChild>
                  <Link to="/auth" search={{ tab: "signup" }}>
                    Create free account <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button size="xl" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
                  <Link to="/auth">Log in</Link>
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-primary-foreground/70">
                {["No credit card", "Instant access", "Free forever for students"].map((t) => (
                  <div key={t} className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-300" /> {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border/60 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-white p-1 rounded-lg size-8 flex items-center justify-center shadow-sm">
                <img src="/logo.png" alt="TechLand" className="size-full object-contain" />
              </div>
              <span className="font-bold gradient-text">TechLand</span>
              <span className="text-sm text-muted-foreground">© 2026</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Built for engineering students. Free forever. 🚀
            </p>
            <div className="flex gap-4 text-muted-foreground">
              <a href="#" aria-label="GitHub" className="hover:text-foreground transition-colors">
                <Github className="size-5" />
              </a>
              <a href="#" aria-label="LinkedIn" className="hover:text-foreground transition-colors">
                <Linkedin className="size-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
