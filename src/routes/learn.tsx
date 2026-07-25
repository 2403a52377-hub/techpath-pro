import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "./roadmaps.index";
import { ROADMAPS } from "@/lib/data";
import { Play, ExternalLink, FileText, BookOpen, X, Download, Maximize2, Loader2, Database } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/learn")({ component: LearnHub });

/* ── Curated cheat sheet / notes URLs per skill keyword ── */
const CHEAT_SHEET_URLS: Record<string, string> = {
  // Languages
  "HTML": "https://htmlcheatsheet.com/",
  "CSS": "https://htmlcheatsheet.com/css/",
  "JavaScript": "https://htmlcheatsheet.com/js/",
  "TypeScript": "https://www.typescriptlang.org/cheatsheets",
  "Python": "https://www.pythoncheatsheet.org/",
  "Java": "https://introcs.cs.princeton.edu/java/11cheatsheet/",
  "C++": "https://github.com/mortennobel/cpp-cheatsheet",
  "SQL": "https://www.sqltutorial.org/sql-cheat-sheet/",
  "Bash": "https://devhints.io/bash",
  "Go": "https://devhints.io/go",
  "Rust": "https://cheats.rs/",

  // Frameworks & Libraries
  "React": "https://devhints.io/react",
  "Vue": "https://devhints.io/vue",
  "Angular": "https://angular.io/guide/cheatsheet",
  "Node.js": "https://devhints.io/nodejs",
  "Express": "https://devhints.io/express",
  "Next.js": "https://nextjs.org/docs",
  "Django": "https://www.codewithharry.com/blogpost/django-cheat-sheet/",
  "Flask": "https://s3.us-east-2.amazonaws.com/prettyprinted/flask_cheatsheet.pdf",
  "Spring Boot": "https://www.jrebel.com/blog/spring-annotations-cheat-sheet",

  // DSA & CS
  "Data Structures": "https://betterprogramming.pub/data-structures-cheat-sheet-cfb4fa3b7985",
  "Algorithms": "https://www.bigocheatsheet.com/",
  "Arrays": "https://www.bigocheatsheet.com/",
  "Linked List": "https://www.bigocheatsheet.com/",
  "Trees": "https://www.bigocheatsheet.com/",
  "Graphs": "https://www.bigocheatsheet.com/",
  "Dynamic Programming": "https://www.techiedelight.com/dynamic-programming-interview-questions/",
  "Sorting": "https://www.bigocheatsheet.com/",
  "Searching": "https://www.bigocheatsheet.com/",
  "Big O Notation": "https://www.bigocheatsheet.com/",

  // AI/ML
  "Machine Learning": "https://ml-cheatsheet.readthedocs.io/en/latest/",
  "Deep Learning": "https://stanford.edu/~shervine/teaching/cs-229/cheatsheet-deep-learning",
  "NumPy": "https://numpy.org/doc/stable/user/quickstart.html",
  "Pandas": "https://pandas.pydata.org/Pandas_Cheat_Sheet.pdf",
  "TensorFlow": "https://www.tensorflow.org/resources/learn-ml",
  "PyTorch": "https://pytorch.org/tutorials/",
  "Scikit-learn": "https://scikit-learn.org/stable/user_guide.html",
  "NLP": "https://cheatography.com/murenei/cheat-sheets/natural-language-processing-with-python/",

  // DevOps & Cloud
  "Docker": "https://docs.docker.com/get-started/docker_cheatsheet.pdf",
  "Kubernetes": "https://kubernetes.io/docs/reference/kubectl/cheatsheet/",
  "Git": "https://education.github.com/git-cheat-sheet-education.pdf",
  "GitHub Actions": "https://github.github.io/actions-cheat-sheet/",
  "AWS": "https://intellipaat.com/blog/tutorial/amazon-web-services-aws-tutorial/aws-cheat-sheet/",
  "Linux": "https://cheatography.com/davechild/cheat-sheets/linux-command-line/",
  "Nginx": "https://nginx.org/en/docs/",

  // Web Dev
  "REST API": "https://devhints.io/rest",
  "GraphQL": "https://devhints.io/graphql",
  "MongoDB": "https://www.mongodb.com/developer/products/mongodb/cheat-sheet/",
  "PostgreSQL": "https://www.postgresqltutorial.com/postgresql-cheat-sheet/",
  "Redis": "https://redis.io/docs/",
  "Tailwind CSS": "https://nerdcave.com/tailwind-cheat-sheet",
  "Figma": "https://help.figma.com/hc/en-us/articles/360040328553",

  // Security
  "Cybersecurity": "https://cheatsheetseries.owasp.org/",
  "Network Security": "https://cheatsheetseries.owasp.org/",
  "Cryptography": "https://cheatsheetseries.owasp.org/",

  // System Design
  "System Design": "https://github.com/donnemartin/system-design-primer",
  "Microservices": "https://microservices.io/patterns/index.html",
  "Load Balancing": "https://github.com/donnemartin/system-design-primer#load-balancer",

  // Mobile
  "React Native": "https://devhints.io/react",
  "Flutter": "https://flutter.dev/docs/reference/flutter-cli",
  "Swift": "https://swift.org/documentation/",
  "Kotlin": "https://kotlinlang.org/docs/reference/",

  // Blockchain
  "Solidity": "https://docs.soliditylang.org/",
  "Ethereum": "https://ethereum.org/en/developers/docs/",
  "Web3.js": "https://web3js.readthedocs.io/",
};

