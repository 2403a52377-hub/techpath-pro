import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "./roadmaps.index";
import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Download,
  Save,
  Sparkles,
  CheckCircle2,
  Printer,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { pdf, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/resume")({ component: ResumeBuilder });

/* ─── Types ─── */
type ExperienceEntry = {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
};

type ProjectEntry = {
  id: string;
  name: string;
  tech: string;
  description: string;
};

type EducationEntry = {
  id: string;
  degree: string;
  institution: string;
  year: string;
};

type ExtraSection = {
  id: string;
  title: string;
  content: string;
};

type ResumeData = {
  headline: string;
  summary: string;
  skills: string;
  experiences: ExperienceEntry[];
  projects: ProjectEntry[];
  educations: EducationEntry[];
  websiteUrl: string;
  extras: ExtraSection[];
};

/* ─── Defaults ─── */
function uid() {
  return Math.random().toString(36).slice(2, 9);
}

const DEFAULT: ResumeData = {
  headline: "",
  summary:
    "Final-year engineering student passionate about building impactful products. Strong fundamentals in DSA, web development, and cloud.",
  skills: "React, TypeScript, Node.js, PostgreSQL, AWS, Docker",
  experiences: [
    {
      id: uid(),
      role: "Software Engineering Intern",
      company: "Razorpay",
      period: "May 2025 – Jul 2025",
      description:
        "Built payment dashboards using React and TypeScript. Shipped 4 features used by 10K+ merchants. Reduced API response time by 35%.",
    },
  ],
  projects: [
    {
      id: uid(),
      name: "TechLand Platform",
      tech: "React, Tailwind, Supabase",
      description:
        "Career platform for engineering students. Reduced page load by 40%. Onboarded 500+ users in first month.",
    },
  ],
  educations: [
    {
      id: uid(),
      degree: "B.Tech, Computer Science",
      institution: "Your College Name",
      year: "Expected 2026",
    },
  ],
  websiteUrl: "",
  extras: [],
};

/* ─── Keyword Highlighting ─── */
const ACTION_VERBS = [
  "built","shipped","designed","led","architected","owned","launched","developed",
  "created","managed","reduced","improved","increased","delivered","implemented",
  "optimized","deployed","integrated","automated","streamlined","collaborated",
  "mentored","produced","boosted","scaled","migrated",
];
const TECH_KEYWORDS = [
  "react","typescript","javascript","node.js","python","java","aws","docker",
  "kubernetes","postgresql","mongodb","redis","graphql","rest","api","sql",
  "git","github","ci/cd","supabase","nextjs","tailwind","vue","angular","flutter",
];

function HighlightedText({ text, className }: { text: string; className?: string }) {
  if (!text) return null;

  // Split by word boundaries, highlight matches
  const metricRegex = /(\d+[\d.,]*[%KkMm+x]*\+?|\d+\s*(K\+?|M\+?|%|\+))/g;
  const actionRegex = new RegExp(`\\b(${ACTION_VERBS.join("|")})\\b`, "gi");
  const techRegex = new RegExp(`\\b(${TECH_KEYWORDS.join("|")})\\b`, "gi");

  // We'll tokenize the text into parts
  const tokens: { text: string; type: "normal" | "metric" | "action" | "tech" }[] = [];
  let lastIndex = 0;
  const combined = new RegExp(
    `(${metricRegex.source})|(${actionRegex.source})|(${techRegex.source})`,
    "gi",
  );
  let match: RegExpExecArray | null;
  while ((match = combined.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ text: text.slice(lastIndex, match.index), type: "normal" });
    }
    const word = match[0];
    if (/\d/.test(word)) tokens.push({ text: word, type: "metric" });
    else if (ACTION_VERBS.some((v) => v.toLowerCase() === word.toLowerCase()))
      tokens.push({ text: word, type: "action" });
    else tokens.push({ text: word, type: "tech" });
    lastIndex = match.index + word.length;
  }
  if (lastIndex < text.length) tokens.push({ text: text.slice(lastIndex), type: "normal" });

  return (
    <span className={className}>
      {tokens.map((t, i) => {
        if (t.type === "metric")
          return (
            <span key={i} className="font-bold text-emerald-600 dark:text-emerald-400">
              {t.text}
            </span>
          );
        if (t.type === "action")
          return (
            <span key={i} className="font-semibold text-primary">
              {t.text}
            </span>
          );
        if (t.type === "tech")
          return (
            <span key={i} className="font-medium text-blue-600 dark:text-blue-400">
              {t.text}
            </span>
          );
        return <span key={i}>{t.text}</span>;
      })}
    </span>
  );
}

