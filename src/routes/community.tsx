import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "./roadmaps.index";
import { MessageSquare, Users, BookOpen, Hash, Heart, Loader2, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/community")({ component: Community });

const GROUPS = ["Full Stack Devs", "DSA Daily", "Off-Campus Drives", "AI/ML India", "System Design", "Resume Reviews"];

type Post = {
  id: string;
  title: string;
  content: string;
  tag: string | null;
  created_at: string;
  user_id: string;
  author?: { full_name: string; college_name: string | null } | null;
  likes_count?: number;
  liked_by_me?: boolean;
};

function Community() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("Career");
  const [busy, setBusy] = useState(false);

  async function load() {
    const { data: rows } = await supabase
      .from("community_posts")
      .select("id, title, content, tag, created_at, user_id")
      .order("created_at", { ascending: false })
      .limit(50);
    const list: Post[] = rows ?? [];
    // hydrate author + like counts
    const userIds = Array.from(new Set(list.map((p) => p.user_id)));
    const postIds = list.map((p) => p.id);
    const [{ data: profiles }, { data: likes }] = await Promise.all([
      userIds.length
        ? supabase.from("profiles").select("id, full_name, college_name").in("id", userIds)
        : Promise.resolve({ data: [] as any[] }),
      postIds.length
        ? supabase.from("post_likes").select("post_id, user_id").in("post_id", postIds)
        : Promise.resolve({ data: [] as any[] }),
    ]);
    const profileMap = new Map((profiles ?? []).map((p: any) => [p.id, p]));
    const likeCount = new Map<string, number>();
    const likedByMe = new Set<string>();
    (likes ?? []).forEach((l: any) => {
      likeCount.set(l.post_id, (likeCount.get(l.post_id) ?? 0) + 1);
      if (user && l.user_id === user.id) likedByMe.add(l.post_id);
    });
    setPosts(list.map((p) => ({
      ...p,
      author: profileMap.get(p.user_id) ?? null,
      likes_count: likeCount.get(p.id) ?? 0,
      liked_by_me: likedByMe.has(p.id),
    })));
  }

  useEffect(() => { load(); }, [user?.id]);

  async function createPost(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return toast.error("Sign in first");
    if (title.trim().length < 4) return toast.error("Title too short");
    if (content.trim().length < 10) return toast.error("Content too short");
    setBusy(true);
    const { error } = await supabase.from("community_posts").insert({
      user_id: user.id,
      title: title.trim(),
      content: content.trim(),
      tag,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    setTitle(""); setContent("");
    toast.success("Posted!");
    load();
  }

  async function toggleLike(p: Post) {
    if (!user) return toast.error("Sign in first");
    if (p.liked_by_me) {
      await supabase.from("post_likes").delete().eq("post_id", p.id).eq("user_id", user.id);
    } else {
      await supabase.from("post_likes").insert({ post_id: p.id, user_id: user.id });
    }
    load();
  }

  return (
    <AppShell>
      <PageHeader title="Community" subtitle="Discussion forums, doubt solving, study groups and domain-based communities." />

      <div className="grid lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 space-y-4">
          <form onSubmit={createPost} className="glass-card rounded-2xl p-5 space-y-3">
            <h3 className="font-bold flex items-center gap-2"><MessageSquare className="size-4 text-accent" /> Start a discussion</h3>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post title" />
            <Textarea rows={3} value={content} onChange={(e) => setContent(e.target.value)} placeholder="Share your thoughts, ask a doubt, or post a resource…" />
            <div className="flex items-center gap-3">
              <select value={tag} onChange={(e) => setTag(e.target.value)} className="h-9 px-3 rounded-md border border-input bg-background text-sm">
                {["Career", "DSA", "Doubt", "Resources", "Placements", "Projects"].map((t) => <option key={t}>{t}</option>)}
              </select>
              <Button type="submit" variant="hero" disabled={busy} className="ml-auto">
                {busy ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />} Post
              </Button>
            </div>
          </form>

          <h2 className="text-xl font-bold flex items-center gap-2"><MessageSquare className="size-5 text-accent" /> Trending discussions</h2>
          {!posts && <div className="grid place-items-center py-10"><Loader2 className="size-6 animate-spin text-primary" /></div>}
          {posts && posts.length === 0 && <p className="text-sm text-muted-foreground">No posts yet — be the first!</p>}
          {posts?.map((p) => (
            <div key={p.id} className="glass-card rounded-2xl p-5 hover:shadow-elegant transition-all">
              <div className="flex items-start gap-3">
                <div className="size-10 rounded-full bg-gradient-accent grid place-items-center text-accent-foreground font-bold text-sm shrink-0">
                  {(p.author?.full_name ?? "?").charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">
                    {p.author?.full_name ?? "Anonymous"} {p.author?.college_name ? `• ${p.author.college_name}` : ""} • {formatDistanceToNow(new Date(p.created_at), { addSuffix: true })}
                  </p>
                  <h3 className="font-semibold mt-1">{p.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{p.content}</p>
                  <div className="mt-3 flex items-center gap-3 text-xs">
                    {p.tag && <span className="px-2 py-0.5 rounded-full bg-primary/15 text-primary font-medium flex items-center gap-1"><Hash className="size-3" />{p.tag}</span>}
                    <button onClick={() => toggleLike(p)} className={`flex items-center gap-1 ${p.liked_by_me ? "text-red-500" : "text-muted-foreground hover:text-foreground"}`}>
                      <Heart className={`size-3.5 ${p.liked_by_me ? "fill-current" : ""}`} /> {p.likes_count ?? 0}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2"><Users className="size-5 text-accent" /> Study groups</h2>
          <div className="glass-card rounded-2xl p-4 space-y-2">
            {GROUPS.map((g) => (
              <button key={g} className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-accent/10 transition-colors text-left">
                <div className="size-9 rounded-lg bg-gradient-primary grid place-items-center"><BookOpen className="size-4 text-primary-foreground" /></div>
                <div>
                  <p className="font-semibold text-sm">{g}</p>
                  <p className="text-xs text-muted-foreground">Active community</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
