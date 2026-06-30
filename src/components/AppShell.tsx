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
  Bot,
  Users,
  GraduationCap,
  Trophy,
  LogOut,
  Flame,
  Sparkles,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { supabase } from "@/integrations/supabase/client";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/roadmaps", label: "Roadmaps", icon: Map },
  { to: "/learn", label: "Learning Hub", icon: BookOpen },
  { to: "/coding", label: "Coding Practice", icon: Code2 },
  { to: "/placement", label: "Placement Prep", icon: Briefcase },
  { to: "/resume", label: "Resume Builder", icon: FileText },
  { to: "/projects", label: "Projects", icon: FolderGit2 },
  { to: "/interview", label: "Interview Prep", icon: MessagesSquare },
  { to: "/jobs", label: "Jobs & Internships", icon: GraduationCap },
  { to: "/companies", label: "Company Tracks", icon: Building2 },
  { to: "/assistant", label: "TechLand AI", icon: Bot },
  { to: "/community", label: "Community", icon: Users },
  { to: "/mentors", label: "Mentorship", icon: Sparkles },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      return;
    }
    supabase
      .rpc("has_role", { _user_id: user.id, _role: "admin" })
      .then(({ data }) => setIsAdmin(!!data));
  }, [user?.id]);

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
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 z-40 h-screen w-72 shrink-0 border-r border-border/60 glass-card rounded-none transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center gap-3 px-6 border-b border-border/60">
          <img src="/logo.png" alt="TechLand Logo" className="size-8 object-contain" />
          <span className="text-lg font-bold gradient-text">TechLand</span>
        </div>
        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-4rem-5rem)]">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.to || (item.to !== "/dashboard" && pathname.startsWith(item.to));
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-gradient-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:bg-accent/10 hover:text-foreground",
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                pathname.startsWith("/admin")
                  ? "bg-gradient-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-accent/10 hover:text-foreground",
              )}
            >
              <ShieldCheck className="size-4" />
              Admin
            </Link>
          )}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-border/60 bg-background/40 backdrop-blur">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="size-9 rounded-full bg-gradient-accent grid place-items-center text-accent-foreground text-sm font-bold">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{user.fullName}</p>
              <p className="text-xs text-muted-foreground truncate">{user.college}</p>
            </div>
            <button
              onClick={async () => {
                await logout();
                router.navigate({ to: "/" });
              }}
              className="text-muted-foreground hover:text-destructive"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 h-16 border-b border-border/60 bg-background/70 backdrop-blur flex items-center px-4 lg:px-8 gap-4">
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
            <Link to="/assistant">Ask TechLand AI</Link>
          </Button>
        </header>
        <main className="p-4 lg:p-8 max-w-7xl mx-auto">{children}</main>
      </div>
    </div>
  );
}
