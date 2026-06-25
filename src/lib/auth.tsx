import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

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

export interface User {
  fullName: string;
  email: string;
  college: string;
  branch: string;
  year: Year;
  domain: Domain;
  level: Level;
  xp: number;
  streak: number;
  joinedAt: string;
}

interface AuthCtx {
  user: User | null;
  signup: (u: Omit<User, "xp" | "streak" | "joinedAt">) => void;
  login: (email: string) => boolean;
  logout: () => void;
  update: (patch: Partial<User>) => void;
}

const Ctx = createContext<AuthCtx | null>(null);
const KEY = "techland_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(KEY);
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        // ignore
      }
    }
  }, []);

  const persist = (u: User | null) => {
    setUser(u);
    if (typeof window !== "undefined") {
      if (u) localStorage.setItem(KEY, JSON.stringify(u));
      else localStorage.removeItem(KEY);
    }
  };

  return (
    <Ctx.Provider
      value={{
        user,
        signup: (u) =>
          persist({ ...u, xp: 120, streak: 1, joinedAt: new Date().toISOString() }),
        login: (email) => {
          if (typeof window === "undefined") return false;
          const raw = localStorage.getItem(KEY);
          if (!raw) return false;
          const existing: User = JSON.parse(raw);
          if (existing.email.toLowerCase() === email.toLowerCase()) {
            setUser(existing);
            return true;
          }
          return false;
        },
        logout: () => persist(null),
        update: (patch) => {
          if (!user) return;
          persist({ ...user, ...patch });
        },
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
