import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "./roadmaps.index";
import {
  Trophy, Medal, Flame, Award, Star, Zap, Target, Users,
  Loader2, Crown, TrendingUp, GraduationCap, BookOpen,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/leaderboard")({ component: Leaderboard });

/* ── Badge Definitions ── */
const BADGE_RULES = [
  { id: "streak_7",   label: "7-Day Streak",   icon: Flame,  color: "from-orange-400 to-red-500",    xpReq: 0,   streakReq: 7   },
  { id: "streak_30",  label: "30-Day Streak",  icon: Flame,  color: "from-red-500 to-rose-600",      xpReq: 0,   streakReq: 30  },
  { id: "xp_1000",    label: "XP Rookie",      icon: Zap,    color: "from-yellow-400 to-amber-500",  xpReq: 1000, streakReq: 0  },
  { id: "xp_5000",    label: "XP Explorer",    icon: Star,   color: "from-violet-500 to-purple-600", xpReq: 5000, streakReq: 0  },
  { id: "xp_10000",   label: "XP Master",      icon: Crown,  color: "from-amber-400 to-yellow-500",  xpReq: 10000,streakReq: 0  },
  { id: "top10",      label: "Top 10",         icon: Trophy, color: "from-emerald-400 to-cyan-500",  xpReq: 0,   streakReq: 0   },
  { id: "dsa_beast",  label: "DSA Beast",      icon: Target, color: "from-pink-500 to-rose-500",     xpReq: 3000, streakReq: 0  },
  { id: "scholar",    label: "Scholar",        icon: BookOpen,color:"from-blue-500 to-cyan-500",     xpReq: 0,   streakReq: 0   },
];

type Leader = {
  id: string;
  full_name: string;
  college_name: string | null;
  xp: number;
  streak: number;
  rank?: number;
};

function Leaderboard() {
  const { user } = useAuth();

  /* Fetch all profiles ordered by XP from Supabase */
  const { data: leaders = [], isLoading } = useQuery<Leader[]>({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, college_name, xp, streak")
        .order("xp", { ascending: false })
        .limit(100);
      if (error) throw error;
      return (data ?? []).map((l: any, i: number) => ({ ...l, rank: i + 1 }));
    },
    refetchInterval: 60_000, // refresh every minute
  });

  const myRank = leaders.findIndex((l) => l.id === user?.id) + 1;
  const myData = leaders.find((l) => l.id === user?.id);

  /* Compute user's earned badges */
  function earnedBadges(l: Leader, rank: number) {
    return BADGE_RULES.filter((b) => {
      if (b.id === "top10") return rank <= 10 && rank > 0;
      return l.xp >= b.xpReq && l.streak >= b.streakReq;
    });
  }

  const myBadges = myData ? earnedBadges(myData, myRank) : [];

  const top3 = leaders.slice(0, 3);
  const rest = leaders.slice(3);

  return (
    <AppShell>
      <PageHeader
        title="Leaderboard"
        subtitle="Real rankings from TechPath Pro users — XP, streaks, and earned badges."
      />

      {/* Top 3 Podium */}
      {!isLoading && top3.length >= 3 && (
        <div className="mt-8 flex items-end justify-center gap-4">
          {/* 2nd */}
          <PodiumCard leader={top3[1]} rank={2} />
          {/* 1st */}
          <PodiumCard leader={top3[0]} rank={1} tall />
          {/* 3rd */}
          <PodiumCard leader={top3[2]} rank={3} />
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6 mt-8">
        {/* Leaderboard Table */}
        <div className="lg:col-span-2">
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-white/5 flex items-center justify-between">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <Trophy className="size-5 text-yellow-400" /> All Rankings
              </h2>
              {isLoading && <Loader2 className="size-4 animate-spin text-primary" />}
              {!isLoading && <span className="text-xs text-muted-foreground">{leaders.length} members</span>}
            </div>

            {isLoading ? (
              <div className="grid place-items-center py-16">
                <Loader2 className="size-7 animate-spin text-primary mb-3" />
                <p className="text-sm text-muted-foreground">Loading TechPath Pro rankings…</p>
              </div>
            ) : leaders.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Users className="size-10 mx-auto mb-3 opacity-30" />
                <p>No users yet — be the first to climb the leaderboard!</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {leaders.slice(0, 50).map((l, i) => {
                  const isMe = l.id === user?.id;
                  const badges = earnedBadges(l, i + 1);
                  return (
                    <div key={l.id}
                      className={cn(
                        "flex items-center gap-4 px-5 py-3 transition-colors",
                        isMe ? "bg-primary/8 border-l-2 border-primary" : i < 3 ? "bg-yellow-500/3" : "hover:bg-white/2"
                      )}
                    >
                      {/* Rank */}
                      <div className={cn(
                        "size-9 rounded-full grid place-items-center font-bold text-sm shrink-0",
                        i === 0 ? "bg-yellow-500 text-black" :
                        i === 1 ? "bg-slate-400 text-black" :
                        i === 2 ? "bg-amber-600 text-white" :
                        "bg-white/8 text-muted-foreground"
                      )}>
                        {i === 0 ? "👑" : i + 1}
                      </div>

                      {/* Avatar */}
                      <div className={cn(
                        "size-9 rounded-full grid place-items-center font-bold text-sm shrink-0",
                        isMe ? "bg-primary text-primary-foreground" : "bg-gradient-to-br from-primary/30 to-accent/30 text-primary"
                      )}>
                        {(l.full_name || "?").charAt(0).toUpperCase()}
                      </div>

                      {/* Name + College */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate text-sm">
                          {l.full_name || "Anonymous"} {isMe && <span className="text-primary text-xs">(You)</span>}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{l.college_name || "—"}</p>
                        {/* Mini badges */}
                        {badges.length > 0 && (
                          <div className="flex gap-1 mt-0.5">
                            {badges.slice(0, 3).map((b) => {
                              const Icon = b.icon;
                              return (
                                <span key={b.id} title={b.label} className={cn("size-4 rounded grid place-items-center bg-gradient-to-br", b.color)}>
                                  <Icon className="size-2.5 text-white" />
                                </span>
                              );
                            })}
                            {badges.length > 3 && <span className="text-[10px] text-muted-foreground">+{badges.length - 3}</span>}
                          </div>
                        )}
                      </div>

                      {/* XP + Streak */}
                      <div className="text-right shrink-0">
                        <p className="font-bold text-sm gradient-text">{(l.xp ?? 0).toLocaleString()} XP</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                          <Flame className="size-3 text-orange-400" /> {l.streak ?? 0}d
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Your Position */}
          {user && (
            <div className="glass-card rounded-2xl p-5 border border-primary/20">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <TrendingUp className="size-4 text-primary" /> Your Position
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Rank", value: myRank > 0 ? `#${myRank}` : "—", icon: Trophy },
                  { label: "XP", value: (myData?.xp ?? user.xp ?? 0).toLocaleString(), icon: Zap },
                  { label: "Streak", value: `${myData?.streak ?? user.streak ?? 0}d`, icon: Flame },
                  { label: "Badges", value: myBadges.length, icon: Award },
                ].map((s) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.label} className="glass-card rounded-xl p-3 text-center">
                      <Icon className="size-4 text-primary mx-auto mb-1" />
                      <p className="text-lg font-bold gradient-text">{s.value}</p>
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Your Badges */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <Award className="size-4 text-yellow-400" /> {user ? "Your Badges" : "Badge System"}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {BADGE_RULES.map((b) => {
                const Icon = b.icon;
                const earned = myBadges.some((mb) => mb.id === b.id);
                return (
                  <div key={b.id} className={cn("text-center", !earned && "opacity-40")}>
                    <div className={cn("size-12 mx-auto rounded-2xl bg-gradient-to-br grid place-items-center", b.color, !earned && "grayscale")}>
                      <Icon className="size-6 text-white" />
                    </div>
                    <p className="mt-1.5 text-[10px] font-semibold leading-tight">{b.label}</p>
                    {!earned && <p className="text-[10px] text-muted-foreground">{b.xpReq > 0 ? `${b.xpReq} XP` : `${b.streakReq}d streak`}</p>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Streak Rewards */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="font-bold mb-3">🔥 Streak Rewards</h3>
            <ul className="space-y-2 text-sm">
              {[
                { days: 7,   reward: "+100 XP + Badge",          done: (myData?.streak ?? 0) >= 7  },
                { days: 30,  reward: "+500 XP + 30d Badge",       done: (myData?.streak ?? 0) >= 30 },
                { days: 60,  reward: "+1500 XP + Free Mentor",    done: (myData?.streak ?? 0) >= 60 },
                { days: 100, reward: "+3000 XP + Top Badge",      done: (myData?.streak ?? 0) >= 100},
              ].map((r) => (
                <li key={r.days} className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5"><Flame className="size-3 text-orange-400" /> {r.days}-day</span>
                  <span className={cn("text-xs font-semibold", r.done ? "text-emerald-400" : "text-muted-foreground")}>
                    {r.done ? "✅ Unlocked" : r.reward}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function PodiumCard({ leader, rank, tall }: { leader: Leader; rank: number; tall?: boolean }) {
  const colors = ["from-yellow-400 to-amber-500", "from-slate-400 to-slate-500", "from-amber-600 to-orange-600"];
  const heights = ["h-28", "h-20", "h-16"];
  const emoji = ["👑", "🥈", "🥉"];
  return (
    <div className="flex flex-col items-center gap-2 w-28">
      <div className={cn("size-14 rounded-full bg-gradient-to-br grid place-items-center font-bold text-2xl border-2", colors[rank - 1], rank === 1 ? "border-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.4)]" : "border-white/10")}>
        {(leader.full_name || "?").charAt(0).toUpperCase()}
      </div>
      <p className="text-xs font-bold text-center truncate w-full text-center">{leader.full_name || "—"}</p>
      <p className="text-[10px] text-muted-foreground truncate w-full text-center">{leader.college_name || "—"}</p>
      <p className="text-sm font-bold gradient-text">{(leader.xp ?? 0).toLocaleString()} XP</p>
      <div className={cn("w-full rounded-t-lg bg-gradient-to-br flex items-center justify-center text-2xl", colors[rank - 1], heights[rank - 1])}>
        {emoji[rank - 1]}
      </div>
    </div>
  );
}
