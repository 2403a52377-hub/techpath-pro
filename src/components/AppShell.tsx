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
    items: [
      { to: "/roadmaps",  label: "Roadmaps",       icon: Map         },
      { to: "/learn",     label: "Learning Hub",    icon: BookOpen    },
      { to: "/coding",    label: "Coding Practice", icon: Code2       },
      { to: "/projects",  label: "Projects",        icon: FolderGit2  },
    ],
  },
  {
    id: "prep",
    group: "Preparation",
    icon: Target,
    items: [
      { to: "/placement",  label: "Placement Prep",  icon: Target        },
      { to: "/interview",  label: "Interview Prep",  icon: MessagesSquare },
      { to: "/resume",     label: "Resume Builder",  icon: FileText      },
    ],
  },
  {
    id: "explore",
    group: "Explore Opportunities",
    icon: GraduationCap,
    items: [
      { to: "/jobs",      label: "Jobs & Internships", icon: GraduationCap },
      { to: "/companies", label: "Company Tracks",      icon: Building2     },
    ],
  },
  {
    id: "grow",
    group: "Grow & Connect",
    icon: Users,
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
    <div>
      {/* Group header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors duration-150",
          expanded
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/40",
        )}
      >
        <GroupIcon className="size-4 shrink-0" />
        <span className="flex-1 text-xs font-semibold uppercase tracking-wider truncate">
          {group.group}
        </span>
        <ChevronDown
          className={cn(
            "size-3.5 shrink-0 text-muted-foreground transition-transform duration-200",
            expanded ? "rotate-180" : "",
          )}
        />
      </button>

      {/* Sub-items with slide animation */}
      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-250 ease-in-out"
        style={{
          maxHeight: expanded
            ? `${(contentRef.current?.scrollHeight ?? group.items.length * 40) + 4}px`
            : "0px",
          opacity: expanded ? 1 : 0,
        }}
      >
        <div className="mt-0.5 ml-7 space-y-0.5 pb-1">
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
                  "flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm transition-colors duration-150",
                  active
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40 font-normal",
                )}
              >
                <Icon className="size-3.5 shrink-0" />
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
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 z-40 h-screen shrink-0 border-r border-border/50 bg-background flex flex-col transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        style={{ width: "15rem" }}
      >
        {/* Logo */}
        <div className="flex h-14 items-center gap-2.5 px-4 border-b border-border/50 shrink-0">
          <div className="bg-white p-1 rounded-lg size-7 flex items-center justify-center shrink-0">
            <img src="/logo.png" alt="TechLand" className="size-full object-contain" />
          </div>
          <span className="text-base font-semibold tracking-tight">TechLand</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
          {/* Dashboard */}
          <Link
            to="/dashboard"
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors duration-150 mb-2",
              pathname === "/dashboard"
                ? "bg-primary text-primary-foreground font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40 font-normal",
            )}
          >
            <LayoutDashboard className="size-4 shrink-0" />
            Dashboard
          </Link>

          {/* Groups */}
          {NAV_GROUPS.map((group) => (
            <NavGroup
              key={group.id}
              group={group}
              pathname={pathname}
              onNavigate={() => setOpen(false)}
            />
          ))}

          {/* Admin */}
          {isAdmin && (
            <div className="pt-2 mt-2 border-t border-border/50">
              <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                Manage
              </p>
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors duration-150",
                  pathname.startsWith("/admin")
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40",
                )}
              >
                <ShieldCheck className="size-4 shrink-0" />
                Admin
              </Link>
            </div>
          )}
        </nav>

        {/* Bottom */}
        <div className="shrink-0 border-t border-border/50">
          {/* Motivational strip */}
          <div className="px-4 py-3 border-b border-border/50">
            <div className="flex items-center gap-2.5">
              <div className="size-7 rounded-md bg-primary/10 grid place-items-center shrink-0">
                <Rocket className="size-3.5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground leading-tight">Keep Learning, Keep Growing!</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Your future starts here 🚀</p>
              </div>
            </div>
          </div>

          {/* User row */}
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="size-7 rounded-full bg-primary/10 grid place-items-center text-primary text-xs font-bold shrink-0 overflow-hidden">
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
              <LogOut className="size-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 h-14 border-b border-border/50 bg-background/90 backdrop-blur flex items-center px-4 lg:px-6 gap-3">
          <button className="lg:hidden" onClick={() => setOpen(!open)}>
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          <div className="flex-1" />
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/50 text-muted-foreground text-xs font-medium">
            <Flame className="size-3.5 text-orange-400" />
            {user.streak}-day streak
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/50 text-muted-foreground text-xs font-medium">
            <Sparkles className="size-3.5 text-primary" />
            {user.xp} XP
          </div>
          <Button variant="outline" size="sm" asChild className="text-xs h-7">
            <Link to="/placement">Placement Prep</Link>
          </Button>
        </header>
        <main className="p-4 lg:p-8 max-w-7xl mx-auto">{children}</main>
      </div>
    </div>
  );
}
