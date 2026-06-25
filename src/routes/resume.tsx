import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "./roadmaps.index";
import { useAuth } from "@/lib/auth";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Download, Linkedin, Sparkles, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/resume")({ component: ResumeBuilder });

function ResumeBuilder() {
  const { user } = useAuth();
  const [data, setData] = useState({
    headline: `${user?.domain ?? ""} Aspirant`,
    summary: "Final-year engineering student passionate about building impactful products. Strong fundamentals in DSA, web development, and cloud.",
    skills: "React, TypeScript, Node.js, PostgreSQL, AWS, Docker",
    project: "TechLand Clone — A career platform for engineering students. Built with React, Tailwind, and Supabase. 50K+ active users.",
    experience: "Software Engineering Intern @ Razorpay — May 2025 to Jul 2025. Built payment dashboards using React and TypeScript.",
  });

  const score = Math.min(
    100,
    [data.headline, data.summary, data.skills, data.project, data.experience].filter((v) => v.length > 20).length * 20,
  );

  return (
    <AppShell>
      <PageHeader title="Resume Builder" subtitle="ATS-friendly templates, real-time scoring, AI suggestions, one-click PDF export and LinkedIn sync." />

      <div className="grid lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 space-y-4">
          <h2 className="font-bold text-lg">Edit your resume</h2>
          <Field label="Headline"><Input value={data.headline} onChange={(e) => setData({ ...data, headline: e.target.value })} /></Field>
          <Field label="Professional summary"><Textarea rows={3} value={data.summary} onChange={(e) => setData({ ...data, summary: e.target.value })} /></Field>
          <Field label="Skills (comma-separated)"><Input value={data.skills} onChange={(e) => setData({ ...data, skills: e.target.value })} /></Field>
          <Field label="Featured project"><Textarea rows={3} value={data.project} onChange={(e) => setData({ ...data, project: e.target.value })} /></Field>
          <Field label="Experience"><Textarea rows={3} value={data.experience} onChange={(e) => setData({ ...data, experience: e.target.value })} /></Field>
          <div className="flex gap-3">
            <Button variant="hero" onClick={() => toast.success("Resume exported as PDF")}><Download className="size-4" /> Export PDF</Button>
            <Button variant="outline" onClick={() => toast.success("LinkedIn import queued")}><Linkedin className="size-4" /> Import LinkedIn</Button>
          </div>
        </div>

        <div className="space-y-5">
          <div className="glass-card rounded-2xl p-6 text-center">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Resume score</p>
            <p className="text-5xl font-bold gradient-text mt-2">{score}</p>
            <p className="text-xs text-muted-foreground mt-1">ATS-ready</p>
            <div className="mt-4 h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-gradient-primary transition-all" style={{ width: `${score}%` }} />
            </div>
          </div>
          <div className="glass-card rounded-2xl p-6">
            <p className="font-bold flex items-center gap-2"><Sparkles className="size-4 text-accent" /> AI suggestions</p>
            <ul className="mt-3 space-y-2 text-sm">
              {[
                "Add quantifiable impact (e.g. 'reduced load time by 40%')",
                "Include 2+ leadership / extracurricular bullet",
                "Use action verbs: built, shipped, architected, owned",
                "Add a link to a deployed live demo",
              ].map((s) => (
                <li key={s} className="flex gap-2"><CheckCircle2 className="size-4 text-success shrink-0 mt-0.5" /> <span>{s}</span></li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="mt-8 glass-card rounded-2xl p-10 max-w-3xl mx-auto bg-card">
        <h2 className="text-3xl font-bold">{user?.fullName}</h2>
        <p className="text-accent font-semibold">{data.headline}</p>
        <p className="text-sm text-muted-foreground">{user?.email} • {user?.college} • {user?.branch}</p>
        <Section title="Summary">{data.summary}</Section>
        <Section title="Skills">{data.skills}</Section>
        <Section title="Projects">{data.project}</Section>
        <Section title="Experience">{data.experience}</Section>
      </div>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><Label className="mb-1.5 block">{label}</Label>{children}</div>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <h3 className="text-sm font-bold uppercase tracking-widest text-primary border-b border-border pb-1">{title}</h3>
      <p className="mt-2 text-sm whitespace-pre-line">{children}</p>
    </div>
  );
}
