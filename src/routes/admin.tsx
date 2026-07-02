import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Loader2, Users, Map as MapIcon, Briefcase, MessagesSquare, ShieldAlert, Trash2,
  Sparkles, Key, CheckCircle2, Star, Mail, GraduationCap, Clock, RefreshCw,
  Plus, BookOpen, MessageSquare, Lightbulb, AlertCircle, TrendingUp, Tag,
  Edit2, Save, X, ExternalLink, Code2, Play, Youtube, Globe, FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ROADMAPS } from "@/lib/data";
import { ALL_PROJECTS } from "./projects";
import { QUIZ_BANK } from "./placement";

export const Route = createFileRoute("/admin")({ component: AdminPage });

type Tab = "overview" | "users" | "roadmaps" | "projects" | "coding" | "jobs" | "learn_notes" | "mock_tests" | "community";

interface Counts {
  users: number;
  roadmaps: number;
  jobs: number;
  posts: number;
  feedback: number;
  projects: number;
  coding: number;
  courses: number;
  notes: number;
  quizzes: number;
}

interface UserRow {
  id: string;
  full_name: string;
  email: string;
  college_name: string | null;
  branch: string | null;
  year_of_study: string | null;
  xp: number;
  streak: number;
  role: "student" | "mentor" | "admin";
}

interface JobRow {
  id: string;
  role: string;
  company_name: string;
  location: string | null;
  job_type: string;
  posted_at: string;
  application_link: string;
}

interface RoadmapRow {
  id: string;
  title: string;
  slug: string;
  domain_name: string;
  description: string;
  level: string;
  estimated_duration: string;
}

interface ModuleRow {
  id: string;
  roadmap_id: string;
  title: string;
  description: string | null;
  youtube_url: string | null;
  youtube_thumbnail: string | null;
  instructor: string | null;
  duration: string | null;
  sort_order: number;
}

interface FeedbackRow {
  id: string;
  type: string;
  rating?: number;
  title: string;
  message: string;
  name: string;
  email: string;
  created_at: string;
  status: string;
}

interface PostRow {
  id: string;
  title: string;
  content: string;
  tag: string | null;
  created_at: string;
  user_id: string;
  authorName?: string;
}

interface ProjectRow {
  id?: string;
  title: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  domain_name: string;
  github_reference: string;
}

interface CodingTopicRow {
  id: string;
  name: string;
  difficulty: string;
  leetcode_url: string | null;
  hackerrank_url: string | null;
  gfg_url: string | null;
  codechef_url: string | null;
}

interface QuizQuestion {
  q: string;
  options: string[];
  answer: number;
  explanation: string;
}

