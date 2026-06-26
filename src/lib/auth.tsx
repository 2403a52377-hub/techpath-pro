import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type Year = "1st Year" | "2nd Year" | "3rd Year" | "4th Year" | "Graduate Student";
export type Level = "Beginner" | "Intermediate" | "Advanced";
export type Domain =
  | "Full Stack Development"
  | "Frontend Development"
  | "Backend Development"
  | "Data Analytics"
  | "Data Science"
  | "Artificial Intelligence"
  | "Machine Learning"
  | "Cybersecurity"
  | "Cloud Computing"
  | "DevOps"
  | "Mobile App Development"
  | "UI/UX Design"
  | "Software Testing"
  | "Blockchain";

export interface Profile {
  id: string;
  fullName: string;
  email: string;
  college: string;
  branch: string;
  year: Year | string;
  domain: Domain | string;
  level: Level;
  xp: number;
  streak: number;
  joinedAt: string;
  avatarUrl?: string | null;
}

export interface SignupInput {
  fullName: string;
  email: string;
  password: string;
  college: string;
  branch: string;
  year: Year;
  domain: Domain;
  level: Level;
}

interface AuthCtx {
  user: Profile | null;
  session: Session | null;
  loading: boolean;
  signup: (input: SignupInput) => Promise<{ error?: string }>;
  login: (email: string, password: string, remember?: boolean) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  update: (patch: Partial<Profile>) => Promise<{ error?: string }>;
  refresh: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ error?: string }>;
  resetPassword: (password: string) => Promise<{ error?: string }>;
}

const Ctx = createContext<AuthCtx | null>(null);

function rowToProfile(row: any, fallbackUser: SupabaseUser | null): Profile {
  return {
    id: row?.id ?? fallbackUser?.id ?? "",
    fullName: row?.full_name ?? fallbackUser?.user_metadata?.full_name ?? "",
    email: row?.email ?? fallbackUser?.email ?? "",
    college: row?.college_name ?? "",
    branch: row?.branch ?? "",
    year: row?.year_of_study ?? "",
    domain: row?.domain_interest ?? "",
    level: (row?.skill_level as Level) ?? "Beginner",
    xp: row?.xp ?? 0,
    streak: row?.streak ?? 0,
    joinedAt: row?.created_at ?? new Date().toISOString(),
    avatarUrl: row?.avatar_url ?? null,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadProfile(u: SupabaseUser | null) {
    if (!u) {
      setUser(null);
      return;
    }
    const { data } = await supabase.from("profiles").select("*").eq("id", u.id).maybeSingle();
    setUser(rowToProfile(data, u));
  }

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      // defer profile load to avoid potential deadlock
      setTimeout(() => {
        loadProfile(s?.user ?? null);
      }, 0);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      loadProfile(data.session?.user ?? null).finally(() => setLoading(false));
    });
    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  const signup: AuthCtx["signup"] = async (input) => {
    const redirectUrl =
      typeof window !== "undefined" ? `${window.location.origin}/dashboard` : undefined;
    const { error } = await supabase.auth.signUp({
      email: input.email.trim(),
      password: input.password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: input.fullName.trim(),
          college_name: input.college.trim(),
          branch: input.branch.trim(),
          year_of_study: input.year,
          domain_interest: input.domain,
          skill_level: input.level,
        },
      },
    });
    if (error) return { error: error.message };
    return {};
  };

  const login: AuthCtx["login"] = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) return { error: error.message };
    return {};
  };

  const logout: AuthCtx["logout"] = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const update: AuthCtx["update"] = async (patch) => {
    if (!user) return { error: "Not signed in" };
    const payload: Record<string, unknown> = {};
    if (patch.fullName !== undefined) payload.full_name = patch.fullName;
    if (patch.college !== undefined) payload.college_name = patch.college;
    if (patch.branch !== undefined) payload.branch = patch.branch;
    if (patch.year !== undefined) payload.year_of_study = patch.year;
    if (patch.domain !== undefined) payload.domain_interest = patch.domain;
    if (patch.level !== undefined) payload.skill_level = patch.level;
    if (patch.xp !== undefined) payload.xp = patch.xp;
    if (patch.streak !== undefined) payload.streak = patch.streak;
    if (patch.avatarUrl !== undefined) payload.avatar_url = patch.avatarUrl;
    const { error } = await supabase
      .from("profiles")
      .update(payload as never)
      .eq("id", user.id);
    if (error) return { error: error.message };
    setUser({ ...user, ...patch });
    return {};
  };

  const refresh: AuthCtx["refresh"] = async () => {
    const { data } = await supabase.auth.getSession();
    await loadProfile(data.session?.user ?? null);
  };

  const forgotPassword: AuthCtx["forgotPassword"] = async (email) => {
    const redirect =
      typeof window !== "undefined" ? `${window.location.origin}/reset-password` : undefined;
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: redirect,
    });
    if (error) return { error: error.message };
    return {};
  };

  const resetPassword: AuthCtx["resetPassword"] = async (password) => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) return { error: error.message };
    return {};
  };

  return (
    <Ctx.Provider
      value={{
        user,
        session,
        loading,
        signup,
        login,
        logout,
        update,
        refresh,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used within AuthProvider");
  return c;
}

/** Backwards-compat type alias for legacy imports. */
export type User = Profile;
