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
   Navigation Config
───────────────────────────────────────── */
const NAV_GROUPS = [
  {
    id: "learn",
    group: "Learn & Practice",
    icon: BookOpen,
    groupBg: "bg-primary/8 border border-primary/15",
    headerBg: "bg-primary/10 hover:bg-primary/15",
    items: [
      { to: "/roadmaps",  label: "Roadmaps",        icon: Map        },
      { to: "/learn",     label: "Learning Hub",     icon: BookOpen   },
      { to: "/coding",    label: "Coding Practice",  icon: Code2      },
      { to: "/projects",  label: "Projects",         icon: FolderGit2 },
    ],
  },
  {
    id: "prep",
    group: "Preparation",
    icon: Target,
    groupBg: "bg-primary/8 border border-primary/15",
    headerBg: "bg-primary/10 hover:bg-primary/15",
    items: [
      { to: "/placement",  label: "Placement Prep",  icon: Target         },
      { to: "/interview",  label: "Interview Prep",  icon: MessagesSquare },
      { to: "/resume",     label: "Resume Builder",  icon: FileText       },
    ],
  },
  {
    id: "explore",
    group: "Explore Opportunities",
    icon: GraduationCap,
    groupBg: "bg-primary/8 border border-primary/15",
    headerBg: "bg-primary/10 hover:bg-primary/15",
    items: [
      { to: "/jobs",      label: "Jobs & Internships", icon: GraduationCap },
      { to: "/companies", label: "Company Tracks",      icon: Building2     },
    ],
  },
  {
    id: "grow",
    group: "Grow & Connect",
    icon: Users,
    groupBg: "bg-primary/8 border border-primary/15",
    headerBg: "bg-primary/10 hover:bg-primary/15",
    items: [
      { to: "/community",   label: "Community",   icon: Users    },
      { to: "/mentors",     label: "Mentorship",  icon: Sparkles },
      { to: "/leaderboard", label: "Leaderboard", icon: Trophy   },
    ],
  },
] as const;

/* ─────────────────────────────────────────
   Collapsible Group
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
  const GroupIcon = group.icon;

  useEffect(() => {
    if (hasActive) setExpanded(true);
  }, [hasActive]);

  return (
    <div className={cn("rounded-xl overflow-hidden transition-all duration-200", group.groupBg)}>
      {/* Group header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200",
          group.headerBg,
          expanded ? "text-foreground" : "text-muted-foreground hover:text-foreground",
        )}
      >
        <GroupIcon className="size-[18px] shrink-0" />
        <span className="flex-1 text-[13px] font-semibold tracking-wide truncate">
          {group.group}
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 opacity-60 transition-transform duration-250",
            expanded ? "rotate-180" : "",
          )}
        />
      </button>

      {/* Animated sub-items */}
      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: expanded
            ? `${(contentRef.current?.scrollHeight ?? group.items.length * 44) + 8}px`
            : "0px",
          opacity: expanded ? 1 : 0,
        }}
      >
        <div className="px-2 pb-2 pt-0.5 space-y-0.5">
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
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-all duration-150",
                  active
                    ? "bg-gradient-primary text-primary-foreground font-semibold shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/10 font-medium",
                )}
              >
                <Icon className="size-[15px] shrink-0" />
                <span className="truncate">{item.label}</span>
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
          "fixed lg:sticky top-0 z-40 h-screen shrink-0 border-r border-border/60 glass-card rounded-none flex flex-col transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        style={{ width: "16.5rem" }}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 px-5 border-b border-border/60 shrink-0">
          <div className="bg-white p-1 rounded-xl size-9 flex items-center justify-center shrink-0 shadow-md">
            <img src="/logo.png" alt="TechLand Logo" className="size-full object-contain" />
          </div>
          <span className="text-xl font-bold gradient-text">TechLand</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5 scrollbar-thin">
          {/* Dashboard */}
          <Link
            to="/dashboard"
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 mb-2",
              pathname === "/dashboard"
                ? "bg-gradient-primary text-primary-foreground shadow-md"
                : "text-foreground hover:bg-white/5",
            )}
          >
            <LayoutDashboard className="size-[18px] shrink-0" />
            Dashboard
          </Link>

          {/* Collapsible groups */}
          <div className="space-y-2">
            {NAV_GROUPS.map((group) => (
              <NavGroup
                key={group.id}
                group={group}
                pathname={pathname}
                onNavigate={() => setOpen(false)}
              />
            ))}
          </div>

          {/* Admin */}
          {isAdmin && (
            <div className="pt-3 mt-2 border-t border-border/50">
              <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/50">
                Manage
              </p>
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150",
                  pathname.startsWith("/admin")
                    ? "bg-gradient-primary text-primary-foreground font-semibold shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5",
                )}
              >
                <ShieldCheck className="size-[18px] shrink-0" />
                Admin
              </Link>
            </div>
          )}
        </nav>

        {/* Bottom card + user */}
        <div className="shrink-0 p-3 space-y-2 border-t border-border/60">
          {/* Motivational card */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5 border border-primary/20 p-3">
            <div className="absolute top-0 right-0 -mt-2 -mr-2 size-14 rounded-full bg-primary/10 blur-xl" />
            <div className="relative flex items-start gap-2.5">
              <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 grid place-items-center shrink-0 shadow-md">
                <Rocket className="size-4 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-foreground leading-tight">Keep Learning,</p>
                <p className="text-xs font-bold text-foreground leading-tight">Keep Growing!</p>
                <p className="text-[10px] text-muted-foreground mt-1 leading-tight">Your future starts here.</p>
              </div>
            </div>
          </div>

          {/* User row */}
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/5 transition-colors">
            <div className="size-8 rounded-full bg-gradient-to-br from-primary to-accent grid place-items-center text-primary-foreground text-xs font-bold shrink-0 overflow-hidden">
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
              onClick={async () => { await logout(); router.navigate({ to: "/" }); }}
              className="text-muted-foreground hover:text-destructive transition-colors"
              title="Sign out"
            >
              <LogOut className="size-[15px]" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 h-16 border-b border-border/60 bg-background/70 backdrop-blur-xl flex items-center px-4 lg:px-8 gap-4">
          <button className="lg:hidden" onClick={() => setOpen(!open)}>
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          <div className="flex-1" />
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-accent/10 border border-accent/30">
            <Flame className="size-4 text-accent" />
            <span className="text-sm font-semibold">{user.streak}-day streak</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-primary/10 border border-primary/30">
            <Sparkles className="size-4 text-primary" />
            <span className="text-sm font-semibold">{user.xp} XP</span>
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
