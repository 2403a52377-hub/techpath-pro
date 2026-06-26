import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "./roadmaps.index";
import { Trophy, Medal, Flame, Award } from "lucide-react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/leaderboard")({ component: Leaderboard });

const LEADERS = [
  { name: "Ananya Sharma", college: "IIT Delhi", xp: 12420, streak: 87 },
  { name: "Rohan Verma", college: "BITS Pilani", xp: 11800, streak: 64 },
  { name: "Priya Iyer", college: "NIT Trichy", xp: 11100, streak: 92 },
  { name: "Karthik Nair", college: "IIT Madras", xp: 9800, streak: 41 },
  { name: "Sneha Reddy", college: "VIT Vellore", xp: 9300, streak: 33 },
  { name: "Aditya Mehta", college: "IIIT Hyderabad", xp: 8900, streak: 27 },
  { name: "Riya Kapoor", college: "DTU", xp: 8200, streak: 19 },
];

const BADGES = [
  { name: "30-Day Streak", icon: Flame, color: "from-orange-400 to-red-500" },
  { name: "DSA Beast", icon: Trophy, color: "from-amber-400 to-yellow-500" },
  { name: "Resume Master", icon: Award, color: "from-emerald-400 to-cyan-500" },
  { name: "Top 1% Coder", icon: Medal, color: "from-purple-500 to-pink-500" },
];

function Leaderboard() {
  const { user } = useAuth();
  return (
    <AppShell>
      <PageHeader
        title="Leaderboard"
        subtitle="Compete with peers across India. XP, streaks, badges and gamified rewards."
      />

      <div className="grid lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 glass-card rounded-2xl p-6">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Trophy className="size-5 text-warning" /> Top this week
          </h2>
          <div className="space-y-2">
            {LEADERS.map((l, i) => (
              <div
                key={l.name}
                className={`flex items-center gap-4 p-3 rounded-xl ${i < 3 ? "bg-gradient-to-r from-warning/10 to-transparent" : "bg-background/50"}`}
              >
                <div
                  className={`size-9 rounded-full grid place-items-center font-bold text-sm ${i === 0 ? "bg-warning text-warning-foreground" : i === 1 ? "bg-muted-foreground/30" : i === 2 ? "bg-orange-300/40" : "bg-muted"}`}
                >
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{l.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{l.college}</p>
                </div>
                <div className="text-right text-sm">
                  <p className="font-bold gradient-text">{l.xp.toLocaleString()} XP</p>
                  <p className="text-xs text-muted-foreground">{l.streak}d streak</p>
                </div>
              </div>
            ))}
            {user && (
              <div className="flex items-center gap-4 p-3 rounded-xl bg-gradient-primary/15 border border-primary/30 mt-4">
                <div className="size-9 rounded-full bg-primary text-primary-foreground grid place-items-center font-bold text-sm">
                  99
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{user.fullName} (You)</p>
                  <p className="text-xs text-muted-foreground truncate">{user.college}</p>
                </div>
                <div className="text-right text-sm">
                  <p className="font-bold">{user.xp} XP</p>
                  <p className="text-xs text-muted-foreground">{user.streak}d streak</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-5">
            <h3 className="font-bold mb-3">Your badges</h3>
            <div className="grid grid-cols-2 gap-3">
              {BADGES.map((b) => {
                const Icon = b.icon;
                return (
                  <div key={b.name} className="text-center">
                    <div
                      className={`size-14 mx-auto rounded-2xl bg-gradient-to-br ${b.color} grid place-items-center shadow-md`}
                    >
                      <Icon className="size-7 text-white" />
                    </div>
                    <p className="mt-2 text-xs font-semibold">{b.name}</p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="glass-card rounded-2xl p-5">
            <h3 className="font-bold">Streak rewards</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex justify-between">
                <span>7-day streak</span>
                <span className="text-success font-semibold">✓ Unlocked</span>
              </li>
              <li className="flex justify-between">
                <span>30-day streak</span>
                <span className="text-muted-foreground">+500 XP</span>
              </li>
              <li className="flex justify-between">
                <span>100-day streak</span>
                <span className="text-muted-foreground">Free mentor session</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
