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
  ChevronDown,
} from "lucide-react";
import { useState, useEffect, useRef, type ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

/* ─────────────────────────────────────────
   Grouped Navigation Config
───────────────────────────────────────── */
const NAV_GROUPS = [
  {
    id: "learn",
    group: "Learn & Practice",
    emoji: "📚",
    // gradient used for the header button icon badge
    badgeBg: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    activeBg: "bg-blue-500/15 border-blue-500/20",
    labelColor: "text-blue-400",
    subActiveBg: "from-blue-600 to-blue-500",
    hoverBg: "hover:bg-blue-500/10 hover:text-blue-300",
    items: [
      { to: "/roadmaps",  label: "Roadmaps",        icon: Map,         emoji: "🗺️" },
      { to: "/learn",     label: "Learning Hub",     icon: BookOpen,    emoji: "📖" },
      { to: "/coding",    label: "Coding Practice",  icon: Code2,       emoji: "💻" },
      { to: "/projects",  label: "Projects",         icon: FolderGit2,  emoji: "🛠️" },
    ],
  },
  {
    id: "prep",
    group: "Preparation",
    emoji: "🎯",
    badgeBg: "bg-violet-500/20 text-violet-400 border-violet-500/30",
    activeBg: "bg-violet-500/15 border-violet-500/20",
    labelColor: "text-violet-400",
    subActiveBg: "from-violet-600 to-violet-500",
    hoverBg: "hover:bg-violet-500/10 hover:text-violet-300",
    items: [
      { to: "/placement",  label: "Placement Prep",   icon: Target,        emoji: "📊" },
      { to: "/interview",  label: "Interview Prep",   icon: MessagesSquare, emoji: "🎤" },
      { to: "/resume",     label: "Resume Builder",   icon: FileText,      emoji: "📄" },
    ],
  },
  {
    id: "explore",
    group: "Explore Opportunities",
    emoji: "🌟",
    badgeBg: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    activeBg: "bg-emerald-500/15 border-emerald-500/20",
    labelColor: "text-emerald-400",
    subActiveBg: "from-emerald-600 to-emerald-500",
    hoverBg: "hover:bg-emerald-500/10 hover:text-emerald-300",
    items: [
      { to: "/jobs",       label: "Jobs & Internships", icon: GraduationCap, emoji: "💼" },
      { to: "/companies",  label: "Company Tracks",      icon: Building2,     emoji: "🏢" },
    ],
  },
  {
    id: "grow",
    group: "Grow & Connect",
    emoji: "🤝",
    badgeBg: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    activeBg: "bg-amber-500/15 border-amber-500/20",
    labelColor: "text-amber-400",
    subActiveBg: "from-amber-600 to-amber-500",
    hoverBg: "hover:bg-amber-500/10 hover:text-amber-300",
    items: [
      { to: "/community",   label: "Community",    icon: Users,    emoji: "💬" },
      { to: "/mentors",     label: "Mentorship",   icon: Sparkles, emoji: "✨" },
      { to: "/leaderboard", label: "Leaderboard",  icon: Trophy,   emoji: "🏆" },
    ],
  },
] as const;

/* ─────────────────────────────────────────
   Collapsible Group Component
───────────────────────────────────────── */
function NavGroup({
  group,
  pathname,
  onNavigate,
}: {
  group: (typeof NAV_GROUPS)[number];
  pathname: string;
  onNavigate: () => void;
}) {
  const hasActive = group.items.some(
    (item) =>
      pathname === item.to ||
      (item.to !== "/dashboard" && pathname.startsWith(item.to)),
  );

  const [expanded, setExpanded] = useState(hasActive);
  const contentRef = useRef<HTMLDivElement>(null);

  // auto-expand when a child becomes active (e.g. navigating via deep link)
  useEffect(() => {
    if (hasActive) setExpanded(true);
  }, [hasActive]);

  return (
    <div className="pt-1">
      {/* Group header — clickable button */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className={cn(
          "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left transition-all duration-200 border",
          expanded && hasActive
            ? group.activeBg
            : "border-transparent hover:bg-white/5",
        )}
      >
        {/* Emoji badge */}
        <span
          className={cn(
            "size-8 rounded-lg flex items-center justify-center text-base border shrink-0 transition-all",
            group.badgeBg,
          )}
        >
          {group.emoji}
        </span>

        {/* Label */}
        <span
          className={cn(
            "flex-1 text-xs font-bold uppercase tracking-wider truncate",
            group.labelColor,
          )}
        >
          {group.group}
        </span>

        {/* Chevron */}
        <ChevronDown
          className={cn(
            "size-3.5 shrink-0 transition-transform duration-300",
            group.labelColor,
            expanded ? "rotate-180" : "rotate-0",
          )}
        />
      </button>

      {/* Animated sub-items */}
      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: expanded
            ? `${(contentRef.current?.scrollHeight ?? group.items.length * 52) + 8}px`
            : "0px",
          opacity: expanded ? 1 : 0,
        }}
      >
        <div className="mt-1 ml-2 pl-3 border-l border-border/50 space-y-0.5 pb-1">
          {group.items.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.to ||
              (item.to !== "/dashboard" && pathname.startsWith(item.to));

            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                  active
                    ? `bg-gradient-to-r ${group.subActiveBg} text-white shadow-md`
                    : `text-muted-foreground ${group.hoverBg}`,
                )}
              >
                {/* Active indicator dot */}
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[13px] size-1.5 rounded-full bg-white shadow-glow" />
                )}

                {/* Icon + emoji badge */}
                <div
                  className={cn(
                    "size-7 rounded-md flex items-center justify-center shrink-0 text-sm transition-all",
                    active
                      ? "bg-white/20"
                      : "bg-white/5 group-hover:bg-white/10",
                  )}
                >
                  {item.emoji}
                </div>

                <span className="flex-1 truncate">{item.label}</span>

                {active && (
                  <span className="size-1.5 rounded-full bg-white/60 shrink-0" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   AppShell
───────────────────────────────────────── */
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

      {/* ── Sidebar ── */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 z-40 h-screen shrink-0 border-r border-border/60 bg-background/95 backdrop-blur-xl flex flex-col transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        style={{ width: "17rem" }}
      >
        {/* Logo bar */}
        <div className="flex h-16 items-center gap-3 px-5 border-b border-border/60 shrink-0">
          <div className="bg-white p-1 rounded-xl size-9 flex items-center justify-center shrink-0 shadow-md">
            <img src="/logo.png" alt="TechLand Logo" className="size-full object-contain" />
          </div>
          <span className="text-xl font-bold gradient-text">TechLand</span>
        </div>

        {/* Scrollable nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5 scrollbar-thin">
          {/* Dashboard */}
          <Link
            to="/dashboard"
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 mb-1",
              pathname === "/dashboard"
                ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/20"
                : "text-foreground hover:bg-primary/10 hover:text-primary",
            )}
          >
            <span
              className={cn(
                "size-8 rounded-lg flex items-center justify-center text-base shrink-0",
                pathname === "/dashboard"
                  ? "bg-white/20"
                  : "bg-primary/10",
              )}
            >
              🏠
            </span>
            Dashboard
          </Link>

          {/* Collapsible groups */}
          {NAV_GROUPS.map((group) => (
            <NavGroup
              key={group.id}
              group={group}
              pathname={pathname}
              onNavigate={() => setOpen(false)}
            />
          ))}

          {/* Manage / Admin */}
          {isAdmin && (
            <div className="pt-1">
              <button
                onClick={() => router.navigate({ to: "/admin" })}
                className={cn(
                  "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left transition-all duration-200 border",
                  pathname.startsWith("/admin")
                    ? "bg-rose-500/15 border-rose-500/20"
                    : "border-transparent hover:bg-rose-500/10",
                )}
              >
                <span className="size-8 rounded-lg flex items-center justify-center text-base border shrink-0 bg-rose-500/20 text-rose-400 border-rose-500/30">
                  🛡️
                </span>
                <span className="flex-1 text-xs font-bold uppercase tracking-wider text-rose-400">
                  Manage
                </span>
              </button>
              <div className="mt-1 ml-2 pl-3 border-l border-border/50 pb-1">
                <Link
                  to="/admin"
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    pathname.startsWith("/admin")
                      ? "bg-gradient-to-r from-rose-600 to-rose-500 text-white shadow-md"
                      : "text-muted-foreground hover:bg-rose-500/10 hover:text-rose-300",
                  )}
                >
                  <span className="size-7 rounded-md flex items-center justify-center text-sm bg-white/5">
                    ⚙️
                  </span>
                  Admin Panel
                </Link>
              </div>
            </div>
          )}
        </nav>

        {/* Bottom: motivational card + user strip */}
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

          {/* User row */}
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-accent/10 transition-colors">
            <div className="size-8 rounded-full bg-gradient-to-br from-primary to-accent grid place-items-center text-primary-foreground text-xs font-bold shrink-0 shadow-sm overflow-hidden">
              {user.avatarUrl
                ? <img src={user.avatarUrl} alt="Avatar" className="size-full object-cover" />
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

      {/* ── Main ── */}
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