/* ─── Score ─── */
function computeScore(d: ResumeData) {
  let s = 0;
  if (d.headline.length > 8) s += 10;
  if (d.summary.length > 60) s += 15;
  if (d.skills.split(",").length >= 5) s += 15;
  if (d.educations.length > 0 && d.educations[0].degree.length > 4) s += 10;
  if (d.projects.length > 0 && d.projects[0].description.length > 30) s += 20;
  if (d.experiences.length > 0 && d.experiences[0].description.length > 30) s += 20;
  if (d.websiteUrl.length > 5) s += 5;
  if (d.extras.length > 0) s += 5;
  return Math.min(100, s);
}

/* ─── Dynamic List Helpers ─── */
function addExp(): ExperienceEntry {
  return { id: uid(), role: "", company: "", period: "", description: "" };
}
function addProj(): ProjectEntry {
  return { id: uid(), name: "", tech: "", description: "" };
}
function addEdu(): EducationEntry {
  return { id: uid(), degree: "", institution: "", year: "" };
}
function addExtra(): ExtraSection {
  return { id: uid(), title: "Achievements / Certifications", content: "" };
}

/* ─── Main Component ─── */
function ResumeBuilder() {
  const { user } = useAuth();
  const [data, setData] = useState<ResumeData>({
    ...DEFAULT,
    headline: `${user?.domain ?? ""} Aspirant`,
  });
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: row } = await supabase
        .from("resumes")
        .select("id, resume_data")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (row) {
        setResumeId(row.id);
        const saved = (row.resume_data as Partial<ResumeData>) || {};
        setData({
          ...DEFAULT,
          ...saved,
          // backward-compat: old string fields
          experiences:
            saved.experiences ??
            (saved as any).experience
              ? [{ ...addExp(), description: (saved as any).experience ?? "" }]
              : DEFAULT.experiences,
          projects:
            saved.projects ??
            (saved as any).project
              ? [{ ...addProj(), description: (saved as any).project ?? "" }]
              : DEFAULT.projects,
          educations:
            saved.educations ??
            (saved as any).education
              ? [{ ...addEdu(), degree: (saved as any).education ?? "" }]
              : DEFAULT.educations,
          extras: saved.extras ?? [],
        });
      }
    })();
  }, [user?.id]);

  const score = computeScore(data);

  async function save() {
    if (!user) return;
    setBusy(true);
    const payload = { user_id: user.id, resume_data: data as never, resume_score: score };
    const { data: saved, error } = resumeId
      ? await supabase.from("resumes").update(payload).eq("id", resumeId).select().maybeSingle()
      : await supabase.from("resumes").insert(payload).select().maybeSingle();
    setBusy(false);
    if (error) return toast.error(error.message);
    if (saved?.id) setResumeId(saved.id);
    toast.success("Resume saved ✓");
  }

  async function exportPdf() {
    if (!user) return;
    const blob = await pdf(
      <ResumePdf
        user={{ name: user.fullName, email: user.email, college: user.college, branch: user.branch }}
        data={data}
      />,
    ).toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${user.fullName.replace(/\s+/g, "_")}_Resume.pdf`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("PDF downloaded");
  }

  /* ── Updaters ── */
  function updExp(id: string, field: keyof ExperienceEntry, val: string) {
    setData((d) => ({
      ...d,
      experiences: d.experiences.map((e) => (e.id === id ? { ...e, [field]: val } : e)),
    }));
  }
  function updProj(id: string, field: keyof ProjectEntry, val: string) {
    setData((d) => ({
      ...d,
      projects: d.projects.map((p) => (p.id === id ? { ...p, [field]: val } : p)),
    }));
  }
  function updEdu(id: string, field: keyof EducationEntry, val: string) {
    setData((d) => ({
      ...d,
      educations: d.educations.map((e) => (e.id === id ? { ...e, [field]: val } : e)),
    }));
  }
  function updExtra(id: string, field: keyof ExtraSection, val: string) {
    setData((d) => ({
      ...d,
      extras: d.extras.map((x) => (x.id === id ? { ...x, [field]: val } : x)),
    }));
  }

  return (
    <AppShell>
      <PageHeader
        title="Resume Builder"
        subtitle="ATS-friendly templates, real-time scoring, AI suggestions, and one-click PDF export."
      />

      <div className="grid lg:grid-cols-3 gap-6 mt-8">
        {/* ── Editor ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Basic Info */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <h2 className="font-bold text-lg">Basic Info</h2>
            <Field label="Headline / Role">
              <Input value={data.headline} onChange={(e) => setData({ ...data, headline: e.target.value })} placeholder="e.g. Full Stack Developer Aspirant" />
            </Field>
            <Field label="Professional Profile">
              <Textarea rows={3} value={data.summary} onChange={(e) => setData({ ...data, summary: e.target.value })} />
            </Field>
            <Field label="Skills (comma-separated)">
              <Input value={data.skills} onChange={(e) => setData({ ...data, skills: e.target.value })} placeholder="React, TypeScript, Node.js…" />
            </Field>
            <Field label="Portfolio / Resume Website URL">
              <Input type="url" placeholder="https://yourportfolio.com" value={data.websiteUrl} onChange={(e) => setData({ ...data, websiteUrl: e.target.value })} />
            </Field>
          </div>

          {/* Experience */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg">Experience</h2>
              <Button variant="outline" size="sm" onClick={() => setData((d) => ({ ...d, experiences: [...d.experiences, addExp()] }))}>
                <Plus className="size-3.5 mr-1" /> Add Row
              </Button>
            </div>
            {data.experiences.map((exp, idx) => (
              <div key={exp.id} className="rounded-xl border border-white/10 bg-background/30 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-primary uppercase tracking-widest">Entry {idx + 1}</span>
                  {data.experiences.length > 1 && (
                    <button onClick={() => setData((d) => ({ ...d, experiences: d.experiences.filter((e) => e.id !== exp.id) }))} className="text-rose-400 hover:text-rose-300 transition-colors">
                      <Trash2 className="size-4" />
                    </button>
                  )}
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Field label="Role / Position">
                    <Input placeholder="Software Engineering Intern" value={exp.role} onChange={(e) => updExp(exp.id, "role", e.target.value)} />
                  </Field>
                  <Field label="Company Name">
                    <Input placeholder="Google, Amazon…" value={exp.company} onChange={(e) => updExp(exp.id, "company", e.target.value)} />
                  </Field>
                </div>
                <Field label="Period">
                  <Input placeholder="Jun 2025 – Aug 2025" value={exp.period} onChange={(e) => updExp(exp.id, "period", e.target.value)} />
                </Field>
                <Field label="Description (use action verbs + numbers for auto-highlight)">
                  <Textarea rows={3} placeholder="Built X using Y. Reduced load time by 40%. Shipped Z features used by 10K+ users." value={exp.description} onChange={(e) => updExp(exp.id, "description", e.target.value)} />
                </Field>
              </div>
            ))}
          </div>

          {/* Projects */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg">Projects</h2>
              <Button variant="outline" size="sm" onClick={() => setData((d) => ({ ...d, projects: [...d.projects, addProj()] }))}>
                <Plus className="size-3.5 mr-1" /> Add Row
              </Button>
            </div>
            {data.projects.map((proj, idx) => (
              <div key={proj.id} className="rounded-xl border border-white/10 bg-background/30 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-primary uppercase tracking-widest">Project {idx + 1}</span>
                  {data.projects.length > 1 && (
                    <button onClick={() => setData((d) => ({ ...d, projects: d.projects.filter((p) => p.id !== proj.id) }))} className="text-rose-400 hover:text-rose-300 transition-colors">
                      <Trash2 className="size-4" />
                    </button>
                  )}
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Field label="Project Name">
                    <Input placeholder="TechLand Platform" value={proj.name} onChange={(e) => updProj(proj.id, "name", e.target.value)} />
                  </Field>
                  <Field label="Tech Stack">
                    <Input placeholder="React, Node.js, Supabase" value={proj.tech} onChange={(e) => updProj(proj.id, "tech", e.target.value)} />
                  </Field>
                </div>
                <Field label="Description">
                  <Textarea rows={3} placeholder="Built X. Reduced page load by 40%. Onboarded 500+ users." value={proj.description} onChange={(e) => updProj(proj.id, "description", e.target.value)} />
                </Field>
              </div>
            ))}
          </div>

          {/* Education */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg">Education</h2>
              <Button variant="outline" size="sm" onClick={() => setData((d) => ({ ...d, educations: [...d.educations, addEdu()] }))}>
                <Plus className="size-3.5 mr-1" /> Add Row
              </Button>
            </div>
            {data.educations.map((edu, idx) => (
              <div key={edu.id} className="rounded-xl border border-white/10 bg-background/30 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-primary uppercase tracking-widest">Education {idx + 1}</span>
                  {data.educations.length > 1 && (
                    <button onClick={() => setData((d) => ({ ...d, educations: d.educations.filter((e) => e.id !== edu.id) }))} className="text-rose-400 hover:text-rose-300 transition-colors">
                      <Trash2 className="size-4" />
                    </button>
                  )}
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Field label="Degree / Course">
                    <Input placeholder="B.Tech, Computer Science" value={edu.degree} onChange={(e) => updEdu(edu.id, "degree", e.target.value)} />
                  </Field>
                  <Field label="Institution">
                    <Input placeholder="College / University" value={edu.institution} onChange={(e) => updEdu(edu.id, "institution", e.target.value)} />
                  </Field>
                </div>
                <Field label="Year / Expected">
                  <Input placeholder="Expected 2026 / 2022–2026" value={edu.year} onChange={(e) => updEdu(edu.id, "year", e.target.value)} />
                </Field>
              </div>
            ))}
          </div>

          {/* Extra Sections */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg">Extra Sections</h2>
              <Button variant="outline" size="sm" onClick={() => setData((d) => ({ ...d, extras: [...d.extras, addExtra()] }))}>
                <Plus className="size-3.5 mr-1" /> Add Section
              </Button>
            </div>
            {data.extras.length === 0 && (
              <p className="text-sm text-muted-foreground">Add custom sections like Certifications, Awards, Hobbies, Languages, Volunteering…</p>
            )}
            {data.extras.map((ex, idx) => (
              <div key={ex.id} className="rounded-xl border border-white/10 bg-background/30 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-primary uppercase tracking-widest">Section {idx + 1}</span>
                  <button onClick={() => setData((d) => ({ ...d, extras: d.extras.filter((x) => x.id !== ex.id) }))} className="text-rose-400 hover:text-rose-300 transition-colors">
                    <Trash2 className="size-4" />
                  </button>
                </div>
                <Field label="Section Title">
                  <Input placeholder="Certifications / Awards / Languages…" value={ex.title} onChange={(e) => updExtra(ex.id, "title", e.target.value)} />
                </Field>
                <Field label="Content">
                  <Textarea rows={3} value={ex.content} onChange={(e) => updExtra(ex.id, "content", e.target.value)} />
                </Field>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button variant="hero" onClick={save} disabled={busy}>
              {busy ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />} Save
            </Button>
            <Button variant="gradient" onClick={exportPdf}>
              <Download className="size-4" /> Export PDF
            </Button>
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="size-4" /> Print
            </Button>
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-5">
          <div className="glass-card rounded-2xl p-6 text-center">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Resume score</p>
            <p className="text-5xl font-bold gradient-text mt-2">{score}</p>
            <p className="text-xs text-muted-foreground mt-1">ATS-ready</p>
            <div className="mt-4 h-2 rounded-full bg-muted overflow-hidden">
              <div className={cn("h-full transition-all", score >= 80 ? "bg-emerald-500" : score >= 50 ? "bg-yellow-500" : "bg-rose-500")} style={{ width: `${score}%` }} />
            </div>
          </div>
          <div className="glass-card rounded-2xl p-6">
            <p className="font-bold flex items-center gap-2">
              <Sparkles className="size-4 text-accent" /> AI suggestions
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              {[
                "Add quantifiable impact (e.g. 'reduced load time by 40%')",
                "Include 2+ leadership / extracurricular bullets",
                "Use action verbs: built, shipped, architected, owned",
                "Add a link to a deployed live demo",
                "Add certifications or awards in Extra Sections",
              ].map((s) => (
                <li key={s} className="flex gap-2">
                  <CheckCircle2 className="size-4 text-success shrink-0 mt-0.5" /> <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* Highlight legend */}
          <div className="glass-card rounded-2xl p-5">
            <p className="font-bold text-sm mb-3">🎨 Preview Highlights</p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2"><span className="font-bold text-primary">Built</span><span className="text-muted-foreground">= Action verb (purple)</span></div>
              <div className="flex items-center gap-2"><span className="font-bold text-emerald-500">40%</span><span className="text-muted-foreground">= Metric / number (green)</span></div>
              <div className="flex items-center gap-2"><span className="font-medium text-blue-500">React</span><span className="text-muted-foreground">= Tech keyword (blue)</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Live Preview ── */}
      <div className="mt-8 glass-card rounded-2xl p-10 max-w-3xl mx-auto bg-card">
        <h2 className="text-3xl font-bold">{user?.fullName}</h2>
        <p className="text-accent font-semibold">{data.headline}</p>
        <p className="text-sm text-muted-foreground">
          {user?.email} • {user?.college} • {user?.branch}
        </p>
        {data.websiteUrl && (
          <p className="text-sm mt-1">
            🌐{" "}
            <a href={data.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors">
              {data.websiteUrl}
            </a>
          </p>
        )}

        <PreviewSection title="Professional Profile">
          <p className="mt-2 text-sm">{data.summary}</p>
        </PreviewSection>

        <PreviewSection title="Skills">
          <div className="mt-2 flex flex-wrap gap-1.5">
            {data.skills.split(",").map((s) => s.trim()).filter(Boolean).map((skill) => (
              <span key={skill} className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium border border-primary/20">{skill}</span>
            ))}
          </div>
        </PreviewSection>

        {data.experiences.some((e) => e.role || e.description) && (
          <PreviewSection title="Experience">
            {data.experiences.map((exp) => (
              <div key={exp.id} className="mt-3">
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <p className="font-bold text-sm">{exp.role}{exp.company ? ` @ ${exp.company}` : ""}</p>
                  {exp.period && <span className="text-xs text-muted-foreground">{exp.period}</span>}
                </div>
                {exp.description && (
                  <p className="mt-1 text-sm">
                    <HighlightedText text={exp.description} />
                  </p>
                )}
              </div>
            ))}
          </PreviewSection>
        )}

        {data.projects.some((p) => p.name || p.description) && (
          <PreviewSection title="Projects">
            {data.projects.map((proj) => (
              <div key={proj.id} className="mt-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold text-sm">{proj.name}</p>
                  {proj.tech && <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">{proj.tech}</span>}
                </div>
                {proj.description && (
                  <p className="mt-1 text-sm">
                    <HighlightedText text={proj.description} />
                  </p>
                )}
              </div>
            ))}
          </PreviewSection>
        )}

        {data.educations.some((e) => e.degree) && (
          <PreviewSection title="Education">
            {data.educations.map((edu) => (
              <div key={edu.id} className="mt-2 flex items-center justify-between flex-wrap gap-1">
                <p className="text-sm font-medium">{edu.degree}{edu.institution ? `, ${edu.institution}` : ""}</p>
                {edu.year && <span className="text-xs text-muted-foreground">{edu.year}</span>}
              </div>
            ))}
          </PreviewSection>
        )}

        {data.extras.map((ex) => (
          ex.title && (
            <PreviewSection key={ex.id} title={ex.title}>
              <p className="mt-2 text-sm whitespace-pre-line">{ex.content}</p>
            </PreviewSection>
          )
        ))}

        {data.websiteUrl && (
          <div className="mt-6 pt-4 border-t border-border text-center">
            <p className="text-xs text-muted-foreground">
              Portfolio & Resume:{" "}
              <a href={data.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-primary font-semibold underline underline-offset-2">
                {data.websiteUrl}
              </a>
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}

/* ─── Helper UI ─── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</Label>
      {children}
    </div>
  );
}

function PreviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <h3 className="text-sm font-bold uppercase tracking-widest text-primary border-b border-border pb-1">{title}</h3>
      {children}
    </div>
  );
}

/* ─── PDF Export ─── */
const pdfStyles = StyleSheet.create({
  page: { padding: 40, fontSize: 10.5, fontFamily: "Helvetica", color: "#1e293b" },
  name: { fontSize: 22, fontWeight: 700 },
  headline: { fontSize: 12, color: "#0ea5e9", marginTop: 2 },
  contact: { fontSize: 9, color: "#64748b", marginTop: 2, marginBottom: 12 },
  hr: { borderBottom: 1, borderColor: "#e2e8f0", marginVertical: 8 },
  h: { fontSize: 11, fontWeight: 700, color: "#1d4ed8", letterSpacing: 1.2, marginTop: 10, marginBottom: 4 },
  body: { fontSize: 10, lineHeight: 1.45 },
  entryTitle: { fontSize: 10.5, fontWeight: 700, marginTop: 6 },
  entryMeta: { fontSize: 9, color: "#64748b" },
  skillBadge: { fontSize: 9, color: "#1d4ed8" },
});

function ResumePdf({
  user,
  data,
}: {
  user: { name: string; email: string; college: string; branch: string };
  data: ResumeData;
}) {
  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <Text style={pdfStyles.name}>{user.name}</Text>
        <Text style={pdfStyles.headline}>{data.headline}</Text>
        <Text style={pdfStyles.contact}>
          {user.email} • {user.college} • {user.branch}
          {data.websiteUrl ? ` • ${data.websiteUrl}` : ""}
        </Text>
        <View style={pdfStyles.hr} />

        <Text style={pdfStyles.h}>PROFESSIONAL PROFILE</Text>
        <Text style={pdfStyles.body}>{data.summary}</Text>

        <Text style={pdfStyles.h}>SKILLS</Text>
        <Text style={pdfStyles.body}>{data.skills}</Text>

        {data.experiences.some((e) => e.role || e.description) && (
          <>
            <Text style={pdfStyles.h}>EXPERIENCE</Text>
            {data.experiences.map((exp) => (
              <View key={exp.id} style={{ marginBottom: 6 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={pdfStyles.entryTitle}>
                    {exp.role}{exp.company ? ` @ ${exp.company}` : ""}
                  </Text>
                  <Text style={pdfStyles.entryMeta}>{exp.period}</Text>
                </View>
                <Text style={pdfStyles.body}>{exp.description}</Text>
              </View>
            ))}
          </>
        )}

        {data.projects.some((p) => p.name || p.description) && (
          <>
            <Text style={pdfStyles.h}>PROJECTS</Text>
            {data.projects.map((proj) => (
              <View key={proj.id} style={{ marginBottom: 6 }}>
                <Text style={pdfStyles.entryTitle}>
                  {proj.name}{proj.tech ? ` — ${proj.tech}` : ""}
                </Text>
                <Text style={pdfStyles.body}>{proj.description}</Text>
              </View>
            ))}
          </>
        )}

        {data.educations.some((e) => e.degree) && (
          <>
            <Text style={pdfStyles.h}>EDUCATION</Text>
            {data.educations.map((edu) => (
              <View key={edu.id} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
                <Text style={pdfStyles.body}>
                  {edu.degree}{edu.institution ? `, ${edu.institution}` : ""}
                </Text>
                <Text style={pdfStyles.entryMeta}>{edu.year}</Text>
              </View>
            ))}
          </>
        )}

        {data.extras.map((ex) =>
          ex.title ? (
            <View key={ex.id}>
              <Text style={pdfStyles.h}>{ex.title.toUpperCase()}</Text>
              <Text style={pdfStyles.body}>{ex.content}</Text>
            </View>
          ) : null,
        )}

        {data.websiteUrl ? (
          <View style={{ marginTop: 16, borderTop: 1, borderColor: "#e2e8f0", paddingTop: 8 }}>
            <Text style={{ fontSize: 9, color: "#64748b", textAlign: "center" }}>
              Portfolio & Resume Website: {data.websiteUrl}
            </Text>
          </View>
        ) : null}
      </Page>
    </Document>
  );
}
