import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "./roadmaps.index";
import {
  MessageSquare, Users, Hash, Heart, Loader2, Send, Lightbulb,
  AlertCircle, Star, ThumbsUp, Flag, X, CheckCircle2, ChevronDown, ChevronUp,
  BookOpen, Code2, Briefcase, Globe2, Zap, TrendingUp, Plus,
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/community")({ component: Community });

/* ──────── STUDY GROUPS ──── */
const GROUPS = [
  { name: "Full Stack Devs", members: 1240, icon: Code2, color: "from-cyan-500 to-blue-500", tag: "Development" },
  { name: "DSA Daily", members: 2180, icon: Zap, color: "from-violet-500 to-purple-600", tag: "Algorithms" },
  { name: "Off-Campus Drives", members: 3450, icon: Briefcase, color: "from-orange-500 to-rose-500", tag: "Placements" },
  { name: "AI/ML India", members: 980, icon: Globe2, color: "from-emerald-500 to-teal-500", tag: "AI" },
  { name: "System Design", members: 760, icon: TrendingUp, color: "from-blue-500 to-violet-500", tag: "Architecture" },
  { name: "Resume Reviews", members: 1890, icon: BookOpen, color: "from-pink-500 to-rose-500", tag: "Career" },
  { name: "Competitive Prog.", members: 620, icon: Star, color: "from-yellow-500 to-orange-500", tag: "CP" },
  { name: "Open Source", members: 540, icon: Globe2, color: "from-green-500 to-emerald-500", tag: "OSS" },
];

const POST_TAGS = ["Career", "DSA", "Doubt", "Resources", "Placements", "Projects", "Internship", "General"];
const TAG_COLORS: Record<string, string> = {
  Career: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  DSA: "bg-violet-500/15 text-violet-400 border-violet-500/20",
  Doubt: "bg-rose-500/15 text-rose-400 border-rose-500/20",
  Resources: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  Placements: "bg-orange-500/15 text-orange-400 border-orange-500/20",
  Projects: "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
  Internship: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  General: "bg-white/10 text-muted-foreground border-white/10",
};

/* ──────── SUGGESTION BOX ──── */
type FeedbackType = "suggestion" | "experience" | "complaint";
type FeedbackEntry = {
  type: FeedbackType; rating?: number; title: string; message: string;
  name: string; email: string; submittedAt: string; status: "submitted" | "in-progress" | "fixed" | "published";
};

const SEEDED_FEEDBACK: FeedbackEntry[] = [
  {
    type: "suggestion",
    title: "Need Dark Mode toggle on Dashboard",
    message: "A dark theme for the main dashboard would be really helpful for night study sessions. The rest of the app looks great!",
    name: "Aman Gupta",
    email: "aman@vit.edu",
    submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: "in-progress",
  },
  {
    type: "experience",
    rating: 5,
    title: "Cleared Amazon SDE-1 Placement!",
    message: "The AI mock interview was key for me. Practiced daily for 2 weeks. The system design questions were very similar to what Amazon asked in round 1.",
    name: "Sneha Reddy",
    email: "sneha.r@iitd.ac.in",
    submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: "published",
  },
  {
    type: "complaint",
    title: "Mock test options not loading properly",
    message: "Fixed: Before, mock tests options were not properly enabled or active for some streams, but it is now corrected.",
    name: "Rohan V.",
    email: "rohanv@bits.edu",
    submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: "fixed",
  }
];

const FEEDBACK_CONFIG: Record<FeedbackType, { label: string; icon: typeof Lightbulb; color: string; placeholder: string }> = {
  suggestion: { label: "Suggestion", icon: Lightbulb, color: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20", placeholder: "What feature or improvement would you like to see on TechPath Pro?" },
  experience: { label: "Share Experience", icon: Star, color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20", placeholder: "Tell us about your experience using TechPath Pro — what helped you, what you achieved, or your success story!" },
  complaint: { label: "Report Issue", icon: AlertCircle, color: "bg-rose-500/15 text-rose-400 border-rose-500/20", placeholder: "Describe the issue or bug you encountered. Please include the page name and what you were trying to do." },
};

type Post = {
  id: string; title: string; content: string; tag: string | null;
  created_at: string; user_id: string;
  author?: { full_name: string; college_name: string | null } | null;
  likes_count?: number; liked_by_me?: boolean;
};

type Tab = "forum" | "groups" | "feedback";

/* ──────── MAIN COMMUNITY PAGE ──── */
function Community() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("forum");
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [postTag, setPostTag] = useState("General");
  const [busy, setBusy] = useState(false);
  const [tagFilter, setTagFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);

  /* Feedback state */
  const [fbType, setFbType] = useState<FeedbackType>("suggestion");
  const [fbRating, setFbRating] = useState(0);
  const [fbHover, setFbHover] = useState(0);
  const [fbTitle, setFbTitle] = useState("");
  const [fbMessage, setFbMessage] = useState("");
  const [fbName, setFbName] = useState(user?.fullName ?? "");
  const [fbEmail, setFbEmail] = useState(user?.email ?? "");
  const [fbDone, setFbDone] = useState(false);
  const [fbBusy, setFbBusy] = useState(false);

  /* Past feedback */
  const [myFeedback, setMyFeedback] = useState<FeedbackEntry[]>(() => {
    try { return JSON.parse(localStorage.getItem("myFeedback") ?? "[]"); }
    catch { return []; }
  });

  async function loadPosts() {
    const { data: rows } = await supabase
      .from("community_posts")
      .select("id, title, content, tag, created_at, user_id")
      .order("created_at", { ascending: false })
      .limit(80);
    const list: Post[] = rows ?? [];
    const userIds = Array.from(new Set(list.map((p) => p.user_id)));
    const postIds = list.map((p) => p.id);
    const [{ data: profiles }, { data: likes }] = await Promise.all([
      userIds.length ? supabase.from("profiles").select("id, full_name, college_name").in("id", userIds) : Promise.resolve({ data: [] as any[] }),
      postIds.length ? supabase.from("post_likes").select("post_id, user_id").in("post_id", postIds) : Promise.resolve({ data: [] as any[] }),
    ]);
    const profileMap = new Map((profiles ?? []).map((p: any) => [p.id, p]));
    const likeCount = new Map<string, number>();
    const likedByMe = new Set<string>();
    (likes ?? []).forEach((l: any) => {
      likeCount.set(l.post_id, (likeCount.get(l.post_id) ?? 0) + 1);
      if (user && l.user_id === user.id) likedByMe.add(l.post_id);
    });
    setPosts(list.map((p) => ({ ...p, author: profileMap.get(p.user_id) ?? null, likes_count: likeCount.get(p.id) ?? 0, liked_by_me: likedByMe.has(p.id) })));
  }

  useEffect(() => { loadPosts(); }, [user?.id]);

  async function createPost(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return toast.error("Sign in to post");
    if (title.trim().length < 4) return toast.error("Title too short");
    if (content.trim().length < 10) return toast.error("Write a bit more…");
    setBusy(true);
    const { error } = await supabase.from("community_posts").insert({ user_id: user.id, title: title.trim(), content: content.trim(), tag: postTag });
    setBusy(false);
    if (error) return toast.error(error.message);
    setTitle(""); setContent(""); setShowForm(false);
    toast.success("Post published! 🎉");
    loadPosts();
  }

  async function toggleLike(p: Post) {
    if (!user) return toast.error("Sign in to like posts");
    if (p.liked_by_me) {
      await supabase.from("post_likes").delete().eq("post_id", p.id).eq("user_id", user.id);
    } else {
      await supabase.from("post_likes").insert({ post_id: p.id, user_id: user.id });
    }
    loadPosts();
  }

  function submitFeedback(e: React.FormEvent) {
    e.preventDefault();
    if (!fbTitle.trim() || !fbMessage.trim()) return toast.error("Please fill in title and message");
    if (!fbName.trim() || !fbEmail.trim()) return toast.error("Please fill in your name and email");
    setFbBusy(true);
    setTimeout(() => {
      const entry: FeedbackEntry = {
        type: fbType, rating: fbType === "experience" ? fbRating : undefined,
        title: fbTitle, message: fbMessage, name: fbName, email: fbEmail,
        submittedAt: new Date().toISOString(), status: "submitted",
      };
      const existing = JSON.parse(localStorage.getItem("myFeedback") ?? "[]");
      existing.push(entry);
      localStorage.setItem("myFeedback", JSON.stringify(existing));
      setMyFeedback(existing);
      setFbBusy(false);
      setFbDone(true);
      toast.success("Feedback submitted! Thank you 🙏");
    }, 1000);
  }

  const filteredPosts = posts?.filter((p) => tagFilter === "All" || p.tag === tagFilter) ?? [];

  return (
    <AppShell>
      <PageHeader title="Community" subtitle="Connect, discuss, share resources, and give feedback — all in one place." />

      {/* Main Tabs */}
      <div className="mt-6 flex gap-3 flex-wrap">
        {([
          ["forum", "💬 Discussions", MessageSquare],
          ["groups", "👥 Study Groups", Users],
          ["feedback", "📬 Suggestion Box", Lightbulb],
        ] as const).map(([val, label, Icon]) => (
          <button key={val} onClick={() => setTab(val)}
            className={cn("flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm border transition-all",
              tab === val ? "bg-primary text-primary-foreground border-primary shadow-elegant" : "glass-card border-white/10 text-muted-foreground hover:text-foreground")}>
            {label}
          </button>
        ))}
      </div>

      {/* ── DISCUSSIONS TAB ── */}
      {tab === "forum" && (
        <div className="mt-6 grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {/* New Post Button */}
            {!showForm ? (
              <button onClick={() => setShowForm(true)}
                className="w-full glass-card rounded-2xl p-4 border border-white/5 hover:border-primary/30 transition-all flex items-center gap-3 text-muted-foreground hover:text-foreground">
                <div className="size-9 rounded-full bg-primary/10 grid place-items-center">
                  <Plus className="size-4 text-primary" />
                </div>
                <span className="text-sm">Start a discussion, ask a doubt, or share a resource…</span>
              </button>
            ) : (
              <form onSubmit={createPost} className="glass-card rounded-2xl p-5 space-y-3 border border-primary/20">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold flex items-center gap-2"><MessageSquare className="size-4 text-primary" /> New Discussion</h3>
                  <button type="button" onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><X className="size-4" /></button>
                </div>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post title…" className="text-sm" />
                <Textarea rows={4} value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your question, resource, or update…" className="text-sm resize-none" />
                <div className="flex items-center gap-3">
                  <select value={postTag} onChange={(e) => setPostTag(e.target.value)}
                    className="h-9 px-3 rounded-lg border border-input bg-background text-sm flex-1">
                    {POST_TAGS.map((t) => <option key={t}>{t}</option>)}
                  </select>
                  <Button type="submit" variant="hero" disabled={busy} className="gap-2">
                    {busy ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />} Post
                  </Button>
                </div>
              </form>
            )}

            {/* Tag Filter */}
            <div className="flex gap-2 flex-wrap">
              {["All", ...POST_TAGS].map((t) => (
                <button key={t} onClick={() => setTagFilter(t)}
                  className={cn("text-xs px-3 py-1 rounded-full border font-semibold transition-all",
                    tagFilter === t ? (TAG_COLORS[t] ?? "bg-primary/10 text-primary border-primary/20") : "border-white/10 text-muted-foreground hover:border-white/20")}>
                  #{t}
                </button>
              ))}
            </div>

            {/* Posts */}
            {!posts && <div className="grid place-items-center py-10"><Loader2 className="size-6 animate-spin text-primary" /></div>}
            {posts && filteredPosts.length === 0 && (
              <div className="glass-card rounded-2xl p-10 text-center">
                <MessageSquare className="size-10 mx-auto text-muted-foreground opacity-30 mb-3" />
                <p className="text-muted-foreground">No posts in this category yet. Start the conversation!</p>
              </div>
            )}
            {filteredPosts.map((p) => <PostCard key={p.id} post={p} onLike={() => toggleLike(p)} />)}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="glass-card rounded-2xl p-4">
              <h3 className="font-bold mb-3 flex items-center gap-2"><TrendingUp className="size-4 text-primary" />Trending Tags</h3>
              <div className="flex flex-wrap gap-1.5">
                {POST_TAGS.map((t) => {
                  const count = posts?.filter((p) => p.tag === t).length ?? 0;
                  return (
                    <button key={t} onClick={() => setTagFilter(t)}
                      className={cn("text-xs px-2 py-1 rounded-full border", TAG_COLORS[t] ?? "border-white/10")}>
                      #{t} <span className="opacity-60">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="glass-card rounded-2xl p-4">
              <h3 className="font-bold mb-2 text-sm">💡 Community Tips</h3>
              <ul className="space-y-2 text-xs text-muted-foreground">
                {["Tag your posts correctly for better visibility", "Help others — it earns you XP!", "Share resources and links — the community loves it", "Use #Doubt for questions, #Resources for links"].map((tip) => (
                  <li key={tip} className="flex items-start gap-1.5"><span className="text-primary mt-0.5">•</span> {tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ── STUDY GROUPS TAB ── */}
      {tab === "groups" && (
        <div className="mt-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {GROUPS.map((g) => {
              const Icon = g.icon;
              return (
                <div key={g.name} className="glass-card rounded-2xl p-5 border border-white/5 hover:border-primary/25 transition-all group cursor-pointer">
                  <div className={cn("size-12 rounded-xl bg-gradient-to-br grid place-items-center mb-3", g.color)}>
                    <Icon className="size-6 text-white" />
                  </div>
                  <h3 className="font-bold text-sm">{g.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{g.members.toLocaleString()} members · {g.tag}</p>
                  <Button variant="outline" size="sm" className="w-full mt-4 text-xs group-hover:bg-primary/10 group-hover:border-primary/30 transition-all"
                    onClick={() => toast.success(`Joined "${g.name}"! Check your discussion feed.`)}>
                    Join Group
                  </Button>
                </div>
              );
            })}
          </div>

          {/* WhatsApp / Telegram CTA */}
          <div className="mt-6 glass-card rounded-2xl p-5 border border-green-500/20 bg-green-500/3">
            <h3 className="font-bold flex items-center gap-2"><Globe2 className="size-4 text-green-400" /> External Communities</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">Join our WhatsApp and Telegram groups for real-time updates, off-campus drives, and peer discussions.</p>
            <div className="flex gap-3 flex-wrap">
              <Button variant="outline" size="sm" asChild>
                <a href="https://chat.whatsapp.com/" target="_blank" rel="noopener noreferrer" className="border-green-500/30 text-green-400 hover:bg-green-500/10">
                  📱 WhatsApp Group
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="https://t.me/" target="_blank" rel="noopener noreferrer" className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
                  ✈️ Telegram Channel
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="https://discord.gg/" target="_blank" rel="noopener noreferrer" className="border-violet-500/30 text-violet-400 hover:bg-violet-500/10">
                  🎮 Discord Server
                </a>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── SUGGESTION BOX TAB ── */}
      {tab === "feedback" && (() => {
        const combinedFeedback: FeedbackEntry[] = [
          ...SEEDED_FEEDBACK,
          ...myFeedback
        ].sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

        return (
          <div className="mt-6 grid lg:grid-cols-2 gap-6">
          {/* Form */}
          <div>
            <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
              <div className="p-5 border-b border-white/5">
                <h2 className="font-bold text-lg flex items-center gap-2"><Lightbulb className="size-5 text-yellow-400" /> Suggestion Box</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Share suggestions, your experience, or report issues. We read every submission.</p>
              </div>

              {fbDone ? (
                <div className="p-8 text-center">
                  <CheckCircle2 className="size-12 text-emerald-400 mx-auto mb-3" />
                  <h3 className="font-bold text-lg">Thank you! 🙏</h3>
                  <p className="text-sm text-muted-foreground mt-2 mb-4">Your {FEEDBACK_CONFIG[fbType].label.toLowerCase()} has been submitted. We'll review it and use it to make TechPath Pro better.</p>
                  <Button variant="hero" onClick={() => { setFbDone(false); setFbTitle(""); setFbMessage(""); setFbRating(0); }}>
                    Submit Another
                  </Button>
                </div>
              ) : (
                <form onSubmit={submitFeedback} className="p-5 space-y-4">
                  {/* Type Selector */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Type</p>
                    <div className="grid grid-cols-3 gap-2">
                      {(Object.entries(FEEDBACK_CONFIG) as [FeedbackType, typeof FEEDBACK_CONFIG[FeedbackType]][]).map(([type, cfg]) => {
                        const Icon = cfg.icon;
                        return (
                          <button key={type} type="button" onClick={() => setFbType(type)}
                            className={cn("p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all", fbType === type ? cfg.color : "border-white/10 text-muted-foreground hover:border-white/20")}>
                            <Icon className="size-4" /> {cfg.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Star Rating (experience only) */}
                  {fbType === "experience" && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">How would you rate TechPath Pro?</p>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button key={n} type="button" onClick={() => setFbRating(n)} onMouseEnter={() => setFbHover(n)} onMouseLeave={() => setFbHover(0)}
                            className="transition-transform hover:scale-110">
                            <Star className={cn("size-7", (fbHover || fbRating) >= n ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground")} />
                          </button>
                        ))}
                        {fbRating > 0 && <span className="ml-2 text-sm text-yellow-400 font-semibold self-center">{["", "Poor", "Fair", "Good", "Great", "Excellent!"][fbRating]}</span>}
                      </div>
                    </div>
                  )}

                  {/* Fields */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Your Name *</label>
                      <Input value={fbName} onChange={(e) => setFbName(e.target.value)} placeholder="Full name" className="h-9 text-sm" required />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Email *</label>
                      <Input type="email" value={fbEmail} onChange={(e) => setFbEmail(e.target.value)} placeholder="your@email.com" className="h-9 text-sm" required />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Title *</label>
                    <Input value={fbTitle} onChange={(e) => setFbTitle(e.target.value)} placeholder="Brief title for your feedback…" className="h-9 text-sm" required />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Details *</label>
                    <textarea value={fbMessage} onChange={(e) => setFbMessage(e.target.value)} rows={5} required
                      placeholder={FEEDBACK_CONFIG[fbType].placeholder}
                      className="w-full bg-background/50 border border-white/10 rounded-xl p-3 text-sm resize-none focus:outline-none focus:border-primary/50 transition-colors" />
                  </div>
                  <Button type="submit" variant="hero" className="w-full" disabled={fbBusy}>
                    {fbBusy ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                    {fbBusy ? "Submitting…" : `Submit ${FEEDBACK_CONFIG[fbType].label}`}
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* Right Side */}
          <div className="space-y-4">
            {/* What we do with feedback */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="font-bold mb-3">📋 How We Use Your Feedback</h3>
              <ul className="space-y-3">
                {[
                  { icon: Lightbulb, color: "text-yellow-400", title: "Suggestions", desc: "We review all suggestions weekly and prioritize based on votes and frequency." },
                  { icon: Star, color: "text-emerald-400", title: "Experiences", desc: "User stories inspire our team and are featured in our community newsletter." },
                  { icon: AlertCircle, color: "text-rose-400", title: "Bug Reports", desc: "Critical bugs are fixed within 48 hours. All issues are tracked and resolved." },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.title} className="flex items-start gap-3">
                      <Icon className={cn("size-5 shrink-0 mt-0.5", item.color)} />
                      <div>
                        <p className="font-semibold text-sm">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Suggestions & Action Feed */}
            <div className="glass-card rounded-2xl p-5 border border-white/5">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Lightbulb className="size-4 text-yellow-400" /> Suggestions & Action Feed
              </h3>
              <p className="text-xs text-muted-foreground mb-3">See what the community is suggesting and how we are responding in real-time.</p>
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {combinedFeedback.map((f, i) => {
                  const cfg = FEEDBACK_CONFIG[f.type];
                  const Icon = cfg?.icon ?? Lightbulb;
                  return (
                    <div key={i} className="p-3 rounded-xl border border-white/5 bg-white/3 text-xs space-y-1">
                      <div className="flex items-center gap-2">
                        <Icon className="size-3.5 text-primary" />
                        <span className="font-semibold text-foreground capitalize">{f.type}</span>
                        <span className="text-[10px] text-muted-foreground ml-auto">
                          {formatDistanceToNow(new Date(f.submittedAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="font-semibold text-sm text-foreground">{f.title}</p>
                      <p className="text-muted-foreground leading-relaxed">{f.message}</p>
                      
                      {f.type === "experience" && f.rating !== undefined && (
                        <div className="flex gap-0.5 my-1">
                          {(() => {
                            const r = f.rating ?? 0;
                            return Array.from({ length: 5 }).map((_, idx) => (
                              <Star key={idx} className={cn("size-3", idx < r ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground")} />
                            ));
                          })()}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-1 border-t border-white/5 mt-1.5">
                        <span className="text-[10px] text-muted-foreground">Submitted by {f.name}</span>
                        {f.status === "fixed" ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold text-[9px] border border-emerald-500/20">✅ Fixed</span>
                        ) : f.status === "in-progress" ? (
                          <span className="px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 font-semibold text-[9px] border border-yellow-500/20">⚡ In Progress</span>
                        ) : f.status === "published" ? (
                          <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-semibold text-[9px] border border-blue-500/20">📢 Featured</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-white/5 text-muted-foreground font-semibold text-[9px] border border-white/10">📨 Under Review</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Platform Stats */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="font-bold mb-3">📊 Platform Stats</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Discussion Posts", value: posts?.length ?? "—" },
                  { label: "Study Groups", value: GROUPS.length },
                  { label: "Active Members", value: "2,400+" },
                  { label: "Features from Feedback", value: "12" },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <p className="text-lg font-bold gradient-text">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        );
      })()}
    </AppShell>
  );
}

/* ──────── POST CARD ──── */
function PostCard({ post, onLike }: { post: Post; onLike: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = post.content.length > 200;

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/5 hover:border-primary/15 transition-all">
      <div className="flex items-start gap-3">
        <div className="size-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 grid place-items-center text-primary font-bold text-sm shrink-0">
          {(post.author?.full_name ?? "?").charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{post.author?.full_name ?? "Anonymous"}</span>
            {post.author?.college_name && <span> · {post.author.college_name}</span>}
            <span> · {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
          </p>
          <h3 className="font-semibold mt-1 text-sm">{post.title}</h3>
          <p className={cn("text-sm text-muted-foreground mt-1 whitespace-pre-wrap leading-relaxed", !expanded && isLong && "line-clamp-3")}>
            {post.content}
          </p>
          {isLong && (
            <button onClick={() => setExpanded(!expanded)} className="text-xs text-primary mt-1 flex items-center gap-0.5 hover:underline">
              {expanded ? <><ChevronUp className="size-3" />Show less</> : <><ChevronDown className="size-3" />Read more</>}
            </button>
          )}
          <div className="mt-3 flex items-center gap-3 text-xs">
            {post.tag && (
              <span className={cn("px-2 py-0.5 rounded-full border font-medium flex items-center gap-1", TAG_COLORS[post.tag] ?? "bg-white/10 text-muted-foreground")}>
                <Hash className="size-2.5" />{post.tag}
              </span>
            )}
            <button onClick={onLike}
              className={cn("flex items-center gap-1.5 transition-colors", post.liked_by_me ? "text-rose-400" : "text-muted-foreground hover:text-rose-400")}>
              <Heart className={cn("size-3.5", post.liked_by_me && "fill-current")} />
              {post.likes_count ?? 0}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
