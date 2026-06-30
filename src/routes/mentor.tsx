import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "./roadmaps.index";
import { Users, Calendar, Clock, Star } from "lucide-react";

export const Route = createFileRoute("/mentor")({ component: MentorDashboard });

function MentorDashboard() {
  return (
    <AppShell>
      <PageHeader
        title="Mentor Dashboard"
        subtitle="Manage your student bookings, mock sessions, and feedback."
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {[
          { label: "Booked Sessions", value: "3", icon: Calendar, color: "from-blue-500 to-cyan-500" },
          { label: "Total Students", value: "12", icon: Users, color: "from-emerald-500 to-teal-500" },
          { label: "Completed Hours", value: "18 hrs", icon: Clock, color: "from-violet-500 to-purple-600" },
          { label: "Rating", value: "4.9 ★", icon: Star, color: "from-amber-400 to-yellow-500" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="glass-card rounded-2xl p-5">
              <div className={`size-10 rounded-xl bg-gradient-to-br ${s.color} grid place-items-center mb-3`}>
                <Icon className="size-5 text-white" />
              </div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">{s.label}</p>
              <p className="text-2xl font-bold mt-1">{s.value}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 glass-card rounded-2xl p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Calendar className="size-5 text-primary" /> Upcoming Sessions
        </h2>
        <div className="space-y-3">
          {[
            { student: "Aditya Sharma", topic: "Mock Interview Prep (DSA)", time: "Tomorrow, 6:00 PM - 7:00 PM" },
            { student: "Sneha Reddy", topic: "Resume Review", time: "July 2, 4:00 PM - 4:30 PM" },
            { student: "Rohan Verma", topic: "Backend System Design", time: "July 5, 2:00 PM - 3:00 PM" },
          ].map((session, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-background/50 border border-white/5">
              <div>
                <p className="font-semibold text-sm">{session.student}</p>
                <p className="text-xs text-muted-foreground">{session.topic}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-primary font-medium">{session.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