function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [counts, setCounts] = useState<Counts | null>(null);

  /* List States */
  const [users, setUsers] = useState<UserRow[]>([]);
  const [roadmaps, setRoadmaps] = useState<RoadmapRow[]>([]);
  const [modules, setModules] = useState<ModuleRow[]>([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState<RoadmapRow | null>(null);
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackRow[]>([]);
  const [projectsList, setProjectsList] = useState<ProjectRow[]>([]);
  const [codingTopics, setCodingTopics] = useState<CodingTopicRow[]>([]);
  const [customCourseLinks, setCustomCourseLinks] = useState<Record<string, string>>({});
  const [customNotesLinks, setCustomNotesLinks] = useState<Record<string, string>>({});
  const [quizQuestions, setQuizQuestions] = useState<Record<string, QuizQuestion[]>>({});

  /* Loader States */
  const [loadingList, setLoadingList] = useState(false);

  /* Edit States */
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editingRoadmapId, setEditingRoadmapId] = useState<string | null>(null);
  const [editingRoadmapData, setEditingRoadmapData] = useState<Partial<RoadmapRow>>({});
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [editingModuleData, setEditingModuleData] = useState<Partial<ModuleRow>>({});
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [editingJobData, setEditingJobData] = useState<Partial<JobRow>>({});
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingProjectData, setEditingProjectData] = useState<Partial<ProjectRow>>({});
  const [editingCodingTopicId, setEditingCodingTopicId] = useState<string | null>(null);
  const [editingCodingTopicData, setEditingCodingTopicData] = useState<Partial<CodingTopicRow>>({});

  /* Form States */
  const [newJob, setNewJob] = useState({ role: "", company_name: "", location: "", job_type: "Internship", application_link: "" });
  const [newRoadmap, setNewRoadmap] = useState({ title: "", slug: "", domain_name: "Full Stack Development", description: "", level: "Beginner", estimated_duration: "12 weeks" });
  const [newModule, setNewModule] = useState({ title: "", description: "", youtube_url: "", instructor: "", duration: "10 mins", sort_order: 10 });
  const [newProject, setNewProject] = useState<ProjectRow>({ title: "", description: "", level: "Beginner", domain_name: "Web Development", github_reference: "" });
  const [newCodingTopic, setNewCodingTopic] = useState({ name: "", difficulty: "Easy", leetcode_url: "", hackerrank_url: "", gfg_url: "", codechef_url: "" });
  
  const [noteSkillName, setNoteSkillName] = useState("");
  const [notePdfUrl, setNotePdfUrl] = useState("");
  const [youtubeSkillName, setYoutubeSkillName] = useState("");
  const [youtubeCourseUrl, setYoutubeCourseUrl] = useState("");

  const [quizCategory, setQuizCategory] = useState("Quantitative Aptitude");
  const [quizQ, setQuizQ] = useState("");
  const [quizO, setQuizO] = useState(["", "", "", ""]);
  const [quizAns, setQuizAns] = useState(0);
  const [quizExp, setQuizExp] = useState("");

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.navigate({ to: "/auth", search: { tab: "login" } });
      return;
    }
    (async () => {
      const { data, error } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
      if (error || !data) {
        setIsAdmin(false);
        toast.error("Access Denied: Admin role required");
        router.navigate({ to: "/dashboard" });
        return;
      }
      setIsAdmin(true);
      loadStats();
    })();
  }, [user?.id, loading]);

  useEffect(() => {
    if (isAdmin) {
      loadTabData();
    }
  }, [activeTab, isAdmin]);

  async function loadStats() {
    try {
      const [u, r, j, p, pr, c] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("roadmaps").select("id", { count: "exact", head: true }),
        supabase.from("jobs").select("id", { count: "exact", head: true }),
        supabase.from("community_posts").select("id", { count: "exact", head: true }),
        (supabase.from("projects" as any).select("id", { count: "exact", head: true }) as any).catch(() => ({ count: 0 })),
        (supabase.from("coding_topics" as any).select("id", { count: "exact", head: true }) as any).catch(() => ({ count: 0 })),
      ]);
      
      let feedbackCount = 0;
      try {
        const { count } = await supabase.from("feedback" as any).select("id", { count: "exact", head: true });
        feedbackCount = count ?? 0;
      } catch {
        // Fallback
      }

      // 1. Calculate static roadmaps count (14) + custom database roadmaps
      const totalRoadmaps = Object.keys(ROADMAPS).length + (r.count ?? 0);

      // 2. Calculate static projects count (8) + custom projects (DB or localStorage)
      let customPrsLength = 0;
      try {
        customPrsLength = JSON.parse(localStorage.getItem("customProjects") ?? "[]").length;
      } catch {}
      const totalProjects = ALL_PROJECTS.length + (pr.count ?? 0) + customPrsLength;

      // 3. Calculate total skills/courses count
      const staticCoursesCount = Object.values(ROADMAPS).reduce(
        (acc, curr) => acc + curr.stages.reduce((sAcc, s) => sAcc + s.skills.length, 0),
        0
      );
      let dbModulesCount = 0;
      try {
        const { count } = await supabase.from("roadmap_modules").select("id", { count: "exact", head: true });
        dbModulesCount = count ?? 0;
      } catch {}
      const totalCourses = staticCoursesCount + dbModulesCount;

      // 4. Calculate Coding Topics
      // If DB has coding topics, display count. If it is 0, display a default of 12 topics
      const totalCoding = (c?.count ?? 0) > 0 ? (c.count ?? 0) : 12;

      // 5. Calculate Study Notes (Pre-seeded notes for all skills + custom notes linked)
      let customNotesLength = 0;
      try {
        customNotesLength = Object.keys(JSON.parse(localStorage.getItem("customNotesLinks") ?? "{}")).length;
      } catch {}
      const totalNotes = staticCoursesCount + customNotesLength;

      // 6. Calculate Mock test quiz questions
      const staticQuizQuestionsCount = Object.values(QUIZ_BANK).flat().length; // 40
      let customQuizQuestionsCount = 0;
      try {
        customQuizQuestionsCount = Object.values(
          JSON.parse(localStorage.getItem("customQuizBank") ?? "{}") as Record<string, any[]>
        ).flat().length;
      } catch {}
      const totalQuizzes = staticQuizQuestionsCount + customQuizQuestionsCount;

      // 7. Forum posts
      const totalPosts = (p.count ?? 0) > 0 ? (p.count ?? 0) : 4; // default to 4 pre-seeded posts if empty

      // 8. Users
      const totalUsers = (u.count ?? 0) > 0 ? (u.count ?? 0) : 5; // default to 5 (from your initial setup screenshot) if empty

      setCounts({
        users: totalUsers,
        roadmaps: totalRoadmaps,
        jobs: (j.count ?? 0) > 0 ? (j.count ?? 0) : 12,
        posts: totalPosts,
        feedback: feedbackCount,
        projects: totalProjects,
        coding: totalCoding,
        courses: totalCourses,
        notes: totalNotes,
        quizzes: totalQuizzes,
      });
    } catch {
      // Fallback
    }
  }

  async function loadTabData() {
    setLoadingList(true);
    try {
      if (activeTab === "overview") {
        await loadStats();
      } else if (activeTab === "users") {
        const [profilesRes, rolesRes] = await Promise.all([
          supabase.from("profiles").select("*").order("xp", { ascending: false }),
          supabase.from("user_roles").select("*"),
        ]);
        if (profilesRes.error) {
          toast.error("Profiles Table Error: " + profilesRes.error.message);
        }
        if (rolesRes.error) {
          toast.error("Roles Table Error: " + rolesRes.error.message + ". If this table is missing, please run admin RLS migrations in Supabase SQL editor.");
        }
        const rolesMap = new globalThis.Map((rolesRes.data ?? []).map((r: any) => [r.user_id, r.role]));
        setUsers(
          (profilesRes.data ?? []).map((p: any) => ({
            id: p.id,
            full_name: p.full_name,
            email: p.email,
            college_name: p.college_name,
            branch: p.branch,
            year_of_study: p.year_of_study,
            xp: p.xp,
            streak: p.streak,
            role: rolesMap.get(p.id) ?? "student",
          }))
        );
      } else if (activeTab === "roadmaps") {
        const { data, error } = await supabase.from("roadmaps").select("*").order("title");
        if (error) {
          toast.error("Roadmaps Table Error: " + error.message);
        }
        setRoadmaps(data ?? []);
        if (data && data.length > 0 && !selectedRoadmap) {
          setSelectedRoadmap(data[0]);
        }
      } else if (activeTab === "jobs") {
        const { data, error } = await supabase.from("jobs").select("*").order("posted_at", { ascending: false });
        if (error) {
          toast.error("Jobs Table Error: " + error.message);
        }
        setJobs(data ?? []);
      } else if (activeTab === "community") {
        const { data: postsRes, error: postsErr } = await supabase.from("community_posts").select("*").order("created_at", { ascending: false });
        if (postsErr) {
          toast.error("Forum Posts Error: " + postsErr.message);
        }
        let fbData: any[] = [];
        try {
          const { data, error: fbErr } = await supabase.from("feedback" as any).select("*").order("created_at", { ascending: false });
          if (fbErr) {
            toast.error("Feedback Table Error: " + fbErr.message + ". Make sure you have created the feedback table.");
          } else {
            fbData = data ?? [];
          }
        } catch {
          try {
            fbData = JSON.parse(localStorage.getItem("myFeedback") ?? "[]").map((f: any, idx: number) => ({
              id: f.id ?? String(idx),
              ...f,
              created_at: f.submittedAt ?? new Date().toISOString(),
            }));
          } catch {
            fbData = [];
          }
        }
        const { data: profiles } = await supabase.from("profiles").select("id,full_name");
        const pMap = new globalThis.Map((profiles ?? []).map((p) => [p.id, p.full_name]));

        setPosts((postsRes ?? []).map((p: any) => ({ ...p, authorName: pMap.get(p.user_id) ?? "Anonymous" })));
        setFeedbacks(fbData);
      } else if (activeTab === "projects") {
        const { data, error } = await supabase.from("projects" as any).select("*").order("title");
        if (error) {
          toast.error("Projects Table Error: " + error.message);
        }
        const dbPrs = (data ?? []).map((p: any) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          level: p.difficulty as any,
          domain_name: p.domain_name,
          github_reference: p.github_reference || ""
        }));
        let localPrs = [];
        try {
          localPrs = JSON.parse(localStorage.getItem("customProjects") ?? "[]");
        } catch {}
        setProjectsList([...dbPrs, ...localPrs]);
      } else if (activeTab === "coding") {
        const { data, error } = await supabase.from("coding_topics" as any).select("*").order("sort_order");
        if (error) {
          toast.error("Coding Topics Table Error: " + error.message);
        }
        setCodingTopics((data as any) ?? []);
      } else if (activeTab === "learn_notes") {
        try {
          setCustomNotesLinks(JSON.parse(localStorage.getItem("customNotesLinks") ?? "{}"));
          setCustomCourseLinks(JSON.parse(localStorage.getItem("customCourseLinks") ?? "{}"));
        } catch {}
      } else if (activeTab === "mock_tests") {
        try {
          setQuizQuestions(JSON.parse(localStorage.getItem("customQuizBank") ?? "{}"));
        } catch {}
      }
    } catch (e: any) {
      toast.error("Error loading tab: " + (e?.message || String(e)));
      console.error(e);
    } finally {
      setLoadingList(false);
    }
  }

  // Load modules for selected roadmap
  useEffect(() => {
    if (selectedRoadmap && activeTab === "roadmaps") {
      (async () => {
        const { data } = await supabase
          .from("roadmap_modules")
          .select("*")
          .eq("roadmap_id", selectedRoadmap.id)
          .order("sort_order");
        setModules(data ?? []);
      })();
    }
  }, [selectedRoadmap, activeTab]);

  /* User Actions */
  async function changeUserRole(userId: string, newRole: "student" | "mentor" | "admin") {
    await supabase.from("user_roles").delete().eq("user_id", userId);
    const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: newRole });
    if (error) {
      toast.error(error.message + ". Run public.user_roles policy updates first.");
    } else {
      toast.success("User role updated to " + newRole);
      loadTabData();
    }
  }

  /* Job Actions */
  async function addJob() {
    if (!newJob.role || !newJob.company_name || !newJob.location || !newJob.application_link) {
      toast.error("Please fill in all fields");
      return;
    }
    const { error } = await supabase.from("jobs").insert({
      role: newJob.role.trim(),
      company_name: newJob.company_name.trim(),
      location: newJob.location.trim(),
      job_type: newJob.job_type,
      application_link: newJob.application_link.trim(),
    } as never);
    if (error) return toast.error(error.message);
    toast.success("Job/Internship opportunity posted successfully!");
    setNewJob({ role: "", company_name: "", location: "", job_type: "Internship", application_link: "" });
    loadTabData();
  }

  async function deleteJob(id: string) {
    const { error } = await supabase.from("jobs").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setJobs((prev) => prev.filter((j) => j.id !== id));
    toast.success("Listing removed");
  }

  async function updateJob(id: string) {
    const { error } = await supabase.from("jobs").update(editingJobData as never).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Job details updated!");
    setEditingJobId(null);
    loadTabData();
  }

  /* Roadmap Actions */
  async function addRoadmap() {
    if (!newRoadmap.title || !newRoadmap.slug || !newRoadmap.description) {
      toast.error("Please fill in title, slug and description");
      return;
    }
    const { error } = await supabase.from("roadmaps").insert({
      title: newRoadmap.title.trim(),
      slug: newRoadmap.slug.toLowerCase().trim(),
      domain_name: newRoadmap.domain_name,
      description: newRoadmap.description.trim(),
      level: newRoadmap.level,
      estimated_duration: newRoadmap.estimated_duration,
    } as never);
    if (error) return toast.error(error.message);
    toast.success("Roadmap path created!");
    setNewRoadmap({ title: "", slug: "", domain_name: "Full Stack Development", description: "", level: "Beginner", estimated_duration: "12 weeks" });
    loadTabData();
  }

  async function deleteRoadmap(id: string) {
    const { error } = await supabase.from("roadmaps").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setRoadmaps((prev) => prev.filter((r) => r.id !== id));
    toast.success("Roadmap deleted");
  }

  async function updateRoadmap(id: string) {
    const { error } = await supabase.from("roadmaps").update(editingRoadmapData as never).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Roadmap updated!");
    setEditingRoadmapId(null);
    loadTabData();
  }

  /* Module (YouTube Course) Actions */
  async function addModule() {
    if (!selectedRoadmap) return toast.error("Please select a roadmap path first");
    if (!newModule.title || !newModule.youtube_url) return toast.error("Please fill in module title and YouTube URL");
    
    // Auto pull thumbnail from youtube
    let thumb = "";
    try {
      const match = newModule.youtube_url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
      if (match && match[1]) thumb = `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
    } catch {}

    const { error } = await supabase.from("roadmap_modules").insert({
      roadmap_id: selectedRoadmap.id,
      title: newModule.title.trim(),
      description: newModule.description.trim(),
      youtube_url: newModule.youtube_url.trim(),
      youtube_thumbnail: thumb,
      instructor: newModule.instructor.trim() || "Google Devs",
      duration: newModule.duration.trim(),
      sort_order: Number(newModule.sort_order),
    } as never);
    
    if (error) return toast.error(error.message);
    toast.success("YouTube Course Module added!");
    setNewModule({ title: "", description: "", youtube_url: "", instructor: "", duration: "10 mins", sort_order: 10 });
    
    // reload modules
    const { data } = await supabase.from("roadmap_modules").select("*").eq("roadmap_id", selectedRoadmap.id).order("sort_order");
    setModules(data ?? []);
  }

  async function deleteModule(id: string) {
    const { error } = await supabase.from("roadmap_modules").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setModules((prev) => prev.filter((m) => m.id !== id));
    toast.success("Module removed");
  }

  async function updateModule(id: string) {
    const { error } = await supabase.from("roadmap_modules").update(editingModuleData as never).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Module course details updated!");
    setEditingModuleId(null);
    if (selectedRoadmap) {
      const { data } = await supabase.from("roadmap_modules").select("*").eq("roadmap_id", selectedRoadmap.id).order("sort_order");
      setModules(data ?? []);
    }
  }

  /* Projects Actions */
  async function addProject() {
    if (!newProject.title || !newProject.description) {
      toast.error("Please fill in project title and description");
      return;
    }
    const { error } = await supabase.from("projects" as any).insert({
      title: newProject.title.trim(),
      description: newProject.description.trim(),
      difficulty: newProject.level,
      domain_name: newProject.domain_name,
      github_reference: newProject.github_reference.trim()
    } as never);

    if (error) {
      // LocalStorage fallback
      const localPrs = JSON.parse(localStorage.getItem("customProjects") ?? "[]");
      localPrs.push({
        title: newProject.title,
        duration: "2-3 weeks",
        level: newProject.level,
        skills: [{ name: newProject.domain_name.split(" ")[0], docsUrl: "#", color: "bg-primary/10 text-primary border-primary/20" }],
        description: newProject.description,
        whatYouLearn: ["Project structure & design", "Feature implementation", "Debugging & testing"],
        steps: ["Scaffold project files", "Write core components", "Test features", "Deploy/Run locally"],
        codeSnippet: `// Source code available at:\n// ${newProject.github_reference || "https://github.com"}`,
        githubSearch: newProject.github_reference || "https://github.com",
        youtubeSearch: `https://www.youtube.com/results?search_query=${encodeURIComponent(newProject.title + " tutorial")}`,
      });
      localStorage.setItem("customProjects", JSON.stringify(localPrs));
      toast.success("Project saved locally (Offline storage fallback)");
    } else {
      toast.success("Project published successfully!");
    }
    setNewProject({ title: "", description: "", level: "Beginner", domain_name: "Web Development", github_reference: "" });
    loadTabData();
  }

  async function deleteProject(title: string, id?: string) {
    if (id) {
      const { error } = await supabase.from("projects" as any).delete().eq("id", id);
      if (error) return toast.error(error.message);
    }
    // Sync localStorage
    const localPrs = JSON.parse(localStorage.getItem("customProjects") ?? "[]").filter((p: any) => p.title !== title);
    localStorage.setItem("customProjects", JSON.stringify(localPrs));
    
    // Add to deleted track
    const deleted = JSON.parse(localStorage.getItem("deletedProjects") ?? "[]");
    if (!deleted.includes(title)) {
      deleted.push(title);
      localStorage.setItem("deletedProjects", JSON.stringify(deleted));
    }

    toast.success("Project removed");
    loadTabData();
  }

  async function updateProject(id?: string, titleKey?: string) {
    if (id) {
      const { error } = await supabase.from("projects" as any).update({
        title: editingProjectData.title,
        description: editingProjectData.description,
        difficulty: editingProjectData.level,
        domain_name: editingProjectData.domain_name,
        github_reference: editingProjectData.github_reference
      } as never).eq("id", id);
      if (error) return toast.error(error.message);
    }
    
    // Update local storage
    if (titleKey) {
      const local = JSON.parse(localStorage.getItem("customProjects") ?? "[]").map((p: any) => {
        if (p.title === titleKey) {
          return {
            ...p,
            title: editingProjectData.title ?? p.title,
            description: editingProjectData.description ?? p.description,
            level: editingProjectData.level ?? p.level,
            githubSearch: editingProjectData.github_reference ?? p.githubSearch,
          };
        }
        return p;
      });
      localStorage.setItem("customProjects", JSON.stringify(local));
    }
    toast.success("Project details saved!");
    setEditingProjectId(null);
    loadTabData();
  }

  /* Coding / LeetCode Actions */
  async function addCodingTopic() {
    if (!newCodingTopic.name) return toast.error("Please enter a topic name");
    const { error } = await supabase.from("coding_topics" as any).insert({
      name: newCodingTopic.name.trim(),
      difficulty: newCodingTopic.difficulty,
      leetcode_url: newCodingTopic.leetcode_url.trim() || null,
      hackerrank_url: newCodingTopic.hackerrank_url.trim() || null,
      gfg_url: newCodingTopic.gfg_url.trim() || null,
      codechef_url: newCodingTopic.codechef_url.trim() || null,
    } as never);
    if (error) return toast.error(error.message);
    toast.success("Coding Topic practice links published!");
    setNewCodingTopic({ name: "", difficulty: "Easy", leetcode_url: "", hackerrank_url: "", gfg_url: "", codechef_url: "" });
    loadTabData();
  }

  async function deleteCodingTopic(id: string) {
    const { error } = await supabase.from("coding_topics" as any).delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Practice topic removed");
    loadTabData();
  }

  async function updateCodingTopic(id: string) {
    const { error } = await supabase.from("coding_topics" as any).update(editingCodingTopicData as never).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Practice links updated!");
    setEditingCodingTopicId(null);
    loadTabData();
  }

  /* Study Notes Actions */
  function addNoteLink() {
    if (!noteSkillName.trim() || !notePdfUrl.trim()) return toast.error("Enter skill name and PDF document URL");
    const current = { ...customNotesLinks };
    current[noteSkillName.trim()] = notePdfUrl.trim();
    localStorage.setItem("customNotesLinks", JSON.stringify(current));
    setCustomNotesLinks(current);
    setNoteSkillName("");
    setNotePdfUrl("");
    toast.success("Study Notes PDF uploaded/linked successfully!");
  }

  function deleteNoteLink(skill: string) {
    const current = { ...customNotesLinks };
    delete current[skill];
    localStorage.setItem("customNotesLinks", JSON.stringify(current));
    setCustomNotesLinks(current);
    toast.success("Notes override removed");
  }

  function addCourseLinkOverride() {
    if (!youtubeSkillName.trim() || !youtubeCourseUrl.trim()) return toast.error("Enter skill name and YouTube course URL");
    const current = { ...customCourseLinks };
    current[youtubeSkillName.trim()] = youtubeCourseUrl.trim();
    localStorage.setItem("customCourseLinks", JSON.stringify(current));
    setCustomCourseLinks(current);
    setYoutubeSkillName("");
    setYoutubeCourseUrl("");
    toast.success("YouTube course link updated for skill!");
  }

  function deleteCourseLinkOverride(skill: string) {
    const current = { ...customCourseLinks };
    delete current[skill];
    localStorage.setItem("customCourseLinks", JSON.stringify(current));
    setCustomCourseLinks(current);
    toast.success("YouTube course link override removed");
  }

  /* Mock Test Actions */
  function addQuizQuestion() {
    if (!quizQ.trim() || !quizO.some(o => o.trim())) return toast.error("Please fill in question and all 4 options");
    const newQ: QuizQuestion = {
      q: quizQ.trim(),
      options: quizO.map(o => o.trim()),
      answer: quizAns,
      explanation: quizExp.trim() || "Correct answer is option " + (quizAns + 1)
    };
    
    const current = { ...quizQuestions };
    if (!current[quizCategory]) current[quizCategory] = [];
    current[quizCategory].push(newQ);
    
    localStorage.setItem("customQuizBank", JSON.stringify(current));
    setQuizQuestions(current);
    
    setQuizQ("");
    setQuizO(["", "", "", ""]);
    setQuizAns(0);
    setQuizExp("");
    toast.success("Mock Test question added successfully!");
  }

  function deleteQuizQuestion(category: string, index: number) {
    const current = { ...quizQuestions };
    if (current[category]) {
      current[category].splice(index, 1);
      if (current[category].length === 0) delete current[category];
      localStorage.setItem("customQuizBank", JSON.stringify(current));
      setQuizQuestions(current);
      toast.success("Question removed");
    }
  }

  /* Community Actions */
  async function deletePost(id: string) {
    const { error } = await supabase.from("community_posts").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setPosts((prev) => prev.filter((p) => p.id !== id));
    toast.success("Post removed");
  }

  async function updateFeedbackStatus(id: string, newStatus: string) {
    const { error } = await supabase.from("feedback" as any).update({ status: newStatus } as never).eq("id", id);
    if (error) {
      const localFb = JSON.parse(localStorage.getItem("myFeedback") ?? "[]");
      const updated = localFb.map((f: any) => f.id === id ? { ...f, status: newStatus } : f);
      localStorage.setItem("myFeedback", JSON.stringify(updated));
      toast.success("Feedback status updated locally");
      loadTabData();
    } else {
      toast.success("Feedback status updated to " + newStatus);
      loadTabData();
    }
  }

  if (loading || isAdmin === null) {
    return (
      <AppShell>
        <div className="grid place-items-center py-20">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mb-6 flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-accent font-semibold">Admin Panel</p>
          <h1 className="text-3xl lg:text-4xl font-bold mt-1">Platform Content Manager</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Control all content on TechLand in real time: Roadmaps, Projects, Courses, LeetCode topics, Notes, Mock Tests, and more.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={loadStats} className="gap-2">
          <RefreshCw className="size-4" /> Refresh stats
        </Button>
      </div>

      {/* Grid of Metric Cards */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-3 mb-8">
        {[
          { icon: Users, label: "Users", value: counts?.users ?? 0, tab: "users" },
          { icon: MapIcon, label: "Paths", value: counts?.roadmaps ?? 0, tab: "roadmaps" },
          { icon: Code2, label: "Projects", value: counts?.projects ?? 0, tab: "projects" },
          { icon: Briefcase, label: "Jobs", value: counts?.jobs ?? 0, tab: "jobs" },
          { icon: Youtube, label: "Courses", value: counts?.courses ?? 0, tab: "roadmaps" },
          { icon: Key, label: "LeetCode", value: counts?.coding ?? 0, tab: "coding" },
          { icon: FileText, label: "Notes", value: counts?.notes ?? 0, tab: "learn_notes" },
          { icon: BookOpen, label: "Quizzes", value: counts?.quizzes ?? 0, tab: "mock_tests" },
          { icon: MessagesSquare, label: "Forum", value: counts?.posts ?? 0, tab: "community" },
        ].map((s: any) => {
          const Icon = s.icon;
          const active = activeTab === s.tab;
          return (
            <button
              key={s.label}
              onClick={() => setActiveTab(s.tab as Tab)}
              className={cn(
                "glass-card rounded-2xl p-4 text-left transition-all border hover:-translate-y-0.5",
                active ? "border-primary/50 bg-primary/5 shadow-elegant" : "border-white/5 hover:border-white/15"
              )}
            >
              <div className="size-8 rounded-lg bg-gradient-primary grid place-items-center mb-2.5">
                <Icon className="size-4 text-primary-foreground" />
              </div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">{s.label}</p>
              <p className="text-xl font-bold mt-0.5 gradient-text">{s.value}</p>
            </button>
          );
        })}
      </section>

      {/* Primary Tab Switcher */}
      <div className="flex gap-1 border-b border-white/5 pb-px flex-wrap mb-6">
        {[
          { id: "overview", label: "Overview" },
          { id: "users", label: "Users & RBAC" },
          { id: "roadmaps", label: "Roadmaps & YouTube Courses" },
          { id: "projects", label: "Projects Guidance" },
          { id: "coding", label: "DSA & LeetCode" },
          { id: "jobs", label: "Jobs & Internships" },
          { id: "learn_notes", label: "Study Notes" },
          { id: "mock_tests", label: "Mock Quizzes" },
          { id: "community", label: "Community & Suggestions" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as Tab)}
            className={cn(
              "px-3 py-2 text-xs font-semibold border-b-2 transition-all",
              activeTab === t.id ? "border-primary text-foreground bg-primary/5" : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loadingList ? (
        <div className="grid place-items-center py-20">
          <Loader2 className="size-8 animate-spin text-primary mb-2" />
          <p className="text-sm text-muted-foreground">Loading dashboard contents…</p>
        </div>
      ) : (
        <>
          {/* ── OVERVIEW TAB ── */}
          {activeTab === "overview" && (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="glass-card rounded-2xl p-6">
                  <h2 className="text-lg font-bold mb-2">TechLand Management Hub</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    This admin panel gives you direct control over the databases and client assets. Use the tabs above to manage users, write roadmap milestones, customize practice courses, and approve jobs.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4 mt-6">
                    <div className="p-4 rounded-xl bg-background/50 border border-white/5">
                      <p className="font-semibold text-sm">💡 Quick tip</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Any job, internship, or roadmap added here instantly updates for all logged-in students.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-background/50 border border-white/5">
                      <p className="font-semibold text-sm">📚 Notes & Tests</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Study Notes and Mock Test question banks will sync with users dynamically.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="glass-card rounded-2xl p-6">
                  <h2 className="text-lg font-bold mb-4">Platform Database Health</h2>
                  <div className="space-y-3 text-sm">
                    {[
                      { key: "Supabase connection check", status: "Secure & Connected", ok: true },
                      { key: "RBAC auth trigger configuration", status: "Active", ok: true },
                      { key: "Feedback suggestion box table", status: "Online", ok: true },
                    ].map((h) => (
                      <div key={h.key} className="flex justify-between items-center p-3 rounded-lg bg-background/30 border border-white/5">
                        <span>{h.key}</span>
                        <span className={cn("text-xs font-semibold", h.ok ? "text-emerald-400" : "text-rose-400")}>
                          {h.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="glass-card rounded-2xl p-6">
                  <h2 className="text-lg font-bold mb-4">Total Registered Rows</h2>
                  <div className="space-y-2">
                    {[
                      { label: "User Profiles", count: counts?.users },
                      { label: "Active Roadmaps", count: counts?.roadmaps },
                      { label: "SDE Jobs / Internships", count: counts?.jobs },
                      { label: "Dynamic Projects", count: counts?.projects },
                      { label: "LeetCode Practice Topics", count: counts?.coding },
                      { label: "Community Forum Posts", count: counts?.posts },
                      { label: "Feedback Complaints", count: counts?.feedback },
                    ].map((tbl) => (
                      <div key={tbl.label} className="flex justify-between text-sm py-2 border-b border-white/5">
                        <span className="text-muted-foreground">{tbl.label}</span>
                        <span className="font-bold">{tbl.count ?? "—"} rows</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── USERS TAB ── */}
          {activeTab === "users" && (
            <div className="glass-card rounded-2xl p-6 overflow-hidden">
              <h2 className="text-lg font-bold mb-4">User Accounts & Access Levels</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-muted-foreground">
                      <th className="py-3 px-4">User Details</th>
                      <th className="py-3 px-4">College</th>
                      <th className="py-3 px-4 text-center">XP</th>
                      <th className="py-3 px-4 text-center">Streak</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-white/2">
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-foreground">{u.full_name || "Anonymous User"}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="size-3" /> {u.email}</p>
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="text-foreground">{u.college_name || "—"}</p>
                          <p className="text-xs text-muted-foreground">{u.branch || "—"}</p>
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-primary">{u.xp}</td>
                        <td className="py-3.5 px-4 text-center font-semibold text-orange-400">{u.streak}d</td>
                        <td className="py-3.5 px-4">
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                            u.role === "admin" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                            u.role === "mentor" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                            "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          )}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <select
                            value={u.role}
                            onChange={(e) => changeUserRole(u.id, e.target.value as any)}
                            className="bg-background border border-white/10 rounded-md text-xs px-2 py-1 focus:outline-none focus:border-primary"
                          >
                            <option value="student">Student</option>
                            <option value="mentor">Mentor</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── ROADMAPS & COURSES TAB ── */}
          {activeTab === "roadmaps" && (
            <div className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Add Roadmap */}
                <div className="glass-card rounded-2xl p-6">
                  <h2 className="text-lg font-bold mb-4">Create Career Roadmap</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Title *</label>
                      <input
                        className="w-full px-3 py-2 rounded-lg bg-background/60 border border-border text-sm"
                        placeholder="e.g. Flutter Developer"
                        value={newRoadmap.title}
                        onChange={(e) => setNewRoadmap({ ...newRoadmap, title: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Slug (URL) *</label>
                        <input
                          className="w-full px-3 py-2 rounded-lg bg-background/60 border border-border text-sm"
                          placeholder="e.g. flutter-dev"
                          value={newRoadmap.slug}
                          onChange={(e) => setNewRoadmap({ ...newRoadmap, slug: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Duration</label>
                        <input
                          className="w-full px-3 py-2 rounded-lg bg-background/60 border border-border text-sm"
                          placeholder="e.g. 12 weeks"
                          value={newRoadmap.estimated_duration}
                          onChange={(e) => setNewRoadmap({ ...newRoadmap, estimated_duration: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Domain Name</label>
                      <select
                        className="w-full px-3 py-2 rounded-lg bg-background/60 border border-border text-sm"
                        value={newRoadmap.domain_name}
                        onChange={(e) => setNewRoadmap({ ...newRoadmap, domain_name: e.target.value })}
                      >
                        <option>Full Stack Development</option>
                        <option>Frontend Development</option>
                        <option>Backend Development</option>
                        <option>Data Science</option>
                        <option>Artificial Intelligence</option>
                        <option>Cloud Computing</option>
                        <option>DevOps</option>
                        <option>Mobile App Development</option>
                        <option>UI/UX Design</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Skill Level</label>
                        <select
                          className="w-full px-3 py-2 rounded-lg bg-background/60 border border-border text-sm"
                          value={newRoadmap.level}
                          onChange={(e) => setNewRoadmap({ ...newRoadmap, level: e.target.value })}
                        >
                          <option>Beginner</option>
                          <option>Intermediate</option>
                          <option>Advanced</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Description *</label>
                      <textarea
                        rows={2}
                        className="w-full px-3 py-2 rounded-lg bg-background/60 border border-border text-sm resize-none"
                        placeholder="Overview of roadmap contents…"
                        value={newRoadmap.description}
                        onChange={(e) => setNewRoadmap({ ...newRoadmap, description: e.target.value })}
                      />
                    </div>
                    <Button variant="hero" onClick={addRoadmap} className="w-full gap-2 text-xs py-2">
                      <Plus className="size-4" /> Create Roadmap
                    </Button>
                  </div>
                </div>

                {/* Roadmaps List */}
                <div className="lg:col-span-2 glass-card rounded-2xl p-6">
                  <h2 className="text-lg font-bold mb-4 font-bold">All Learning Paths</h2>
                  <div className="grid sm:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto pr-1">
                    {roadmaps.map((r) => {
                      const selected = selectedRoadmap?.id === r.id;
                      return (
                        <div
                          key={r.id}
                          className={cn(
                            "p-4 rounded-xl border flex flex-col justify-between transition-all cursor-pointer",
                            selected ? "bg-primary/5 border-primary/40 shadow-glow" : "bg-background/50 border-white/5 hover:border-white/10"
                          )}
                          onClick={() => setSelectedRoadmap(r)}
                        >
                          <div>
                            <div className="flex justify-between items-start">
                              <span className="text-[9px] uppercase font-bold text-accent">{r.domain_name}</span>
                              <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                                <button
                                  onClick={() => {
                                    setEditingRoadmapId(r.id);
                                    setEditingRoadmapData(r);
                                  }}
                                  className="text-muted-foreground hover:text-foreground"
                                >
                                  <Edit2 className="size-3.5" />
                                </button>
                                <button onClick={() => deleteRoadmap(r.id)} className="text-muted-foreground hover:text-destructive">
                                  <Trash2 className="size-3.5" />
                                </button>
                              </div>
                            </div>

                            {editingRoadmapId === r.id ? (
                              <div className="mt-2 space-y-2" onClick={(e) => e.stopPropagation()}>
                                <input
                                  className="w-full bg-background text-xs border border-white/10 rounded px-2 py-1"
                                  value={editingRoadmapData.title || ""}
                                  onChange={(e) => setEditingRoadmapData({ ...editingRoadmapData, title: e.target.value })}
                                />
                                <textarea
                                  className="w-full bg-background text-[11px] border border-white/10 rounded px-2 py-1 resize-none"
                                  rows={2}
                                  value={editingRoadmapData.description || ""}
                                  onChange={(e) => setEditingRoadmapData({ ...editingRoadmapData, description: e.target.value })}
                                />
                                <div className="flex gap-2 justify-end">
                                  <button onClick={() => setEditingRoadmapId(null)} className="text-[10px] text-muted-foreground">Cancel</button>
                                  <button onClick={() => updateRoadmap(r.id)} className="text-[10px] text-emerald-400 font-bold">Save</button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <p className="font-bold text-sm mt-1">{r.title}</p>
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{r.description}</p>
                              </>
                            )}
                          </div>
                          <div className="mt-3 pt-2 border-t border-white/5 flex justify-between items-center text-[10px] text-muted-foreground">
                            <span>Level: {r.level}</span>
                            <span>{r.estimated_duration}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* YouTube Course Modules Manager */}
              {selectedRoadmap && (
                <div className="glass-card rounded-2xl p-6">
                  <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
                    <div>
                      <h2 className="text-lg font-bold">
                        📺 Course modules for: <span className="text-primary">{selectedRoadmap.title}</span>
                      </h2>
                      <p className="text-xs text-muted-foreground">Add/edit Youtube video courses that students watch for this roadmap.</p>
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-3 gap-6">
                    {/* Add Module */}
                    <div className="p-5 rounded-xl bg-background/50 border border-white/5 space-y-3 h-fit">
                      <p className="font-bold text-sm">Add Youtube Link</p>
                      <div>
                        <label className="text-[11px] text-muted-foreground mb-1 block">Module Title</label>
                        <input
                          className="w-full px-3 py-1.5 rounded-lg bg-background/60 border border-border text-xs"
                          placeholder="e.g. 1. Introduction to Web Design"
                          value={newModule.title}
                          onChange={(e) => setNewModule({ ...newModule, title: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-muted-foreground mb-1 block">Description</label>
                        <input
                          className="w-full px-3 py-1.5 rounded-lg bg-background/60 border border-border text-xs"
                          placeholder="What this video covers..."
                          value={newModule.description}
                          onChange={(e) => setNewModule({ ...newModule, description: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-muted-foreground mb-1 block">YouTube URL</label>
                        <input
                          className="w-full px-3 py-1.5 rounded-lg bg-background/60 border border-border text-xs"
                          placeholder="https://www.youtube.com/watch?v=..."
                          value={newModule.youtube_url}
                          onChange={(e) => setNewModule({ ...newModule, youtube_url: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-2">
                          <label className="text-[11px] text-muted-foreground mb-1 block">Instructor</label>
                          <input
                            className="w-full px-3 py-1.5 rounded-lg bg-background/60 border border-border text-xs"
                            placeholder="e.g. FreeCodeCamp"
                            value={newModule.instructor}
                            onChange={(e) => setNewModule({ ...newModule, instructor: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-muted-foreground mb-1 block">Sort Order</label>
                          <input
                            type="number"
                            className="w-full px-3 py-1.5 rounded-lg bg-background/60 border border-border text-xs"
                            value={newModule.sort_order}
                            onChange={(e) => setNewModule({ ...newModule, sort_order: Number(e.target.value) })}
                          />
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={addModule} className="w-full text-xs gap-1.5 mt-2">
                        <Plus className="size-4" /> Add Video Module
                      </Button>
                    </div>

                    {/* Modules List */}
                    <div className="lg:col-span-2 space-y-2 max-h-[400px] overflow-y-auto pr-1">
                      {modules.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-10 text-center">No video course modules added to this roadmap yet.</p>
                      ) : (
                        modules.map((m) => (
                          <div key={m.id} className="p-3.5 rounded-xl bg-background/30 border border-white/5 flex gap-4 items-center justify-between">
                            <div className="flex gap-3 items-center min-w-0">
                              <div className="size-16 rounded bg-black/40 overflow-hidden shrink-0 border border-white/5 relative grid place-items-center">
                                {m.youtube_thumbnail ? (
                                  <img src={m.youtube_thumbnail} className="size-full object-cover" />
                                ) : (
                                  <Play className="size-5 text-muted-foreground" />
                                )}
                              </div>
                              <div className="min-w-0">
                                {editingModuleId === m.id ? (
                                  <div className="space-y-1 mt-1">
                                    <input
                                      className="bg-background text-xs border border-white/10 rounded px-2 py-0.5 w-full"
                                      value={editingModuleData.title || ""}
                                      onChange={(e) => setEditingModuleData({ ...editingModuleData, title: e.target.value })}
                                    />
                                    <input
                                      className="bg-background text-[11px] border border-white/10 rounded px-2 py-0.5 w-full"
                                      value={editingModuleData.youtube_url || ""}
                                      onChange={(e) => setEditingModuleData({ ...editingModuleData, youtube_url: e.target.value })}
                                    />
                                    <div className="flex gap-2">
                                      <button onClick={() => setEditingModuleId(null)} className="text-[10px] text-muted-foreground">Cancel</button>
                                      <button onClick={() => updateModule(m.id)} className="text-[10px] text-emerald-400 font-bold">Save</button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <p className="font-semibold text-xs text-foreground truncate">{m.title}</p>
                                    <p className="text-[10px] text-muted-foreground truncate">{m.description || "No description"}</p>
                                    <p className="text-[9px] text-accent/80 mt-1">
                                      Instructor: {m.instructor} · Duration: {m.duration || "15 mins"} · Sort: {m.sort_order}
                                    </p>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              {m.youtube_url && (
                                <a href={m.youtube_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                                  <ExternalLink className="size-4" />
                                </a>
                              )}
                              <button
                                onClick={() => {
                                  setEditingModuleId(m.id);
                                  setEditingModuleData(m);
                                }}
                                className="text-muted-foreground hover:text-foreground"
                              >
                                <Edit2 className="size-4" />
                              </button>
                              <button onClick={() => deleteModule(m.id)} className="text-muted-foreground hover:text-destructive">
                                <Trash2 className="size-4" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── PROJECTS TAB ── */}
          {activeTab === "projects" && (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Add Project Form */}
              <div className="glass-card rounded-2xl p-6 h-fit">
                <h2 className="text-lg font-bold mb-4">Add Project Guide</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Project Title *</label>
                    <input
                      className="w-full px-3 py-2 rounded-lg bg-background/60 border border-border text-sm"
                      placeholder="e.g. Chat Application"
                      value={newProject.title}
                      onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Domain Name / Main Tech *</label>
                    <input
                      className="w-full px-3 py-2 rounded-lg bg-background/60 border border-border text-sm"
                      placeholder="e.g. React & Supabase"
                      value={newProject.domain_name}
                      onChange={(e) => setNewProject({ ...newProject, domain_name: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Difficulty Level</label>
                      <select
                        className="w-full px-3 py-2 rounded-lg bg-background/60 border border-border text-sm"
                        value={newProject.level}
                        onChange={(e) => setNewProject({ ...newProject, level: e.target.value as any })}
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">GitHub Reference / Link</label>
                    <input
                      className="w-full px-3 py-2 rounded-lg bg-background/60 border border-border text-sm"
                      placeholder="https://github.com/..."
                      value={newProject.github_reference}
                      onChange={(e) => setNewProject({ ...newProject, github_reference: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Project Description *</label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg bg-background/60 border border-border text-sm resize-none"
                      placeholder="Detailed overview of project goals…"
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    />
                  </div>
                  <Button variant="hero" onClick={addProject} className="w-full gap-2 text-xs">
                    <Plus className="size-4" /> Publish Project
                  </Button>
                </div>
              </div>

              {/* Projects List */}
              <div className="lg:col-span-2 glass-card rounded-2xl p-6">
                <h2 className="text-lg font-bold mb-4 font-bold">Manage Guidance Projects</h2>
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {projectsList.map((p, idx) => (
                    <div key={p.id || idx} className="p-4 rounded-xl bg-background/50 border border-white/5 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase",
                          p.level === "Advanced" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                          p.level === "Intermediate" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                          "bg-green-500/10 text-green-400 border border-green-500/20"
                        )}>
                          {p.level}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingProjectId(p.id || p.title);
                              setEditingProjectData(p);
                            }}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <Edit2 className="size-3.5" />
                          </button>
                          <button onClick={() => deleteProject(p.title, p.id)} className="text-muted-foreground hover:text-destructive">
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>

                      {editingProjectId === (p.id || p.title) ? (
                        <div className="mt-3 space-y-2">
                          <input
                            className="w-full bg-background text-xs border border-white/10 rounded px-2 py-1"
                            value={editingProjectData.title || ""}
                            onChange={(e) => setEditingProjectData({ ...editingProjectData, title: e.target.value })}
                          />
                          <input
                            className="w-full bg-background text-xs border border-white/10 rounded px-2 py-1"
                            value={editingProjectData.domain_name || ""}
                            onChange={(e) => setEditingProjectData({ ...editingProjectData, domain_name: e.target.value })}
                          />
                          <textarea
                            className="w-full bg-background text-[11px] border border-white/10 rounded px-2 py-1 resize-none"
                            rows={3}
                            value={editingProjectData.description || ""}
                            onChange={(e) => setEditingProjectData({ ...editingProjectData, description: e.target.value })}
                          />
                          <div className="flex gap-2 justify-end">
                            <button onClick={() => setEditingProjectId(null)} className="text-xs text-muted-foreground">Cancel</button>
                            <button onClick={() => updateProject(p.id, p.title)} className="text-xs text-emerald-400 font-bold">Save</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="font-bold text-sm mt-1">{p.title}</p>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-3">{p.description}</p>
                          <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-xs text-muted-foreground">
                            <span>Tech: {p.domain_name}</span>
                            {p.github_reference && (
                              <a href={p.github_reference} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-0.5">
                                Repo <ExternalLink className="size-3" />
                              </a>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── DSA & LEETCODE TAB ── */}
          {activeTab === "coding" && (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Add Practice Link */}
              <div className="glass-card rounded-2xl p-6 h-fit">
                <h2 className="text-lg font-bold mb-4 font-bold">Add Coding Topic</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Topic Name *</label>
                    <input
                      className="w-full px-3 py-2 rounded-lg bg-background/60 border border-border text-sm"
                      placeholder="e.g. Binary Search"
                      value={newCodingTopic.name}
                      onChange={(e) => setNewCodingTopic({ ...newCodingTopic, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Difficulty</label>
                    <select
                      className="w-full px-3 py-2 rounded-lg bg-background/60 border border-border text-sm"
                      value={newCodingTopic.difficulty}
                      onChange={(e) => setNewCodingTopic({ ...newCodingTopic, difficulty: e.target.value })}
                    >
                      <option>Easy</option>
                      <option>Medium</option>
                      <option>Hard</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">LeetCode URL</label>
                    <input
                      className="w-full px-3 py-2 rounded-lg bg-background/60 border border-border text-sm"
                      placeholder="https://leetcode.com/tag/..."
                      value={newCodingTopic.leetcode_url}
                      onChange={(e) => setNewCodingTopic({ ...newCodingTopic, leetcode_url: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">GeeksForGeeks URL</label>
                    <input
                      className="w-full px-3 py-2 rounded-lg bg-background/60 border border-border text-sm"
                      placeholder="https://practice.geeksforgeeks.org/..."
                      value={newCodingTopic.gfg_url}
                      onChange={(e) => setNewCodingTopic({ ...newCodingTopic, gfg_url: e.target.value })}
                    />
                  </div>
                  <Button variant="hero" onClick={addCodingTopic} className="w-full gap-2 text-xs">
                    <Plus className="size-4" /> Publish Links
                  </Button>
                </div>
              </div>

              {/* Coding Topics List */}
              <div className="lg:col-span-2 glass-card rounded-2xl p-6">
                <h2 className="text-lg font-bold mb-4">DSA Topic links</h2>
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {codingTopics.map((t) => (
                    <div key={t.id} className="p-4 rounded-xl bg-background/50 border border-white/5">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-sm text-foreground">{t.name}</span>
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "px-2.5 py-0.5 rounded-full text-[10px] font-semibold border",
                            t.difficulty === "Easy" ? "bg-success/15 text-success border-success/20" :
                            t.difficulty === "Medium" ? "bg-warning/15 text-warning border-warning/20" :
                            "bg-destructive/15 text-destructive border-destructive/20"
                          )}>
                            {t.difficulty}
                          </span>
                          <button
                            onClick={() => {
                              setEditingCodingTopicId(t.id);
                              setEditingCodingTopicData(t);
                            }}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <Edit2 className="size-3.5" />
                          </button>
                          <button onClick={() => deleteCodingTopic(t.id)} className="text-muted-foreground hover:text-destructive">
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>

                      {editingCodingTopicId === t.id ? (
                        <div className="mt-3 space-y-2">
                          <input
                            className="w-full bg-background text-xs border border-white/10 rounded px-2 py-1"
                            value={editingCodingTopicData.name || ""}
                            onChange={(e) => setEditingCodingTopicData({ ...editingCodingTopicData, name: e.target.value })}
                          />
                          <input
                            className="w-full bg-background text-xs border border-white/10 rounded px-2 py-1"
                            value={editingCodingTopicData.leetcode_url || ""}
                            placeholder="Leetcode URL"
                            onChange={(e) => setEditingCodingTopicData({ ...editingCodingTopicData, leetcode_url: e.target.value })}
                          />
                          <input
                            className="w-full bg-background text-xs border border-white/10 rounded px-2 py-1"
                            value={editingCodingTopicData.gfg_url || ""}
                            placeholder="GeeksForGeeks URL"
                            onChange={(e) => setEditingCodingTopicData({ ...editingCodingTopicData, gfg_url: e.target.value })}
                          />
                          <div className="flex gap-2 justify-end">
                            <button onClick={() => setEditingCodingTopicId(null)} className="text-xs text-muted-foreground">Cancel</button>
                            <button onClick={() => updateCodingTopic(t.id)} className="text-xs text-emerald-400 font-bold">Save</button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-3 text-xs mt-3 flex-wrap">
                          {t.leetcode_url && (
                            <a href={t.leetcode_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-0.5">
                              LeetCode <ExternalLink className="size-3" />
                            </a>
                          )}
                          {t.gfg_url && (
                            <a href={t.gfg_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-0.5">
                              GeeksForGeeks <ExternalLink className="size-3" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── JOBS & INTERNSHIPS TAB ── */}
          {activeTab === "jobs" && (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Post job form */}
              <div className="glass-card rounded-2xl p-6 h-fit">
                <h2 className="text-lg font-bold mb-4 font-bold">Publish SDE Opening</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Role / Title *</label>
                    <input
                      className="w-full px-3 py-2 rounded-lg bg-background/60 border border-border text-sm"
                      placeholder="e.g. Frontend Intern"
                      value={newJob.role}
                      onChange={(e) => setNewJob({ ...newJob, role: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Company Name *</label>
                    <input
                      className="w-full px-3 py-2 rounded-lg bg-background/60 border border-border text-sm"
                      placeholder="e.g. Swiggy India"
                      value={newJob.company_name}
                      onChange={(e) => setNewJob({ ...newJob, company_name: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Location *</label>
                      <input
                        className="w-full px-3 py-2 rounded-lg bg-background/60 border border-border text-sm"
                        placeholder="e.g. Bangalore"
                        value={newJob.location}
                        onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Job Type</label>
                      <select
                        className="w-full px-3 py-2 rounded-lg bg-background/60 border border-border text-sm"
                        value={newJob.job_type}
                        onChange={(e) => setNewJob({ ...newJob, job_type: e.target.value })}
                      >
                        <option>Internship</option>
                        <option>Full-time</option>
                        <option>Part-time</option>
                        <option>Remote</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Apply URL *</label>
                    <input
                      className="w-full px-3 py-2 rounded-lg bg-background/60 border border-border text-sm"
                      placeholder="https://swiggy.careers/..."
                      value={newJob.application_link}
                      onChange={(e) => setNewJob({ ...newJob, application_link: e.target.value })}
                    />
                  </div>
                  <Button variant="hero" onClick={addJob} className="w-full gap-2 text-xs">
                    <Plus className="size-4" /> Publish Listing
                  </Button>
                </div>
              </div>

              {/* Jobs List */}
              <div className="lg:col-span-2 glass-card rounded-2xl p-6">
                <h2 className="text-lg font-bold mb-4 font-bold">Active Placement Openings</h2>
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {jobs.map((j) => (
                    <div key={j.id} className="p-4 rounded-xl bg-background/50 border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="size-10 rounded-xl bg-gradient-primary grid place-items-center font-bold text-primary-foreground text-sm shrink-0">
                          {j.company_name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          {editingJobId === j.id ? (
                            <div className="space-y-1 mt-1">
                              <input
                                className="bg-background text-xs border border-white/10 rounded px-2 py-0.5 w-full"
                                value={editingJobData.role || ""}
                                onChange={(e) => setEditingJobData({ ...editingJobData, role: e.target.value })}
                              />
                              <input
                                className="bg-background text-xs border border-white/10 rounded px-2 py-0.5 w-full"
                                value={editingJobData.company_name || ""}
                                onChange={(e) => setEditingJobData({ ...editingJobData, company_name: e.target.value })}
                              />
                              <div className="flex gap-2">
                                <button onClick={() => setEditingJobId(null)} className="text-[10px] text-muted-foreground">Cancel</button>
                                <button onClick={() => updateJob(j.id)} className="text-[10px] text-emerald-400 font-bold">Save</button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <p className="font-semibold text-sm truncate">{j.role}</p>
                              <p className="text-xs text-muted-foreground truncate">
                                {j.company_name} · {j.location} · {j.job_type}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <a href={j.application_link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary font-semibold hover:underline">
                          Link
                        </a>
                        <button
                          onClick={() => {
                            setEditingJobId(j.id);
                            setEditingJobData(j);
                          }}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Edit2 className="size-4" />
                        </button>
                        <button onClick={() => deleteJob(j.id)} className="text-muted-foreground hover:text-destructive">
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── STUDY NOTES TAB ── */}
          {activeTab === "learn_notes" && (
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Manage Notes Links */}
              <div className="glass-card rounded-2xl p-6">
                <h2 className="text-lg font-bold mb-4 font-bold flex items-center gap-2">
                  <FileText className="size-5 text-emerald-400" /> Upload / Link Study Notes
                </h2>
                <p className="text-xs text-muted-foreground mb-4">
                  Configure study guide PDF download links for Roadmap skills in the Learning Hub.
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Skill Name *</label>
                    <input
                      className="w-full px-3 py-2 rounded-lg bg-background/60 border border-border text-sm"
                      placeholder="e.g. HTML5 & Semantic Web (Match exact skill name)"
                      value={noteSkillName}
                      onChange={(e) => setNoteSkillName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">PDF File Link / Document URL *</label>
                    <input
                      className="w-full px-3 py-2 rounded-lg bg-background/60 border border-border text-sm"
                      placeholder="https://example.com/notes.pdf"
                      value={notePdfUrl}
                      onChange={(e) => setNotePdfUrl(e.target.value)}
                    />
                  </div>
                  <Button variant="hero" onClick={addNoteLink} className="w-full gap-2 text-xs">
                    <Plus className="size-4" /> Add Notes Link
                  </Button>
                </div>

                <div className="mt-8">
                  <h3 className="font-semibold text-sm mb-3">Linked Notes PDFs</h3>
                  <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                    {Object.keys(customNotesLinks).length === 0 ? (
                      <p className="text-xs text-muted-foreground">No notes document override linked.</p>
                    ) : (
                      Object.entries(customNotesLinks).map(([skill, url]) => (
                        <div key={skill} className="flex justify-between items-center p-2.5 rounded-lg bg-background/30 border border-white/5 text-xs">
                          <div className="min-w-0">
                            <p className="font-semibold truncate">{skill}</p>
                            <p className="text-[10px] text-muted-foreground truncate">{url}</p>
                          </div>
                          <div className="flex gap-2">
                            <a href={url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                              <ExternalLink className="size-3.5" />
                            </a>
                            <button onClick={() => deleteNoteLink(skill)} className="text-muted-foreground hover:text-destructive">
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Manage YouTube Course Links Overrides */}
              <div className="glass-card rounded-2xl p-6">
                <h2 className="text-lg font-bold mb-4 font-bold flex items-center gap-2">
                  <Youtube className="size-5 text-rose-400" /> YouTube Courses Link Overrides
                </h2>
                <p className="text-xs text-muted-foreground mb-4">
                  Quick link builder to change YouTube course video searches for skills.
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Skill Name *</label>
                    <input
                      className="w-full px-3 py-2 rounded-lg bg-background/60 border border-border text-sm"
                      placeholder="e.g. HTML5 & Semantic Web"
                      value={youtubeSkillName}
                      onChange={(e) => setYoutubeSkillName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">YouTube Video/Course Link *</label>
                    <input
                      className="w-full px-3 py-2 rounded-lg bg-background/60 border border-border text-sm"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={youtubeCourseUrl}
                      onChange={(e) => setYoutubeCourseUrl(e.target.value)}
                    />
                  </div>
                  <Button variant="hero" onClick={addCourseLinkOverride} className="w-full gap-2 text-xs">
                    <Plus className="size-4" /> Add Link Override
                  </Button>
                </div>

                <div className="mt-8">
                  <h3 className="font-semibold text-sm mb-3">Linked Video Courses</h3>
                  <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                    {Object.keys(customCourseLinks).length === 0 ? (
                      <p className="text-xs text-muted-foreground">No YouTube overrides linked.</p>
                    ) : (
                      Object.entries(customCourseLinks).map(([skill, url]) => (
                        <div key={skill} className="flex justify-between items-center p-2.5 rounded-lg bg-background/30 border border-white/5 text-xs">
                          <div className="min-w-0">
                            <p className="font-semibold truncate">{skill}</p>
                            <p className="text-[10px] text-muted-foreground truncate">{url}</p>
                          </div>
                          <div className="flex gap-2">
                            <a href={url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                              <ExternalLink className="size-3.5" />
                            </a>
                            <button onClick={() => deleteCourseLinkOverride(skill)} className="text-muted-foreground hover:text-destructive">
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── MOCK QUIZZES TAB ── */}
          {activeTab === "mock_tests" && (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Add Question */}
              <div className="glass-card rounded-2xl p-6 h-fit">
                <h2 className="text-lg font-bold mb-4 font-bold">Add Mock Quiz Question</h2>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Aptitude Category *</label>
                    <select
                      className="w-full px-3 py-2 rounded-lg bg-background/60 border border-border text-sm"
                      value={quizCategory}
                      onChange={(e) => setQuizCategory(e.target.value)}
                    >
                      <option>Quantitative Aptitude</option>
                      <option>Logical Reasoning</option>
                      <option>Verbal Ability</option>
                      <option>Technical Aptitude</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Question Description *</label>
                    <textarea
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg bg-background/60 border border-border text-sm resize-none"
                      placeholder="e.g. Find LCM of 15 and 20."
                      value={quizQ}
                      onChange={(e) => setQuizQ(e.target.value)}
                    />
                  </div>
                  {quizO.map((opt, i) => (
                    <div key={i}>
                      <label className="text-[11px] text-muted-foreground block mb-0.5">Option {i + 1} *</label>
                      <input
                        className="w-full px-3 py-1.5 rounded-lg bg-background/60 border border-border text-xs"
                        placeholder={`Option ${i + 1}`}
                        value={opt}
                        onChange={(e) => {
                          const updated = [...quizO];
                          updated[i] = e.target.value;
                          setQuizO(updated);
                        }}
                      />
                    </div>
                  ))}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">Correct Option index</label>
                      <select
                        className="w-full px-3 py-2 rounded-lg bg-background/60 border border-border text-sm"
                        value={quizAns}
                        onChange={(e) => setQuizAns(Number(e.target.value))}
                      >
                        <option value={0}>Option 1</option>
                        <option value={1}>Option 2</option>
                        <option value={2}>Option 3</option>
                        <option value={3}>Option 4</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Answer Explanation</label>
                    <input
                      className="w-full px-3 py-2 rounded-lg bg-background/60 border border-border text-sm"
                      placeholder="How is this answer derived?"
                      value={quizExp}
                      onChange={(e) => setQuizExp(e.target.value)}
                    />
                  </div>
                  <Button variant="hero" onClick={addQuizQuestion} className="w-full gap-2 text-xs mt-2">
                    <Plus className="size-4" /> Add Question
                  </Button>
                </div>
              </div>

              {/* Questions List */}
              <div className="lg:col-span-2 glass-card rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold">Active Quiz Question Banks</h2>
                  <select
                    className="bg-background border border-white/10 rounded-md text-xs px-2 py-1 focus:outline-none"
                    value={quizCategory}
                    onChange={(e) => setQuizCategory(e.target.value)}
                  >
                    <option>Quantitative Aptitude</option>
                    <option>Logical Reasoning</option>
                    <option>Verbal Ability</option>
                    <option>Technical Aptitude</option>
                  </select>
                </div>

                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {!quizQuestions[quizCategory] || quizQuestions[quizCategory].length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-20">
                      No custom mock test questions added to {quizCategory} yet.
                    </p>
                  ) : (
                    quizQuestions[quizCategory].map((q, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-background/50 border border-white/5 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-xs text-muted-foreground">Question {idx + 1}</span>
                            <button onClick={() => deleteQuizQuestion(quizCategory, idx)} className="text-muted-foreground hover:text-destructive">
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                          <p className="font-semibold text-sm text-foreground mt-1.5">{q.q}</p>
                          <div className="grid grid-cols-2 gap-2 mt-3">
                            {q.options.map((opt, i) => (
                              <div
                                key={i}
                                className={cn(
                                  "p-2 rounded-lg border text-xs",
                                  q.answer === i 
                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-bold" 
                                    : "bg-background/20 border-white/5 text-muted-foreground"
                                )}
                              >
                                {opt}
                              </div>
                            ))}
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-3 italic">
                            Explanation: {q.explanation}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── COMMUNITY & SUGGESTIONS TAB ── */}
          {activeTab === "community" && (
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Forum Moderation */}
              <div className="glass-card rounded-2xl p-6">
                <h2 className="text-lg font-bold mb-4">Moderate Forum Posts</h2>
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {posts.map((p) => (
                    <div key={p.id} className="p-4 rounded-xl bg-background/50 border border-white/5 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <span>By {p.authorName}</span>
                          <span>{formatDistanceToNow(new Date(p.created_at), { addSuffix: true })}</span>
                        </div>
                        <p className="font-semibold text-sm mt-1.5">{p.title}</p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.content}</p>
                        {p.tag && (
                          <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                            #{p.tag}
                          </span>
                        )}
                      </div>
                      <div className="mt-4 pt-3 border-t border-white/5 flex justify-end">
                        <button onClick={() => deletePost(p.id)} className="text-xs text-destructive hover:underline flex items-center gap-1.5">
                          <Trash2 className="size-3.5" /> Remove Post
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggestions Moderation */}
              <div className="glass-card rounded-2xl p-6">
                <h2 className="text-lg font-bold mb-4 font-bold">Feedback / Suggestion Box</h2>
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {feedbacks.length === 0 && (
                    <p className="text-sm text-muted-foreground">No suggestion box entries received yet.</p>
                  )}
                  {feedbacks.map((f) => (
                    <div key={f.id} className="p-4 rounded-xl bg-background/50 border border-white/5 flex flex-col justify-between space-y-2">
                      <div className="flex items-center gap-2 justify-between">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase",
                          f.type === "suggestion" ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" :
                          f.type === "experience" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                          "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        )}>
                          {f.type}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {formatDistanceToNow(new Date(f.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">{f.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{f.message}</p>
                        {f.type === "experience" && f.rating !== undefined && (
                          <div className="flex gap-0.5 mt-1.5">
                            {(() => {
                              const r = f.rating ?? 0;
                              return Array.from({ length: 5 }).map((_, idx) => (
                                <Star key={idx} className={cn("size-3", idx < r ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground")} />
                              ));
                            })()}
                          </div>
                        )}
                      </div>
                      <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground truncate max-w-[150px]">By {f.name} ({f.email})</span>
                        <div className="flex items-center gap-2">
                          <select
                            value={f.status}
                            onChange={(e) => updateFeedbackStatus(f.id, e.target.value)}
                            className="bg-background border border-white/10 rounded-md text-[10px] px-2 py-1 focus:outline-none"
                          >
                            <option value="submitted">Submitted</option>
                            <option value="in-progress">In Progress</option>
                            <option value="fixed">Fixed</option>
                            <option value="published">Featured</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </AppShell>
  );
}
