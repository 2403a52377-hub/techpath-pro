import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Map,
  BookOpen,
  Code2,
  Briefcase,
  FileText,
  FolderGit2,
  MessagesSquare,
  Building2,
  Users,
  GraduationCap,
  Trophy,
  LogOut,
  Flame,
  Sparkles,
  Menu,
  X,
  ShieldCheck,
  Target,
  Rocket,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

/* ── Grouped Navigation Structure ── */
const NAV_GROUPS = [
  {
    group: "Learn & Practice",
    color: "text-blue-400",
    items: [
      { to: "/roadmaps", label: "Roadmaps", icon: Map },
      { to: "/learn", label: "Learning Hub", icon: BookOpen },
      { to: "/coding", label: "Coding Practice", icon: Code2 },
      { to: "/projects", label: "Projects", icon: FolderGit2 },
    ],
  },
  {
    group: "Preparation",
    color: "text-violet-400",
    items: [
      { to: "/placement", label: "Placement Prep", icon: Target },
      { to: "/interview", label: "Interview Prep", icon: MessagesSquare },
      { to: "/resume", label: "Resume Builder", icon: FileText },
    ],
  },
  {
    group: "Explore Opportunities",
    color: "text-emerald-400",
    items: [
      { to: "/jobs", label: "Jobs & Internships", icon: GraduationCap },
      { to: "/companies", label: "Company Tracks", icon: Building2 },
    ],
  },
  {
    group: "Grow & Connect",
    color: "text-amber-400",
    items: [
      { to: "/community", label: "Community", icon: Users },
      { to: "/mentors", label: "Mentorship", icon: Sparkles },
      { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
    ],
  },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const isAdmin = user?.role === "admin";

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) {
    if (typeof window !== "undefined") {
      router.navigate({ to: "/auth", search: { tab: "login" } });
    }
    return null;
  }

  return (
    <div className="min-h-screen flex">
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 z-40 h-screen w-68 shrink-0 border-r border-border/60 bg-background/95 backdrop-blur-xl flex flex-col transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        style={{ width: "17rem" }}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 px-5 border-b border-border/60 shrink-0">
          <div className="bg-white p-1 rounded-xl size-9 flex items-center justify-center shrink-0 shadow-md">
            <img src="/logo.png" alt="TechLand Logo" className="size-full object-contain" />
          </div>
          <span className="text-xl font-bold gradient-text">TechLand</span>
        </div>

        {/* Nav groups */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1 scrollbar-thin">
          {/* Dashboard — standalone at top */}
          <Link
            to="/dashboard"
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 mb-2",
              pathname === "/dashboard"
                ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/20"
                : "text-foreground hover:bg-primary/10 hover:text-primary",
            )}
          >
            <div className={cn(
              "size-8 rounded-lg grid place-items-center shrink-0",
              pathname === "/dashboard" ? "bg-white/20" : "bg-primary/10"
            )}>
              <LayoutDashboard className="size-4" />
            </div>
            Dashboard
          </Link>

          {/* Grouped sections */}
          {NAV_GROUPS.map((group) => (
            <div key={group.group} className="pt-2">
              <p className={cn("text-[10px] font-bold uppercase tracking-widest px-3 pb-1.5", group.color)}>
                {group.group}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active =
                    pathname === item.to ||
                    (item.to !== "/dashboard" && pathname.startsWith(item.to));
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 group",
                        active
                          ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-md shadow-primary/20"
                          : "text-muted-foreground hover:bg-accent/10 hover:text-foreground",
                      )}
                    >
                      <div className={cn(
                        "size-7 rounded-lg grid place-items-center shrink-0 transition-all",
                        active ? "bg-white/20" : "bg-muted/50 group-hover:bg-accent/20"
                      )}>
                        <Icon className="size-3.5" />
                      </div>
                      <span className="flex-1 truncate">{item.label}</span>
                      {active && <ChevronRight className="size-3 opacity-70 shrink-0" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Manage / Admin */}
          {isAdmin && (
            <div className="pt-2">
              <p className="text-[10px] font-bold uppercase tracking-widest px-3 pb-1.5 text-rose-400">
                Manage
              </p>
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 group",
                  pathname.startsWith("/admin")
                    ? "bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-md"
                    : "text-muted-foreground hover:bg-rose-500/10 hover:text-rose-400",
                )}
              >
                <div className={cn(
                  "size-7 rounded-lg grid place-items-center shrink-0 transition-all",
                  pathname.startsWith("/admin") ? "bg-white/20" : "bg-muted/50 group-hover:bg-rose-500/20"
                )}>
                  <ShieldCheck className="size-3.5" />
                </div>
                Admin
              </Link>
            </div>
          )}
        </nav>

        {/* Motivational bottom card */}
        <div className="shrink-0 p-3 space-y-2 border-t border-border/60">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5 border border-primary/20 p-3">
            <div className="absolute top-0 right-0 -mt-2 -mr-2 size-14 rounded-full bg-primary/10 blur-xl" />
            <div className="relative flex items-start gap-2.5">
              <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 grid place-items-center shrink-0 shadow-md">
                <Rocket className="size-4 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-foreground leading-tight">Keep Learning,</p>
                <p className="text-xs font-bold text-foreground leading-tight">Keep Growing! 🚀</p>
                <p className="text-[10px] text-muted-foreground mt-1 leading-tight">Your future starts here.</p>
              </div>
            </div>
          </div>

          {/* User profile */}
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-accent/10 transition-colors">
            <div className="size-8 rounded-full bg-gradient-to-br from-primary to-accent grid place-items-center text-primary-foreground text-xs font-bold shrink-0 shadow-sm">
              {user.avatarUrl
                ? <img src={user.avatarUrl} alt="Avatar" className="size-full object-cover rounded-full" />
                : user.fullName.charAt(0).toUpperCase()
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate">{user.fullName}</p>
              <p className="text-[10px] text-muted-foreground truncate">{user.college}</p>
            </div>
            <button
              onClick={async () => {
                await logout();
                router.navigate({ to: "/" });
              }}
              className="text-muted-foreground hover:text-destructive transition-colors"
              title="Sign out"
            >
              <LogOut className="size-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 h-16 border-b border-border/60 bg-background/80 backdrop-blur-xl flex items-center px-4 lg:px-8 gap-4">
          <button className="lg:hidden" onClick={() => setOpen(!open)}>
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          <div className="flex-1" />
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
            <Flame className="size-4 text-amber-500" />
            <span className="text-sm font-semibold text-amber-500">{user.streak}-day streak</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <Sparkles className="size-4 text-primary" />
            <span className="text-sm font-semibold text-primary">{user.xp} XP</span>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/placement">Placement Prep</Link>
          </Button>
        </header>
        <main className="p-4 lg:p-8 max-w-7xl mx-auto">{children}</main>
      </div>
    </div>
  );
}
