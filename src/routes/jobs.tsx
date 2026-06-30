import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "./roadmaps.index";
import {
  Search, Globe2, Building2, Calendar, RefreshCw, ExternalLink, X,
  MapPin, Briefcase, Loader2, Wifi, WifiOff, Zap, GraduationCap,
  IndianRupee, Clock, BadgeCheck, TrendingUp, ChevronDown, ChevronUp,
  Bookmark, BookmarkCheck, Send, CheckCircle2, User, Mail, Phone,
  FileText, Tag,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/jobs")({ component: JobsPage });

/* ──────── INDIA KEYWORDS ──── */
const INDIA_KW = ["india","bangalore","bengaluru","hyderabad","mumbai","delhi","pune","chennai","noida","gurugram","gurgaon","kolkata","ahmedabad","jaipur","kochi","remote"];
function isIndiaJob(loc: string, remote: boolean) {
  return remote || INDIA_KW.some((k) => loc.toLowerCase().includes(k));
}

/* ──────── DOMAINS ──── */
const DOMAINS: Record<string, string[]> = {
  "All":              [],
  "Frontend":         ["react","vue","angular","css","html","javascript","typescript","nextjs","svelte","frontend","ui"],
  "Backend":          ["python","java","nodejs","node","golang","php","ruby","backend","django","spring","fastapi"],
  "Full Stack":       ["fullstack","full-stack","mern","react","node","mongodb"],
  "Data Science/AI":  ["python","ml","machine-learning","data","ai","tensorflow","pytorch","nlp"],
  "Cloud & DevOps":   ["aws","azure","gcp","docker","kubernetes","devops","terraform","cloud"],
  "Mobile":           ["android","ios","flutter","react-native","swift","kotlin","mobile"],
  "Design":           ["figma","ui-ux","design","ux","css"],
};
const DOMAIN_COLOR: Record<string, string> = {
  "All":"bg-primary/10 text-primary border-primary/20",
  "Frontend":"bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  "Backend":"bg-green-500/10 text-green-400 border-green-500/20",
  "Full Stack":"bg-violet-500/10 text-violet-400 border-violet-500/20",
  "Data Science/AI":"bg-orange-500/10 text-orange-400 border-orange-500/20",
  "Cloud & DevOps":"bg-sky-500/10 text-sky-400 border-sky-500/20",
  "Mobile":"bg-pink-500/10 text-pink-400 border-pink-500/20",
  "Design":"bg-rose-500/10 text-rose-400 border-rose-500/20",
};

/* ──────── TYPES ──── */
type LiveJob = {
  id:string; title:string; company:string; location:string; remote:boolean;
  tags:string[]; jobTypes:string[]; description:string; applyUrl:string;
  source:string; postedAt:number;
};
type Internship = {
  id:string; role:string; company:string; domain:string; about:string;
  stipend:string; duration:string; location:string; skills:string[];
  applyUrl:string; openings:number; lastDate:string; perks:string[];
  whoCanApply:string; responsibilities:string[];
};
type AppForm = { name:string; email:string; phone:string; coverLetter:string; resumeUrl:string };

/* ──────── INTERNSHIP DATA ──── */
const INTERNSHIPS: Internship[] = [
  { id:"i1", role:"Frontend Developer Intern", company:"Razorpay", domain:"Frontend",
    about:"Razorpay is India's leading payment gateway. You will work on the merchant-facing dashboard — building new UI components, improving performance, and integrating analytics.",
    stipend:"₹20,000–₹25,000/mo", duration:"6 months", location:"Bangalore", openings:5, lastDate:"2026-07-31",
    skills:["React","TypeScript","CSS","REST APIs"], perks:["Certificate","PPO Opportunity","Flexible Hours","Free Meals"],
    whoCanApply:"B.Tech/M.Tech CSE/IT students graduating in 2025 or 2026 with strong React fundamentals.",
    responsibilities:["Build and maintain reusable React components","Collaborate with designers to implement pixel-perfect UIs","Write unit tests using Jest","Optimize bundle size and page performance","Integrate REST APIs and handle async state"],
    applyUrl:"https://internshala.com/internships/web-development-internship/" },
  { id:"i2", role:"UI/UX & Frontend Intern", company:"Swiggy", domain:"Frontend",
    about:"At Swiggy you'll join the consumer apps team. Work on features used by millions of users ordering food daily. Your code directly impacts delivery experience.",
    stipend:"₹18,000–₹22,000/mo", duration:"3 months", location:"Bangalore", openings:3, lastDate:"2026-07-20",
    skills:["React","Figma","Tailwind CSS","JavaScript"], perks:["Certificate","Stipend","Mentor Assigned","Free Swiggy Credits"],
    whoCanApply:"2nd/3rd year B.Tech students with portfolio. Must know React and Figma basics.",
    responsibilities:["Design and implement new UI screens in React","Create Figma prototypes for A/B testing","Improve mobile responsiveness of web app","Fix UI bugs reported by QA","Conduct user research and present findings"],
    applyUrl:"https://internshala.com/internships/web-development-internship/" },
  { id:"i3", role:"React Developer Intern", company:"Zoho", domain:"Frontend",
    about:"Zoho builds productivity software used by 80M+ users worldwide. As a React intern you'll work on one of their SaaS modules (CRM, Projects, or Books).",
    stipend:"₹15,000/mo", duration:"6 months", location:"Chennai", openings:8, lastDate:"2026-08-15",
    skills:["React","JavaScript","HTML/CSS","Git"], perks:["Certificate","PPO","Lunch Provided","On-campus Housing Option"],
    whoCanApply:"Final-year B.Tech CSE students. Must complete Zoho's online coding test.",
    responsibilities:["Build features for Zoho CRM frontend","Write clean, maintainable React code","Participate in daily standups","Fix bugs from bug tracker","Write documentation for components"],
    applyUrl:"https://internshala.com/internships/javascript-internship/" },
  { id:"i4", role:"Backend Developer Intern", company:"Infosys", domain:"Backend",
    about:"Infosys offers structured 6-month internships with dedicated mentors. You'll work on real client projects in Java/Spring Boot, contributing to enterprise software.",
    stipend:"₹15,000/mo", duration:"6 months", location:"Multiple Cities", openings:20, lastDate:"2026-08-01",
    skills:["Java","Spring Boot","MySQL","REST APIs"], perks:["Certificate","PPO","Training Program","Relocation Support"],
    whoCanApply:"B.Tech/BCA/MCA students from any stream with Java knowledge. 60%+ academics preferred.",
    responsibilities:["Develop REST APIs using Spring Boot","Write unit tests with JUnit","Work on database design and optimization","Attend training sessions and workshops","Contribute to internal tools and automation"],
    applyUrl:"https://internshala.com/internships/java-internship/" },
  { id:"i5", role:"Python Backend Intern", company:"HashedIn by Deloitte", domain:"Backend",
    about:"HashedIn (a Deloitte company) builds cloud-native products. You'll work on Python microservices, contributing to client-facing APIs.",
    stipend:"₹20,000/mo", duration:"6 months", location:"Bangalore", openings:6, lastDate:"2026-07-30",
    skills:["Python","Django","PostgreSQL","Docker"], perks:["Certificate","PPO","Mentorship","Health Insurance"],
    whoCanApply:"Pre-final or final year B.Tech. Strong Python skills. Knowledge of REST APIs required.",
    responsibilities:["Build and maintain Django REST APIs","Write database migrations and queries","Integrate third-party APIs","Participate in code reviews","Deploy services using Docker on AWS"],
    applyUrl:"https://internshala.com/internships/python-internship/" },
  { id:"i6", role:"Full Stack Developer Intern", company:"Groww", domain:"Full Stack",
    about:"Groww is India's largest investment platform with 10M+ users. As a full-stack intern, you'll work across frontend and backend on features used by real investors.",
    stipend:"₹20,000–₹30,000/mo", duration:"6 months", location:"Bangalore", openings:5, lastDate:"2026-07-31",
    skills:["React","Node.js","MongoDB","Express"], perks:["PPO Opportunity","Certificate","ESOPs","Free Lunch"],
    whoCanApply:"Final-year B.Tech with MERN stack experience. Portfolio or GitHub required.",
    responsibilities:["Build full-stack features end-to-end","Design MongoDB schemas","Build and consume REST/GraphQL APIs","Collaborate with product and design","Write automated tests"],
    applyUrl:"https://internshala.com/internships/full-stack-development-internship/" },
  { id:"i7", role:"MERN Stack Intern", company:"BrowserStack", domain:"Full Stack",
    about:"BrowserStack is a global testing platform used by Netflix, Microsoft, and 50K+ companies. Your work will touch developer tooling used worldwide.",
    stipend:"₹22,000/mo", duration:"6 months", location:"Mumbai (Remote OK)", openings:3, lastDate:"2026-08-05",
    skills:["MongoDB","Express","React","Node.js"], perks:["Remote Option","Certificate","PPO","International Exposure"],
    whoCanApply:"B.Tech CSE students graduating 2026. Must have completed at least one full-stack project.",
    responsibilities:["Build internal dashboard features","Implement real-time test result streaming","Write clean TypeScript code","Optimize database queries","Deploy to AWS using CI/CD"],
    applyUrl:"https://internshala.com/internships/full-stack-development-internship/" },
  { id:"i8", role:"Data Science Intern", company:"Flipkart", domain:"Data Science/AI",
    about:"Flipkart's data science team works on recommendation engines, pricing algorithms, and supply chain forecasting. You'll work with terabytes of shopping data.",
    stipend:"₹25,000–₹35,000/mo", duration:"6 months", location:"Bangalore", openings:6, lastDate:"2026-07-31",
    skills:["Python","Pandas","Scikit-learn","SQL","Tableau"], perks:["PPO","Certificate","Free Meals","Cab Drop"],
    whoCanApply:"B.Tech/M.Tech CSE/Data Science students. Must know Python and SQL. ML knowledge preferred.",
    responsibilities:["Analyze large datasets using Pandas and SQL","Build predictive ML models","Create dashboards in Tableau","Present insights to product teams","Deploy models using Flask"],
    applyUrl:"https://internshala.com/internships/data-science-internship/" },
  { id:"i9", role:"ML Engineering Intern", company:"Google India", domain:"Data Science/AI",
    about:"Google India's ML team works on Search, Maps, and YouTube models. Top interns get return offers with competitive packages.",
    stipend:"₹50,000–₹80,000/mo", duration:"3 months", location:"Hyderabad", openings:2, lastDate:"2026-07-15",
    skills:["Python","TensorFlow","PyTorch","ML Algorithms"], perks:["Top Stipend","PPO","Certificate","Swag Kit","Referral Network"],
    whoCanApply:"Final-year B.Tech/M.Tech with strong ML fundamentals and competitive programming background. CGPA 8.0+ preferred.",
    responsibilities:["Implement ML models in TensorFlow/PyTorch","Run experiments and track results using MLflow","Write research summaries","Optimize model inference latency","Present work to senior engineers"],
    applyUrl:"https://internshala.com/internships/machine-learning-internship/" },
  { id:"i10", role:"Android Developer Intern", company:"PhonePe", domain:"Mobile",
    about:"PhonePe is India's leading UPI app with 500M+ users. You'll build features inside the PhonePe app — one of the most downloaded apps in India.",
    stipend:"₹20,000–₹25,000/mo", duration:"6 months", location:"Bangalore", openings:4, lastDate:"2026-07-31",
    skills:["Kotlin","Android SDK","Jetpack Compose","Retrofit"], perks:["Certificate","PPO","Gym","Team Outings"],
    whoCanApply:"B.Tech students with Android development experience. Must have at least one published app or GitHub project.",
    responsibilities:["Build new screens using Jetpack Compose","Integrate payment APIs","Write unit and UI tests","Fix crash bugs from Firebase Crashlytics","Improve app startup time"],
    applyUrl:"https://internshala.com/internships/android-app-development-internship/" },
  { id:"i11", role:"Flutter Developer Intern", company:"CRED", domain:"Mobile",
    about:"CRED is a premium fintech platform for credit card users. Known for exceptional design and engineering quality. Great PPO chances.",
    stipend:"₹25,000/mo", duration:"4 months", location:"Bangalore", openings:3, lastDate:"2026-07-20",
    skills:["Flutter","Dart","Firebase","State Management"], perks:["Certificate","PPO","Unlimited Snacks","Flexible Hours","WFH Option"],
    whoCanApply:"B.Tech students with Flutter experience. Strong UI skills and eye for design are a plus.",
    responsibilities:["Build beautiful Flutter screens from Figma designs","Implement state management using Riverpod/Bloc","Integrate Firebase for auth and analytics","Optimize app performance","Write widget tests"],
    applyUrl:"https://internshala.com/internships/android-app-development-internship/" },
  { id:"i12", role:"Cloud Intern (AWS)", company:"Accenture India", domain:"Cloud & DevOps",
    about:"Accenture's Cloud team deploys enterprise infrastructure on AWS for Fortune 500 clients. You'll get hands-on AWS experience and official certification support.",
    stipend:"₹15,000–₹18,000/mo", duration:"6 months", location:"Multiple Cities", openings:15, lastDate:"2026-08-15",
    skills:["AWS","Linux","Python","Terraform","Docker"], perks:["Certificate","AWS Certification Support","Training","PPO"],
    whoCanApply:"B.Tech from any branch. Cloud fundamentals required. AWS certification is a plus.",
    responsibilities:["Set up and manage AWS EC2, S3, RDS instances","Write Terraform infrastructure-as-code","Monitor cloud costs and optimize resources","Automate deployments using CI/CD pipelines","Document infrastructure setups"],
    applyUrl:"https://internshala.com/internships/computer-science-internship/" },
  { id:"i13", role:"UI/UX Design Intern", company:"Canva India", domain:"Design",
    about:"Canva India's design team works on the next-gen creative tools. You'll contribute to design systems, user research, and new feature prototypes.",
    stipend:"₹20,000/mo", duration:"3 months", location:"Remote", openings:5, lastDate:"2026-08-01",
    skills:["Figma","Prototyping","User Research","Design Systems"], perks:["Remote","Certificate","Stipend","Global Team Exposure","Canva Pro Access"],
    whoCanApply:"Design students or B.Tech students with strong UI/UX portfolio. Must share portfolio link when applying.",
    responsibilities:["Design high-fidelity mockups in Figma","Contribute to design system component library","Conduct user interviews and usability tests","Present designs to stakeholders","Collaborate with engineers for implementation"],
    applyUrl:"https://internshala.com/internships/ui-ux-design-internship/" },
];

/* ──────── FETCH LIVE JOBS ──── */
function stripHtml(h: string) { return h.replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim(); }

async function fetchRemotive(): Promise<LiveJob[]> {
  try {
    const r = await fetch("https://remotive.com/api/remote-jobs?category=software-dev&limit=60");
    if (!r.ok) return [];
    const j = await r.json();
    return (j.jobs ?? []).map((x: any) => ({
      id:`rem-${x.id}`, title:x.title, company:x.company_name,
      location:x.candidate_required_location||"Remote / Worldwide (India OK)",
      remote:true, tags:(x.tags??[]).map((t:string)=>t.toLowerCase()),
      jobTypes:[x.job_type??"full-time"], description:stripHtml(x.description??""),
      applyUrl:x.url, source:"Remotive", postedAt:new Date(x.publication_date).getTime(),
    }));
  } catch { return []; }
}

async function fetchArbeitnow(page=1): Promise<LiveJob[]> {
  try {
    const r = await fetch(`https://arbeitnow.com/api/job-board-api?page=${page}`);
    if (!r.ok) return [];
    const j = await r.json();
    return (j.data??[])
      .map((x:any) => ({
        id:x.slug, title:x.title, company:x.company_name,
        location:x.location||"Remote", remote:x.remote??false,
        tags:x.tags??[], jobTypes:x.job_types??[],
        description:stripHtml(x.description??""),
        applyUrl:x.url, source:"Arbeitnow", postedAt:x.created_at*1000,
      }))
      .filter((x: LiveJob) => isIndiaJob(x.location, x.remote));
  } catch { return []; }
}

function matchesDomain(job: LiveJob | Internship, domain: string): boolean {
  if (domain === "All") return true;
  const kw = DOMAINS[domain];
  if ("tags" in job) {
    const lj = job as LiveJob;
    return [...lj.tags, lj.title.toLowerCase()].some((h) => kw.some((k) => h.includes(k)));
  }
  const intern = job as Internship;
  return intern.domain === domain || intern.skills.some((s) => kw.some((k) => s.toLowerCase().includes(k)));
}

/* ──────── QUICK APPLY FORM ──── */
function QuickApplyForm({ role, company, applyUrl, onDone }: {
  role: string; company: string; applyUrl: string; onDone: () => void;
}) {
  const { user } = useAuth();
  const [form, setForm] = useState<AppForm>({
    name: user?.fullName ?? "", email: user?.email ?? "",
    phone: "", coverLetter: "", resumeUrl: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      toast.error("Please fill name, email, and phone");
      return;
    }
    // Save application locally
    const apps = JSON.parse(localStorage.getItem("myApplications") ?? "[]");
    apps.push({ role, company, appliedAt: new Date().toISOString(), status: "Applied", ...form });
    localStorage.setItem("myApplications", JSON.stringify(apps));
    setSubmitted(true);
    toast.success(`Application submitted for ${role} at ${company}!`);
  }

  if (submitted) {
    return (
      <div className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 text-center">
        <CheckCircle2 className="size-10 text-emerald-400 mx-auto mb-3" />
        <h3 className="font-bold text-lg">Application Submitted! 🎉</h3>
        <p className="text-sm text-muted-foreground mt-1 mb-4">
          Your interest has been recorded. Click below to complete the official application.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Button variant="hero" asChild>
            <a href={applyUrl} target="_blank" rel="noopener noreferrer">
              Complete Official Application <ExternalLink className="size-4 ml-1" />
            </a>
          </Button>
          <Button variant="outline" onClick={onDone}>Close</Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3 rounded-2xl border border-primary/20 bg-primary/3 p-5">
      <h3 className="font-bold text-base flex items-center gap-2">
        <Send className="size-4 text-primary" /> Quick Apply — {role}
      </h3>
      <p className="text-xs text-muted-foreground">Fill in your details — we'll save your application and then guide you to the official form.</p>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><User className="size-3" /> Full Name *</label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Your full name" className="h-9 text-sm" required />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Mail className="size-3" /> Email *</label>
          <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="your@email.com" className="h-9 text-sm" required />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Phone className="size-3" /> Phone *</label>
          <Input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+91 9876543210" className="h-9 text-sm" required />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><FileText className="size-3" /> Resume URL</label>
          <Input type="url" value={form.resumeUrl} onChange={(e) => setForm({ ...form, resumeUrl: e.target.value })}
            placeholder="drive.google.com/your-resume" className="h-9 text-sm" />
        </div>
      </div>
      <div>
        <label className="text-xs text-muted-foreground mb-1 block">Cover Letter / Why you? (optional)</label>
        <textarea value={form.coverLetter} onChange={(e) => setForm({ ...form, coverLetter: e.target.value })}
          rows={3} placeholder="Briefly tell why you're a great fit for this role…"
          className="w-full bg-background/50 border border-white/10 rounded-xl p-3 text-sm resize-none focus:outline-none focus:border-primary/50 transition-colors" />
      </div>
      <div className="flex gap-3">
        <Button type="submit" variant="hero" className="flex-1">
          <Send className="size-4" /> Submit Application
        </Button>
        <Button type="button" variant="outline" onClick={onDone}>Cancel</Button>
      </div>
    </form>
  );
}

/* ──────── MAIN PAGE ──── */
type Tab = "internships" | "jobs";

function JobsPage() {
  const [tab, setTab] = useState<Tab>("internships");
  const [jobs, setJobs] = useState<LiveJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [q, setQ] = useState("");
  const [domain, setDomain] = useState("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [saved, setSaved] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem("savedJobs3") ?? "[]")); }
    catch { return new Set(); }
  });

  const loadJobs = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const [r1, r2, r3] = await Promise.allSettled([
        fetchArbeitnow(1), fetchArbeitnow(2), fetchRemotive()
      ]);
      const all: LiveJob[] = [];
      if (r1.status === "fulfilled") all.push(...r1.value);
      if (r2.status === "fulfilled") all.push(...r2.value);
      if (r3.status === "fulfilled") all.push(...r3.value);
      const seen = new Set<string>();
      setJobs(all.filter((j) => { if (seen.has(j.id)) return false; seen.add(j.id); return true; }));
      setLastUpdated(new Date());
    } catch { setError("Could not load live jobs. Check your connection."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { if (tab === "jobs" && jobs.length === 0) loadJobs(); }, [tab]);
  useEffect(() => { const id = setInterval(loadJobs, 30*60*1000); return () => clearInterval(id); }, []);

  function toggleSave(id: string) {
    setSaved((p) => { const n = new Set(p); n.has(id)?n.delete(id):n.add(id); localStorage.setItem("savedJobs3",JSON.stringify([...n])); return n; });
  }

  const filteredInterns = INTERNSHIPS.filter((i) =>
    matchesDomain(i, domain) &&
    (!q || i.role.toLowerCase().includes(q.toLowerCase()) || i.company.toLowerCase().includes(q.toLowerCase()) || i.skills.some((s) => s.toLowerCase().includes(q.toLowerCase())))
  );

  const filteredJobs = jobs.filter((j) =>
    matchesDomain(j, domain) &&
    (!q || j.title.toLowerCase().includes(q.toLowerCase()) || j.company.toLowerCase().includes(q.toLowerCase()) || j.tags.some((t) => t.includes(q.toLowerCase())))
  );

  const domainCounts: Record<string, number> = {};
  Object.keys(DOMAINS).forEach((d) => {
    domainCounts[d] = tab === "internships"
      ? (d==="All" ? INTERNSHIPS.length : INTERNSHIPS.filter(i=>matchesDomain(i,d)).length)
      : (d==="All" ? jobs.length : jobs.filter(j=>matchesDomain(j,d)).length);
  });

  return (
    <AppShell>
      <div className="flex items-start justify-between flex-wrap gap-3">
        <PageHeader title="Jobs & Internships — India" subtitle="Fully in-app: browse details, quick-apply, and track — without leaving the page." />
        {tab === "jobs" && lastUpdated && (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Wifi className="size-3 text-emerald-400" /> {formatDistanceToNow(lastUpdated,{addSuffix:true})}
            </span>
            <Button variant="outline" size="sm" onClick={loadJobs} disabled={loading}>
              <RefreshCw className={cn("size-4",loading&&"animate-spin")} /> Refresh
            </Button>
          </div>
        )}
      </div>

      {/* Tab Switcher */}
      <div className="mt-5 flex gap-3">
        {([["internships","Internships",GraduationCap,INTERNSHIPS.length],["jobs","Live Jobs",Briefcase,jobs.length]] as const).map(([val,label,Icon,count])=>(
          <button key={val} onClick={() => { setTab(val as Tab); setDomain("All"); setQ(""); setExpandedId(null); setApplyingId(null); }}
            className={cn("flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm border transition-all",
              tab===val ? "bg-primary text-primary-foreground border-primary shadow-elegant" : "glass-card border-white/10 text-muted-foreground hover:text-foreground")}>
            <Icon className="size-4" /> {label}
            {count > 0 && <span className={cn("text-xs px-2 py-0.5 rounded-full",tab===val?"bg-white/20":"bg-white/10")}>{count}</span>}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(tab==="internships"?[
          ["Internships", INTERNSHIPS.length, GraduationCap],
          ["Indian Cities","10+",MapPin],
          ["Domains","7",Zap],
          ["Saved",saved.size,Bookmark],
        ]:[
          ["Live Jobs",jobs.length||"—",Briefcase],
          ["Remote/India",jobs.filter(j=>j.remote).length||"—",Globe2],
          ["Sources","2 APIs",Wifi],
          ["Saved",saved.size,Bookmark],
        ]).map(([label,value,Icon]:any) => (
          <div key={label} className="glass-card rounded-xl p-3 flex items-center gap-2">
            <Icon className="size-4 text-primary shrink-0" />
            <div><p className="text-lg font-bold gradient-text">{value}</p><p className="text-xs text-muted-foreground">{label}</p></div>
          </div>
        ))}
      </div>

      {/* Domain Tabs */}
      <div className="mt-4 flex gap-2 flex-wrap">
        {Object.keys(DOMAINS).map((d)=>(
          <button key={d} onClick={()=>setDomain(d)}
            className={cn("text-xs px-3 py-1.5 rounded-full border font-semibold transition-all",
              domain===d ? DOMAIN_COLOR[d] : "border-white/10 text-muted-foreground hover:border-white/20")}>
            {d} <span className="opacity-60">({domainCounts[d]??0})</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mt-3 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder="Search role, company, skill…" value={q} onChange={(e)=>setQ(e.target.value)} className="pl-10 bg-glass border-white/10 h-10 rounded-xl" />
        </div>
        {(q||domain!=="All") && <Button variant="outline" size="sm" onClick={()=>{setQ("");setDomain("All");}}><X className="size-3 mr-1"/>Clear</Button>}
      </div>

      {/* ── INTERNSHIPS ── */}
      {tab==="internships" && (
        <div className="mt-5 space-y-4">
          <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="size-3 text-orange-400"/>Showing {filteredInterns.length} Indian internship opportunities</p>
          {filteredInterns.map((intern) => {
            const isOpen = expandedId === intern.id;
            const isApplying = applyingId === intern.id;
            return (
              <div key={intern.id} className={cn("glass-card rounded-2xl border overflow-hidden transition-all",isOpen?"border-primary/30":"border-white/5")}>
                {/* Card Header */}
                <div className="p-5 flex items-start gap-4 cursor-pointer hover:bg-white/2 transition-colors" onClick={()=>{setExpandedId(isOpen?null:intern.id);setApplyingId(null);}}>
                  <div className="size-11 rounded-xl bg-gradient-to-br from-orange-500/20 to-rose-500/20 grid place-items-center font-bold text-orange-400 text-xl shrink-0">{intern.company.charAt(0)}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold">{intern.role}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1"><Building2 className="size-3"/>{intern.company} · <MapPin className="size-3"/>{intern.location}</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      <span className="text-emerald-400 font-semibold flex items-center gap-1"><IndianRupee className="size-3"/>{intern.stipend}</span>
                      <span className="text-muted-foreground flex items-center gap-1"><Clock className="size-3"/>{intern.duration}</span>
                      <span className="text-blue-400 flex items-center gap-1"><BadgeCheck className="size-3"/>{intern.openings} openings</span>
                      <span className="text-yellow-400 flex items-center gap-1"><Calendar className="size-3"/>Apply by {intern.lastDate}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={(e)=>{e.stopPropagation();toggleSave(intern.id);}} className={cn("transition-colors",saved.has(intern.id)?"text-primary":"text-muted-foreground hover:text-primary")}>
                      {saved.has(intern.id)?<BookmarkCheck className="size-5 fill-primary/20"/>:<Bookmark className="size-5"/>}
                    </button>
                    {isOpen?<ChevronUp className="size-5 text-muted-foreground"/>:<ChevronDown className="size-5 text-muted-foreground"/>}
                  </div>
                </div>

                {/* Expanded Content */}
                {isOpen && (
                  <div className="border-t border-white/5 p-5 space-y-5">
                    {/* About */}
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">About the Role</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{intern.about}</p>
                    </div>

                    {/* Who can apply */}
                    <div className="rounded-xl bg-blue-500/5 border border-blue-500/10 p-4">
                      <p className="text-xs font-bold text-blue-400 mb-1 flex items-center gap-1"><GraduationCap className="size-3"/>Who Can Apply</p>
                      <p className="text-sm text-muted-foreground">{intern.whoCanApply}</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      {/* Responsibilities */}
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Responsibilities</p>
                        <ul className="space-y-1.5">
                          {intern.responsibilities.map((r,i)=>(
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <span className="size-5 rounded-full bg-primary/10 text-primary text-xs font-bold grid place-items-center shrink-0 mt-0.5">{i+1}</span>{r}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {/* Skills + Perks */}
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Skills Required</p>
                          <div className="flex flex-wrap gap-2">
                            {intern.skills.map((s)=>(
                              <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">{s}</span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1"><TrendingUp className="size-3"/>Perks & Benefits</p>
                          <div className="flex flex-wrap gap-2">
                            {intern.perks.map((p)=>(
                              <span key={p} className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1"><BadgeCheck className="size-3"/>{p}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Apply Toggle */}
                    {!isApplying ? (
                      <div className="flex gap-3 pt-2 border-t border-white/5">
                        <Button variant="hero" className="flex-1" onClick={()=>setApplyingId(intern.id)}>
                          <Send className="size-4"/> Quick Apply In-App
                        </Button>
                        <Button variant="outline" asChild>
                          <a href={intern.applyUrl} target="_blank" rel="noopener noreferrer">Internshala <ExternalLink className="size-3 ml-1"/></a>
                        </Button>
                      </div>
                    ) : (
                      <QuickApplyForm role={intern.role} company={intern.company} applyUrl={intern.applyUrl} onDone={()=>setApplyingId(null)} />
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* More on Internshala */}
          <div className="glass-card rounded-2xl p-5 border border-orange-500/20 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="font-bold">Find 10,000+ more internships</p>
              <p className="text-sm text-muted-foreground">Explore all domains on Internshala</p>
            </div>
            <Button variant="hero" asChild>
              <a href="https://internshala.com/internships/computer-science-internship/" target="_blank" rel="noopener noreferrer">
                Open Internshala <ExternalLink className="size-4 ml-1"/>
              </a>
            </Button>
          </div>
        </div>
      )}

      {/* ── LIVE JOBS ── */}
      {tab==="jobs" && (
        <div className="mt-5 space-y-4">
          {loading ? (
            <div className="grid place-items-center py-24">
              <Loader2 className="size-8 animate-spin text-primary mx-auto mb-3"/>
              <p className="text-muted-foreground text-sm mt-2">Fetching live India-based jobs…</p>
            </div>
          ) : error ? (
            <div className="glass-card rounded-2xl p-8 text-center">
              <WifiOff className="size-8 text-rose-400 mx-auto mb-3"/>
              <p className="text-rose-400">{error}</p>
              <Button variant="hero" className="mt-4" onClick={loadJobs}>Retry</Button>
            </div>
          ) : (
            <>
              <p className="text-xs text-muted-foreground flex items-center gap-1"><Zap className="size-3 text-primary"/>{filteredJobs.length} live Remote / India jobs</p>
              {filteredJobs.map((job) => {
                const isOpen = expandedId === job.id;
                const isApplying = applyingId === job.id;
                return (
                  <div key={job.id} className={cn("glass-card rounded-2xl border overflow-hidden transition-all",isOpen?"border-primary/30":"border-white/5")}>
                    <div className="p-5 flex items-start gap-4 cursor-pointer hover:bg-white/2 transition-colors" onClick={()=>{setExpandedId(isOpen?null:job.id);setApplyingId(null);}}>
                      <div className="size-11 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 grid place-items-center font-bold text-primary text-xl shrink-0">{job.company.charAt(0).toUpperCase()}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold">{job.title}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1"><Building2 className="size-3"/>{job.company}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {job.remote && <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]"><Globe2 className="size-2.5 mr-1"/>Remote / India OK</Badge>}
                          {!job.remote && job.location && <Badge className="bg-white/5 text-muted-foreground text-[10px]"><MapPin className="size-2.5 mr-1"/>{job.location}</Badge>}
                          {job.jobTypes.slice(0,1).map(t=><Badge key={t} className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px] capitalize"><Briefcase className="size-2.5 mr-1"/>{t}</Badge>)}
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Calendar className="size-3"/>{formatDistanceToNow(job.postedAt,{addSuffix:true})}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={(e)=>{e.stopPropagation();toggleSave(job.id);}} className={cn("transition-colors",saved.has(job.id)?"text-primary":"text-muted-foreground hover:text-primary")}>
                          {saved.has(job.id)?<BookmarkCheck className="size-5 fill-primary/20"/>:<Bookmark className="size-5"/>}
                        </button>
                        {isOpen?<ChevronUp className="size-5 text-muted-foreground"/>:<ChevronDown className="size-5 text-muted-foreground"/>}
                      </div>
                    </div>

                    {isOpen && (
                      <div className="border-t border-white/5 p-5 space-y-5">
                        {/* Tags */}
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1"><Tag className="size-3"/>Skills & Tags</p>
                          <div className="flex flex-wrap gap-1.5">
                            {job.tags.map(t=><span key={t} className="text-xs px-2.5 py-1 rounded-full bg-primary/8 text-primary border border-primary/15 capitalize font-medium">{t}</span>)}
                          </div>
                        </div>
                        {/* Description */}
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Job Description</p>
                          <p className="text-sm text-muted-foreground leading-relaxed">{job.description.slice(0,1500)}{job.description.length>1500?"…":""}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">Source: {job.source}</p>

                        {!isApplying ? (
                          <div className="flex gap-3 pt-2 border-t border-white/5">
                            <Button variant="hero" className="flex-1" onClick={()=>setApplyingId(job.id)}>
                              <Send className="size-4"/> Quick Apply In-App
                            </Button>
                            <Button variant="outline" asChild>
                              <a href={job.applyUrl} target="_blank" rel="noopener noreferrer">Official Site <ExternalLink className="size-3 ml-1"/></a>
                            </Button>
                          </div>
                        ) : (
                          <QuickApplyForm role={job.title} company={job.company} applyUrl={job.applyUrl} onDone={()=>setApplyingId(null)} />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* More jobs */}
              <div className="grid sm:grid-cols-3 gap-3 mt-2">
                {[
                  {name:"Naukri.com",url:"https://www.naukri.com/jobs-in-india?src=freshers",color:"text-blue-400"},
                  {name:"LinkedIn Jobs India",url:"https://www.linkedin.com/jobs/search/?location=India&f_E=1%2C2",color:"text-sky-400"},
                  {name:"Instahyre",url:"https://www.instahyre.com/candidate-search/",color:"text-violet-400"},
                ].map(s=>(
                  <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"
                    className="glass-card rounded-xl p-3 flex items-center justify-between hover:border-primary/20 border border-white/5 transition-all">
                    <span className={cn("font-semibold text-sm",s.color)}>{s.name}</span>
                    <ExternalLink className="size-3.5 text-muted-foreground"/>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </AppShell>
  );
}
