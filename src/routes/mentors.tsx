import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "./roadmaps.index";
import { MENTORS } from "@/lib/data";
import { Star, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/mentors")({ component: Mentors });

function Mentors() {
  return (
    <AppShell>
      <PageHeader
        title="Mentorship Platform"
        subtitle="Book 1:1 sessions with industry mentors and senior students from top colleges."
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
        {MENTORS.map((m) => (
          <div key={m.name} className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <div className="size-14 rounded-2xl bg-gradient-accent grid place-items-center text-accent-foreground font-bold text-lg shadow-md">
                {m.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="font-bold truncate">{m.name}</p>
                <p className="text-xs text-muted-foreground truncate">{m.role}</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Expertise: <span className="text-foreground font-medium">{m.expertise}</span>
            </p>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="flex items-center gap-1 text-warning font-semibold">
                <Star className="size-4 fill-warning" />
                {m.rating}
              </span>
              <span className="font-bold">{m.price}</span>
            </div>
            <Button
              variant="hero"
              className="w-full mt-4"
              onClick={() => toast.success(`Session requested with ${m.name}`)}
            >
              <Calendar className="size-4" /> Book session
            </Button>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