function getCheatSheet(skillName: string): string {
  // Direct match
  if (CHEAT_SHEET_URLS[skillName]) return CHEAT_SHEET_URLS[skillName];
  // Partial match
  for (const [key, url] of Object.entries(CHEAT_SHEET_URLS)) {
    if (skillName.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(skillName.toLowerCase())) {
      return url;
    }
  }
  // Fallback: devhints search
  return `https://devhints.io/${encodeURIComponent(skillName.toLowerCase().replace(/\s+/g, "-"))}`;
}

/* ── PDF / Notes Modal ── */
function NotesModal({ skillName, url, onClose }: { skillName: string; url: string; onClose: () => void }) {
  const isPdf = url.endsWith(".pdf");
  const isEmbeddable = !url.includes("github.com/") && !url.includes("ml-cheatsheet");

  return (
    <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur flex flex-col" onClick={onClose}>
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-card/80 backdrop-blur shrink-0" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 grid place-items-center">
            <FileText className="size-4 text-white" />
          </div>
          <div>
            <p className="font-bold text-sm">{skillName} — Notes & Cheat Sheet</p>
            <p className="text-xs text-muted-foreground">{url}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href={url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5">
              <Download className="size-3.5" /> Open in New Tab
            </a>
          </Button>
          <button onClick={onClose} className="size-8 rounded-lg bg-white/5 grid place-items-center hover:bg-white/10 transition-colors">
            <X className="size-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {isPdf ? (
          <embed
            src={url + "#toolbar=1&navpanes=0"}
            type="application/pdf"
            className="w-full h-full"
          />
        ) : isEmbeddable ? (
          <iframe
            src={url}
            className="w-full h-full border-0"
            title={`${skillName} cheat sheet`}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-6 text-center px-6">
            <div className="size-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-cyan-500 grid place-items-center">
              <FileText className="size-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">{skillName} Cheat Sheet</h2>
              <p className="text-muted-foreground mb-6 max-w-md">This resource opens best in a new tab. Click below to view the full cheat sheet and notes.</p>
              <Button variant="hero" size="lg" asChild>
                <a href={url} target="_blank" rel="noreferrer" className="gap-2">
                  <Maximize2 className="size-4" /> Open Full Cheat Sheet
                </a>
              </Button>
            </div>
            {/* Preview card */}
            <div className="grid grid-cols-2 gap-3 max-w-md w-full mt-4">
              {[
                { label: "Format", value: "Interactive Web" },
                { label: "Coverage", value: "Complete Reference" },
                { label: "Level", value: "All Levels" },
                { label: "Source", value: "Curated" },
              ].map((item) => (
                <div key={item.label} className="glass-card rounded-xl p-3 text-center">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="font-semibold text-sm mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function LearnHub() {
  const slugs = Object.keys(ROADMAPS);
  const [active, setActive] = useState(slugs[0]);
  const r = ROADMAPS[active];
  const skills = r.stages.flatMap((s) => s.skills);

  const [customCourseLinks, setCustomCourseLinks] = useState<Record<string, string>>({});
  const [customNotesLinks, setCustomNotesLinks] = useState<Record<string, string>>({});
  const [notesModal, setNotesModal] = useState<{ skill: string; url: string } | null>(null);
  const [dbModules, setDbModules] = useState<{ title: string; youtube_url: string | null }[]>([]);
  const [dbLoading, setDbLoading] = useState(false);

  async function loadDbModules() {
    setDbLoading(true);
    try {
      // Fetch all roadmap modules from Supabase and build a skill->youtube map
      const { data, error } = await supabase
        .from("roadmap_modules")
        .select("title, youtube_url")
        .not("youtube_url", "is", null);
      if (!error && data) {
        setDbModules(data);
        // Build overrides map: skill name -> youtube url
        const courseOverrides: Record<string, string> = {};
        data.forEach((m: any) => {
          if (m.youtube_url) courseOverrides[m.title] = m.youtube_url;
        });
        // Merge with localStorage custom links (localStorage wins for admin per-skill overrides)
        try {
          const localCourses = JSON.parse(localStorage.getItem("customCourseLinks") ?? "{}");
          setCustomCourseLinks({ ...courseOverrides, ...localCourses });
        } catch {
          setCustomCourseLinks(courseOverrides);
        }
      }
    } catch (e) {
      console.error("Failed to load DB modules:", e);
    } finally {
      setDbLoading(false);
    }
  }

  useEffect(() => {
    // Load localStorage custom notes links
    try {
      const notes = JSON.parse(localStorage.getItem("customNotesLinks") ?? "{}");
      setCustomNotesLinks(notes);
    } catch {}
    // Load from Supabase
    loadDbModules();

    // Real-time subscription: when admin adds/updates roadmap modules, refresh
    const channel = supabase
      .channel("learn-hub-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "roadmap_modules" }, () => {
        loadDbModules();
        toast.info("📚 Learning hub updated by admin!", { duration: 3000 });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [active]);

  return (
    <AppShell>
      {notesModal && (
        <NotesModal
          skillName={notesModal.skill}
          url={notesModal.url}
          onClose={() => setNotesModal(null)}
        />
      )}

      <PageHeader
        title="Learning Hub"
        subtitle="Tutorials, cheat sheets, notes and curated YouTube courses for every roadmap skill."
      />

      {/* Roadmap selector */}
      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        {slugs.map((s) => (
          <button
            key={s}
            onClick={() => setActive(s)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${active === s ? "bg-gradient-primary text-primary-foreground shadow-md" : "glass-card hover:shadow-glow"}`}
          >
            {ROADMAPS[s].name}
          </button>
        ))}
      </div>

      {/* Stats bar */}
      <div className="mt-4 flex gap-4 flex-wrap items-center">
        {[
          { label: `${skills.length} Skills`, color: "text-primary" },
          { label: "YouTube Courses", color: "text-rose-400" },
          { label: "In-App Cheat Sheets", color: "text-emerald-400" },
          { label: "Curated Notes", color: "text-accent" },
        ].map((s) => (
          <span key={s.label} className={cn("text-xs font-semibold", s.color)}>
            • {s.label}
          </span>
        ))}
        {dbLoading && <Loader2 className="size-3 animate-spin text-muted-foreground ml-2" />}
        {dbModules.length > 0 && (
          <span className="text-xs font-semibold text-blue-400 flex items-center gap-1">
            <Database className="size-3" /> {dbModules.length} DB Modules Loaded
          </span>
        )}
      </div>

      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {skills.map((skill) => {
          const courseUrl = customCourseLinks[skill.name] || skill.youtube;
          const customNotes = customNotesLinks[skill.name];
          const cheatSheetUrl = customNotes || getCheatSheet(skill.name);

          return (
            <div
              key={skill.name}
              className="group glass-card rounded-2xl overflow-hidden hover:shadow-elegant hover:-translate-y-1 transition-all flex flex-col justify-between"
            >
              {/* Video thumbnail area */}
              <a
                href={courseUrl}
                target="_blank"
                rel="noreferrer"
                className="aspect-video bg-gradient-primary relative grid place-items-center cursor-pointer overflow-hidden"
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/60 to-accent/40" />
                <Play className="size-12 text-white opacity-90 group-hover:scale-110 transition-transform relative z-10 drop-shadow-lg" />
                <span className="absolute bottom-2 left-2 text-xs bg-black/60 text-white px-2 py-0.5 rounded font-medium z-10">
                  YouTube Course
                </span>
                <span className="absolute top-2 right-2 text-[10px] bg-primary/20 text-primary-foreground border border-white/20 px-2 py-0.5 rounded-full z-10 font-semibold">
                  FREE
                </span>
              </a>

              {/* Card body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <p className="font-semibold text-foreground text-sm">{skill.name}</p>
                  <a
                    href={courseUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-muted-foreground mt-1 flex items-center gap-1 hover:text-primary transition-colors"
                  >
                    Top-rated course <ExternalLink className="size-3" />
                  </a>
                </div>

                {/* Action buttons */}
                <div className="mt-4 flex gap-2">
                  {/* Notes / Cheat Sheet — opens in-app modal */}
                  <button
                    onClick={() => setNotesModal({ skill: skill.name, url: cheatSheetUrl })}
                    className={cn(
                      "flex-1 text-xs px-2.5 py-1.5 rounded-full flex items-center justify-center gap-1 transition-all border font-medium",
                      "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500/40"
                    )}
                  >
                    <FileText className="size-3" />
                    Notes
                  </button>

                  {/* Cheat Sheet — opens in-app modal */}
                  <button
                    onClick={() => setNotesModal({ skill: skill.name, url: cheatSheetUrl })}
                    className={cn(
                      "flex-1 text-xs px-2.5 py-1.5 rounded-full flex items-center justify-center gap-1 transition-all border font-medium",
                      "bg-accent/15 text-accent border-accent/20 hover:bg-accent/25 hover:border-accent/40"
                    )}
                  >
                    <BookOpen className="size-3" />
                    Cheat Sheet
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
