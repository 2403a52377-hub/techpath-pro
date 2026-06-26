import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext, HeadContent, Scripts } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";
import { AuthProvider } from "../lib/auth";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "TechLand — AI-Powered Career & Placement Platform for Engineers" },
      {
        name: "description",
        content:
          "TechLand helps engineering students upskill, prepare for placements, build resumes, and land top tech jobs with AI-powered guidance.",
      },
      { name: "author", content: "TechLand" },
      { property: "og:title", content: "TechLand — Career to Placement, Powered by AI" },
      {
        property: "og:description",
        content:
          "Roadmaps, coding practice, resume builder, mock interviews and an AI career coach — built for engineering students.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="text-center">
        <h1 className="text-7xl font-bold gradient-text">404</h1>
        <p className="mt-4 text-muted-foreground">This page took a gap year.</p>
        <a
          href="/"
          className="inline-block mt-6 px-5 py-2.5 rounded-lg bg-gradient-primary text-primary-foreground font-medium"
        >
          Go home
        </a>
      </div>
    </div>
  ),
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Outlet />
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </QueryClientProvider>
  );
}
