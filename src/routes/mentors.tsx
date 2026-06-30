import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "./roadmaps.index";
import {
  Star, Calendar, MapPin, Briefcase, Clock,
  ChevronDown, ChevronUp, CheckCircle2, User, Mail, Phone,
  MessageSquare, Send, Linkedin, BadgeCheck, X, GraduationCap,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/mentors")({ component: Mentors });

/* ──────────── MENTOR DATA ──── */
type Mentor = {
  id: string;
  name: string;
  avatar: string;
  role: string;
  company: string;
  location: string;
  experience: string;
  expertise: string[];
  domains: string[];
  bio: string;
  education: string;
  rating: number;
  reviews: number;
  sessionsCompleted: number;
  price: string;
  availability: string[];
  linkedinUrl: string;
  languages: string[];
  achievements: string[];
};

const MENTORS: Mentor[] = [
  {
    id: "m1",
    name: "Arjun Menon",
    avatar: "A",
    role: "Senior Software Engineer",
    company: "Google India",
    location: "Hyderabad",
    experience: "6 years",
    expertise: ["System Design", "Data Structures", "Java", "Python"],
    domains: ["Backend", "System Design", "DSA"],
    bio: "SWE at Google India working on Search Infrastructure. IIT Bombay alumnus with 6 years of industry experience. I've mentored 200+ students crack FAANG interviews. Specialize in system design and DSA for placement prep.",
    education: "B.Tech CSE — IIT Bombay (2018)",
    rating: 4.9,
    reviews: 147,
    sessionsCompleted: 312,
    price: "₹599/session",
    availability: ["Weekends", "Weekday evenings"],
    linkedinUrl: "https://linkedin.com/in/",
    languages: ["English", "Hindi", "Malayalam"],
    achievements: ["Google L5 Engineer", "200+ students placed in FAANG", "IIT Bombay Gold Medalist"],
  },
  {
    id: "m2",
    name: "Priya Krishnaswamy",
    avatar: "P",
    role: "Data Scientist",
    company: "Flipkart",
    location: "Bangalore",
    experience: "4 years",
    expertise: ["Machine Learning", "Python", "SQL", "Statistics"],
    domains: ["Data Science", "AI/ML", "Analytics"],
    bio: "Data Scientist at Flipkart building recommendation systems for 300M+ users. NIT Trichy CSE grad. I help students transition from academic ML to industry-grade projects. Strong focus on practical skills and portfolio building.",
    education: "B.Tech CSE — NIT Trichy (2020)",
    rating: 4.8,
    reviews: 89,
    sessionsCompleted: 178,
    price: "₹499/session",
    availability: ["Saturday mornings", "Sunday all day"],
    linkedinUrl: "https://linkedin.com/in/",
    languages: ["English", "Tamil"],
    achievements: ["Kaggle Expert", "Published 2 ML Papers", "Flipkart Star Performer 2023"],
  },
  {
    id: "m3",
    name: "Rahul Agarwal",
    avatar: "R",
    role: "Full Stack Lead",
    company: "Razorpay",
    location: "Bangalore",
    experience: "5 years",
    expertise: ["React", "Node.js", "TypeScript", "System Architecture"],
    domains: ["Frontend", "Backend", "Full Stack"],
    bio: "Lead engineer at Razorpay's payments team. BITS Pilani alumnus. Built systems processing ₹10,000Cr+ daily. I help students build production-ready projects and crack frontend/full-stack roles at startups and MNCs.",
    education: "B.E. CSE — BITS Pilani (2019)",
    rating: 4.9,
    reviews: 203,
    sessionsCompleted: 445,
    price: "₹699/session",
    availability: ["Weekday evenings 8–10pm", "Sunday afternoons"],
    linkedinUrl: "https://linkedin.com/in/",
    languages: ["English", "Hindi"],
    achievements: ["BITS Pilani Campus Topper", "500+ GitHub stars", "Ex-Zomato SDE"],
  },
  {
    id: "m4",
    name: "Sneha Patil",
    avatar: "S",
    role: "Android Engineer",
    company: "PhonePe",
    location: "Bangalore",
    experience: "3 years",
    expertise: ["Android", "Kotlin", "Jetpack Compose", "Firebase"],
    domains: ["Mobile", "Android"],
    bio: "Android engineer at PhonePe building UPI features for 500M+ users. COEP grad. I specialize in helping students build their first Android app to publish on Play Store. Excellent track record for mobile placement prep.",
    education: "B.E. CSE — COEP Pune (2021)",
    rating: 4.7,
    reviews: 56,
    sessionsCompleted: 112,
    price: "₹399/session",
    availability: ["Weekends", "Friday evenings"],
    linkedinUrl: "https://linkedin.com/in/",
    languages: ["English", "Hindi", "Marathi"],
    achievements: ["2M+ app downloads", "GDE (Google Developer Expert) nominee", "WomenTechmakers Scholar"],
  },
  {
    id: "m5",
    name: "Karthik Subramaniam",
    avatar: "K",
    role: "DevOps Architect",
    company: "Thoughtworks",
    location: "Chennai",
    experience: "7 years",
    expertise: ["AWS", "Kubernetes", "Docker", "Terraform", "CI/CD"],
    domains: ["Cloud", "DevOps"],
    bio: "DevOps architect at Thoughtworks with 7 years automating cloud infra for Fortune 500 clients. Anna University grad. I help students get AWS certifications and land DevOps roles — one of the highest-paying entry-level tracks.",
    education: "B.E. IT — Anna University (2017)",
    rating: 4.8,
    reviews: 74,
    sessionsCompleted: 198,
    price: "₹599/session",
    availability: ["Weekday mornings", "Saturday all day"],
    linkedinUrl: "https://linkedin.com/in/",
    languages: ["English", "Tamil"],
    achievements: ["AWS Certified Solutions Architect Pro", "CKA (Kubernetes Admin)", "Thoughtworks Principal Engineer Track"],
  },
  {
    id: "m6",
    name: "Divya Mehta",
    avatar: "D",
    role: "Product Designer",
    company: "Swiggy",
    location: "Bangalore",
    experience: "4 years",
    expertise: ["Figma", "UX Research", "Design Systems", "Prototyping"],
    domains: ["Design", "UI/UX"],
    bio: "Senior Product Designer at Swiggy redesigning the food ordering experience. NID Ahmedabad graduate. I help engineering students and freshers break into design by building strong portfolios and mastering Figma.",
    education: "B.Des UX — NID Ahmedabad (2020)",
    rating: 4.9,
    reviews: 91,
    sessionsCompleted: 167,
    price: "₹449/session",
    availability: ["Weekdays 7–9pm", "Saturday mornings"],
    linkedinUrl: "https://linkedin.com/in/",
    languages: ["English", "Hindi", "Gujarati"],
    achievements: ["Behance Top Creator India", "Dribbble Featured Designer", "Ex-Zomato Design Lead"],
  },
  {
    id: "m7",
    name: "Vikram Nair",
    avatar: "V",
    role: "Competitive Programmer",
    company: "Amazon India",
    location: "Hyderabad (Remote)",
    experience: "4 years",
    expertise: ["Competitive Programming", "C++", "Data Structures", "Algorithms"],
    domains: ["DSA", "Competitive Programming"],
    bio: "SDE-2 at Amazon India. Codeforces Grandmaster (rating 2800+), solved 3000+ problems. I help students with intensive DSA bootcamps and mock interviews. 95% of my mentees cleared Amazon/Microsoft/Flipkart first rounds.",
    education: "B.Tech CSE — IIT Delhi (2020)",
    rating: 5.0,
    reviews: 132,
    sessionsCompleted: 267,
    price: "₹799/session",
    availability: ["Weekdays 9–11pm", "Sunday mornings"],
    linkedinUrl: "https://linkedin.com/in/",
    languages: ["English", "Hindi", "Malayalam"],
    achievements: ["Codeforces Grandmaster 2800+", "IOI Silver Medal", "Amazon SDE-2 at 24"],
  },
  {
    id: "m8",
    name: "Ananya Sharma",
    avatar: "A",
    role: "SDE Intern → FTE",
    company: "Microsoft IDC",
    location: "Hyderabad",
    experience: "1 year",
    expertise: ["Resume Building", "HR Interview Prep", "Off-Campus Strategy", "LinkedIn Optimization"],
    domains: ["Placement Prep", "HR", "Career"],
    bio: "Recently converted from SDE Intern to FTE at Microsoft IDC. I know exactly what it takes to crack top MNCs fresh out of college — especially off-campus. Helping freshers with resume, HR rounds, and LinkedIn strategy.",
    education: "B.Tech CSE — VIT Vellore (2024)",
    rating: 4.8,
    reviews: 48,
    sessionsCompleted: 89,
    price: "₹299/session",
    availability: ["Weekends all day", "Weekday evenings"],
    linkedinUrl: "https://linkedin.com/in/",
    languages: ["English", "Hindi"],
    achievements: ["Microsoft IDC FTE offer", "Cracked 15+ MNC OAs", "LinkedIn Top Voice — Career"],
  },
  {
    id: "m9",
    name: "Rohit Bansal",
    avatar: "R",
    role: "Startup Founder / Ex-CTO",
    company: "YC-backed Startup",
    location: "Bangalore",
    experience: "8 years",
    expertise: ["Entrepreneurship", "Tech Leadership", "Product Building", "Fundraising"],
    domains: ["Startup", "Product", "Leadership"],
    bio: "Founded 2 startups — first acquired by Zomato, second raised $2M seed from Y Combinator. Ex-CTO at a logistics startup. I help students who want to build their own startups or join early-stage companies.",
    education: "B.Tech CSE — IIT Kharagpur (2016)",
    rating: 4.7,
    reviews: 38,
    sessionsCompleted: 76,
    price: "₹999/session",
    availability: ["Saturday mornings only"],
    linkedinUrl: "https://linkedin.com/in/",
    languages: ["English", "Hindi"],
    achievements: ["YC W23 Batch", "2 successful exits", "Forbes 30 Under 30 India 2023"],
  },
];

const DOMAIN_FILTERS = ["All", "Backend", "Frontend", "Full Stack", "Data Science", "Mobile", "Cloud", "DevOps", "Design", "DSA", "Placement Prep", "Startup"];

type BookingForm = { name: string; email: string; phone: string; topic: string; preferredDate: string; message: string };

function BookingModal({ mentor, onClose }: { mentor: Mentor; onClose: () => void }) {
  const { user } = useAuth();
  const [form, setForm] = useState<BookingForm>({ name: user?.fullName ?? "", email: user?.email ?? "", phone: "", topic: mentor.domains[0], preferredDate: "", message: "" });
  const [done, setDone] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.phone || !form.preferredDate) return toast.error("Fill phone and preferred date");
    const bookings = JSON.parse(localStorage.getItem("mentorBookings") ?? "[]");
    bookings.push({ mentor: mentor.name, company: mentor.company, bookedAt: new Date().toISOString(), status: "Requested", ...form });
    localStorage.setItem("mentorBookings", JSON.stringify(bookings));
    setDone(true);
    toast.success(`Session requested with ${mentor.name}!`);
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur flex items-center justify-center p-4">
      <div className="glass-card rounded-2xl border border-primary/30 w-full max-w-lg overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <div>
            <h3 className="font-bold">Book Session with {mentor.name}</h3>
            <p className="text-xs text-muted-foreground">{mentor.role} at {mentor.company} · {mentor.price}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="size-5" /></button>
        </div>

        {done ? (
          <div className="p-8 text-center">
            <CheckCircle2 className="size-12 text-emerald-400 mx-auto mb-3" />
            <h3 className="font-bold text-lg">Session Requested! 🎉</h3>
            <p className="text-sm text-muted-foreground mt-2 mb-5">Your request has been recorded. Connect with the mentor on LinkedIn to confirm the session details.</p>
            <div className="flex gap-3 justify-center">
              <Button variant="hero" asChild>
                <a href={mentor.linkedinUrl} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="size-4" /> Connect on LinkedIn
                </a>
              </Button>
              <Button variant="outline" onClick={onClose}>Close</Button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="p-5 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><User className="size-3" /> Name *</label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" className="h-9 text-sm" required />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Mail className="size-3" /> Email *</label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="h-9 text-sm" required />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Phone className="size-3" /> Phone *</label>
                <Input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" className="h-9 text-sm" required />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Calendar className="size-3" /> Preferred Date *</label>
                <Input type="date" value={form.preferredDate} onChange={(e) => setForm({ ...form, preferredDate: e.target.value })} className="h-9 text-sm" required />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Topic / What do you want to discuss?</label>
              <Input value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} placeholder="e.g. DSA preparation, resume review, system design…" className="h-9 text-sm" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Message to Mentor (optional)</label>
              <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={3}
                placeholder="Share your background and what you're hoping to achieve…"
                className="w-full bg-background/50 border border-white/10 rounded-xl p-3 text-sm resize-none focus:outline-none focus:border-primary/50 transition-colors" />
            </div>
            <Button type="submit" variant="hero" className="w-full">
              <Send className="size-4" /> Send Session Request
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

function MentorCard({ mentor }: { mentor: Mentor }) {
  const [expanded, setExpanded] = useState(false);
  const [booking, setBooking] = useState(false);

  return (
    <>
      <div className={cn("glass-card rounded-2xl border overflow-hidden transition-all", expanded ? "border-primary/30" : "border-white/5")}>
        {/* Header */}
        <div className="p-5">
          <div className="flex items-start gap-4">
            <div className="size-14 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 grid place-items-center font-bold text-2xl text-primary shrink-0 shadow-md">
              {mentor.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base">{mentor.name}</h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Briefcase className="size-3" /> {mentor.role} at <span className="text-foreground font-medium">{mentor.company}</span>
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <MapPin className="size-3" /> {mentor.location} · {mentor.experience} exp.
              </p>
              {/* Rating */}
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={cn("size-3.5", i < Math.floor(mentor.rating) ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground")} />
                  ))}
                </div>
                <span className="text-xs font-bold">{mentor.rating}</span>
                <span className="text-xs text-muted-foreground">({mentor.reviews} reviews)</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="font-bold text-primary">{mentor.price}</p>
              <p className="text-xs text-muted-foreground">{mentor.sessionsCompleted} sessions</p>
            </div>
          </div>

          {/* Expertise Tags */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {mentor.expertise.slice(0, 4).map((e) => (
              <span key={e} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/15 font-medium">{e}</span>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-4 flex gap-2">
            <Button variant="hero" className="flex-1" onClick={() => setBooking(true)}>
              <Calendar className="size-4" /> Book Session
            </Button>
            <Button variant="outline" size="sm" onClick={() => setExpanded(!expanded)} className="gap-1">
              {expanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
              {expanded ? "Less" : "More"}
            </Button>
          </div>
        </div>

        {/* Expanded Details */}
        {expanded && (
          <div className="border-t border-white/5 p-5 space-y-4">
            {/* Bio */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">About</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{mentor.bio}</p>
            </div>
            {/* Education */}
            <div className="flex items-start gap-2 text-sm">
              <GraduationCap className="size-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Education</p>
                <p className="font-medium">{mentor.education}</p>
              </div>
            </div>
            {/* Achievements */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1"><BadgeCheck className="size-3" /> Achievements</p>
              <ul className="space-y-1">
                {mentor.achievements.map((a) => (
                  <li key={a} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" /> {a}
                  </li>
                ))}
              </ul>
            </div>
            {/* Availability + Languages */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5 flex items-center gap-1"><Clock className="size-3" />Availability</p>
                {mentor.availability.map((a) => (
                  <p key={a} className="text-xs text-muted-foreground">{a}</p>
                ))}
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Languages</p>
                <div className="flex flex-wrap gap-1">
                  {mentor.languages.map((l) => (
                    <span key={l} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-muted-foreground border border-white/10">{l}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {booking && <BookingModal mentor={mentor} onClose={() => setBooking(false)} />}
    </>
  );
}

function Mentors() {
  const [domainFilter, setDomainFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = MENTORS.filter((m) => {
    const matchDomain = domainFilter === "All" || m.domains.some((d) => d.toLowerCase().includes(domainFilter.toLowerCase()));
    const matchSearch = !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.expertise.some((e) => e.toLowerCase().includes(search.toLowerCase())) || m.company.toLowerCase().includes(search.toLowerCase());
    return matchDomain && matchSearch;
  });

  return (
    <AppShell>
      <PageHeader
        title="Mentorship Platform"
        subtitle="Book 1:1 sessions with industry professionals from Google, Amazon, Razorpay, and more."
      />

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Mentors", value: MENTORS.length },
          { label: "Sessions Done", value: MENTORS.reduce((s, m) => s + m.sessionsCompleted, 0).toLocaleString() },
          { label: "Avg Rating", value: (MENTORS.reduce((s, m) => s + m.rating, 0) / MENTORS.length).toFixed(1) + " ★" },
          { label: "Starting at", value: "₹299" },
        ].map((s) => (
          <div key={s.label} className="glass-card rounded-xl p-3 text-center">
            <p className="text-xl font-bold gradient-text">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Domain Filters */}
      <div className="mt-5 flex gap-2 flex-wrap">
        {DOMAIN_FILTERS.map((d) => (
          <button key={d} onClick={() => setDomainFilter(d)}
            className={cn("text-xs px-3 py-1.5 rounded-full border font-semibold transition-all",
              domainFilter === d ? "bg-primary text-primary-foreground border-primary" : "border-white/10 text-muted-foreground hover:border-white/20")}>
            {d}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mt-3 relative">
        <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input placeholder="Search by name, skill, or company…" value={search} onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-glass border-white/10 h-10 rounded-xl" />
      </div>

      {/* Mentor Cards */}
      <div className="mt-6 grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((m) => <MentorCard key={m.id} mentor={m} />)}
      </div>

      {filtered.length === 0 && (
        <div className="mt-10 text-center glass-card rounded-2xl p-10">
          <p className="text-muted-foreground">No mentors match your filter. Try "All".</p>
        </div>
      )}
    </AppShell>
  );
}


