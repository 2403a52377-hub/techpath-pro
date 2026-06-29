import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "./roadmaps.index";
import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Download, Save, Sparkles, CheckCircle2, Printer, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { pdf, Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";

export const Route = createFileRoute("/resume")({ component: ResumeBuilder });

type ResumeData = {
  headline: string;
  summary: string;
  skills: string;
  project: string;
  experience: string;
  education: string;
  websiteUrl: string;
};

const DEFAULT: ResumeData = {
  headline: "",
  summary:
    "Final-year engineering student passionate about building impactful products. Strong fundamentals in DSA, web development, and cloud.",
  skills: "React, TypeScript, Node.js, PostgreSQL, AWS, Docker",
  project:
    "TechLand Clone — A career platform for engineering students. Built with React, Tailwind, and Supabase. Reduced page load by 40%.",
  experience:
    "Software Engineering Intern @ Razorpay — May 2025 to Jul 2025. Built payment dashboards using React and TypeScript; shipped 4 features used by 10K+ merchants.",
  education: "B.Tech, Computer Science — Expected 2026",
  websiteUrl: "",
};

function ResumeBuilder() {
  const { user } = useAuth();
  const [data, setData] = useState<ResumeData>({
    ...DEFAULT,
    headline: `${user?.domain ?? ""} Aspirant`,
  });
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Load existing resume
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
        setData({ ...DEFAULT, ...((row.resume_data as Partial<ResumeData>) || {}) });
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
    toast.success("Resume saved");
  }

  async function exportPdf() {
    if (!user) return;
    const blob = await pdf(
      <ResumePdf
        user={{
          name: user.fullName,
          email: user.email,
          college: user.college,
          branch: user.branch,
        }}
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

  return (
    <AppShell>
      <PageHeader
        title="Resume Builder"
        subtitle="ATS-friendly templates, real-time scoring, AI suggestions, and one-click PDF export."
      />

      <div className="grid lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 space-y-4">
          <h2 className="font-bold text-lg">Edit your resume</h2>
          <Field label="Headline">
            <Input
              value={data.headline}
              onChange={(e) => setData({ ...data, headline: e.target.value })}
            />
          </Field>
          <Field label="Professional Profile">
            <Textarea
              rows={3}
              value={data.summary}
              onChange={(e) => setData({ ...data, summary: e.target.value })}
            />
          </Field>
          <Field label="Skills (comma-separated)">
            <Input
              value={data.skills}
              onChange={(e) => setData({ ...data, skills: e.target.value })}
            />
          </Field>
          <Field label="Education">
            <Input
              value={data.education}
              onChange={(e) => setData({ ...data, education: e.target.value })}
            />
          </Field>
          <Field label="Featured project">
            <Textarea
              rows={3}
              value={data.project}
              onChange={(e) => setData({ ...data, project: e.target.value })}
            />
          </Field>
          <Field label="Experience">
            <Textarea
              rows={3}
              value={data.experience}
              onChange={(e) => setData({ ...data, experience: e.target.value })}
            />
          </Field>
          <Field label="Portfolio / Resume Website URL">
            <Input
              type="url"
              placeholder="https://yourportfolio.com"
              value={data.websiteUrl}
              onChange={(e) => setData({ ...data, websiteUrl: e.target.value })}
            />
          </Field>
          <div className="flex flex-wrap gap-3">
            <Button variant="hero" onClick={save} disabled={busy}>
              {busy ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}{" "}
              Save
            </Button>
            <Button variant="gradient" onClick={exportPdf}>
              <Download className="size-4" /> Export PDF
            </Button>
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="size-4" /> Print
            </Button>
          </div>
        </div>

        <div className="space-y-5">
          <div className="glass-card rounded-2xl p-6 text-center">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Resume score</p>
            <p className="text-5xl font-bold gradient-text mt-2">{score}</p>
            <p className="text-xs text-muted-foreground mt-1">ATS-ready</p>
            <div className="mt-4 h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-gradient-primary transition-all"
                style={{ width: `${score}%` }}
              />
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
              ].map((s) => (
                <li key={s} className="flex gap-2">
                  <CheckCircle2 className="size-4 text-success shrink-0 mt-0.5" /> <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-8 glass-card rounded-2xl p-10 max-w-3xl mx-auto bg-card">
        <h2 className="text-3xl font-bold">{user?.fullName}</h2>
        <p className="text-accent font-semibold">{data.headline}</p>
        <p className="text-sm text-muted-foreground">
          {user?.email} • {user?.college} • {user?.branch}
        </p>
        {data.websiteUrl && (
          <p className="text-sm mt-1">
            🌐{" "}
            <a
              href={data.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
            >
              {data.websiteUrl}
            </a>
          </p>
        )}
        <Section title="Professional Profile">{data.summary}</Section>
        <Section title="Skills">{data.skills}</Section>
        <Section title="Education">{data.education}</Section>
        <Section title="Projects">{data.project}</Section>
        <Section title="Experience">{data.experience}</Section>
        {data.websiteUrl && (
          <div className="mt-6 pt-4 border-t border-border text-center">
            <p className="text-xs text-muted-foreground">
              Portfolio & Resume:{" "}
              <a
                href={data.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-semibold underline underline-offset-2"
              >
                {data.websiteUrl}
              </a>
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}

function computeScore(d: ResumeData) {
  let s = 0;
  if (d.headline.length > 8) s += 10;
  if (d.summary.length > 60) s += 20;
  if (d.skills.split(",").length >= 5) s += 20;
  if (d.education.length > 8) s += 10;
  if (d.project.length > 40) s += 20;
  if (d.experience.length > 40) s += 20;
  return Math.min(100, s);
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-1.5 block">{label}</Label>
      {children}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <h3 className="text-sm font-bold uppercase tracking-widest text-primary border-b border-border pb-1">
        {title}
      </h3>
      <p className="mt-2 text-sm whitespace-pre-line">{children}</p>
    </div>
  );
}

// ============= PDF =============
const pdfStyles = StyleSheet.create({
  page: { padding: 40, fontSize: 10.5, fontFamily: "Helvetica", color: "#1e293b" },
  name: { fontSize: 22, fontWeight: 700 },
  headline: { fontSize: 12, color: "#0ea5e9", marginTop: 2 },
  contact: { fontSize: 9, color: "#64748b", marginTop: 2, marginBottom: 12 },
  hr: { borderBottom: 1, borderColor: "#e2e8f0", marginVertical: 8 },
  h: {
    fontSize: 11,
    fontWeight: 700,
    color: "#1d4ed8",
    letterSpacing: 1.2,
    marginTop: 10,
    marginBottom: 4,
  },
  body: { fontSize: 10, lineHeight: 1.45 },
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
        <Text style={pdfStyles.h}>EDUCATION</Text>
        <Text style={pdfStyles.body}>{data.education}</Text>
        <Text style={pdfStyles.h}>PROJECTS</Text>
        <Text style={pdfStyles.body}>{data.project}</Text>
        <Text style={pdfStyles.h}>EXPERIENCE</Text>
        <Text style={pdfStyles.body}>{data.experience}</Text>
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
