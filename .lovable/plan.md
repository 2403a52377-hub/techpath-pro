This is a substantial Phase 2 upgrade. I'll execute in staged batches so each piece is verifiable. Before I start, I need a few decisions confirmed since they materially change the architecture.

## Open Questions (please confirm)

1. **Backend**: Enable **Lovable Cloud** (managed Postgres + Auth + Storage + Edge functions, no external accounts). This is the default and covers all DB/Auth/AI needs. OK to enable?
2. **AI**: Use **Lovable AI Gateway** (no OpenAI key needed, billed via Lovable credits) for the AI Assistant. The spec said "Integrate OpenAI API" — confirm Lovable AI is acceptable, or you want to provide an OpenAI key.
3. **Email OTP + Institute email verification**: Lovable Cloud Auth supports email confirmation links out of the box. True 6-digit OTP + institute-domain allowlist (e.g. must end in `.edu` / `.ac.in`) is custom — confirm you want both (link confirmation AND OTP), or just confirmation links + a domain validator on signup.
4. **Admin Dashboard**: Add full admin CRUD for roadmaps/jobs/resources/users? (Adds ~1 stage of work.) Confirm yes/no.

Assuming **yes** to all four unless you say otherwise.

## Stack

TanStack Start + Lovable Cloud (Supabase) + Lovable AI Gateway + shadcn. Server logic via `createServerFn`. AI chat via `/api/chat` server route streaming through AI SDK.

## Execution Plan (staged)

### Stage A — Backend foundation
- Enable Lovable Cloud.
- Migration: `profiles`, `user_roles` (enum: student/mentor/admin) + `has_role()` SECURITY DEFINER, `roadmaps`, `roadmap_modules` (with YouTube fields), `user_progress`, `resumes`, `projects`, `jobs`, `community_posts`, `post_likes`, `post_comments`, `coding_topics`, `chat_messages`. All with RLS + GRANTs + indexes + FKs + `updated_at` triggers.
- Seed roadmaps, modules (YouTube links), coding topics, jobs, projects via migration seed.
- Auto-create profile + default `student` role on signup (trigger).

### Stage B — Real auth
- Remove `src/lib/auth.tsx` localStorage mock; replace with Supabase-backed `useAuth` hook.
- `/auth` page: tabs for Login / Register, password strength meter, institute-email validator, remember-me, all required signup fields persisted to `profiles`.
- `/forgot-password` + `/reset-password` routes.
- Email confirmation enabled in Cloud config.
- Move all protected routes under `src/routes/_authenticated/` (dashboard, roadmaps, progress, resume-builder, ai-assistant, community, placements, jobs, coding-practice).
- Admin-only subtree `_authenticated/_admin/` gated by `has_role('admin')`.
- Sign-out hygiene (cancel queries, clear cache, replace nav).

### Stage C — Homepage redesign
- New `/` landing: animated hero, feature grid (clickable cards → routes), 8 career domain cards, animated metric counters, testimonial cards, full footer (About/Contact/Privacy/Terms with stub routes), SEO meta.
- Replace all "static" feature cards with `<Link>` to dedicated pages.

### Stage D — Feature pages wired to DB
- `/roadmaps` + `/roadmaps/$id`: fetch from DB, modules with YouTube embed cards (thumbnail, title, duration, instructor, "Watch on YouTube" → new tab), progress tracking per user.
- `/coding-practice`: topic list from DB → external LeetCode/HackerRank/GFG/CodeChef links (new tab); per-domain recommended tracks.
- `/resume-builder`: live editor → save to `resumes`, ATS scoring server fn, **real PDF export** using `@react-pdf/renderer` (recruiter-friendly template), print support.
- `/jobs`: DB-backed listings, save jobs, application tracker.
- `/community`: posts/likes/comments via DB with RLS.
- `/placements`: aptitude/reasoning/verbal/mock-test category pages with curated resource links, company prep tracks from DB.
- `/dashboard`: real stats from DB — placement readiness score, resume score, weekly progress chart (recharts), streak, roadmap %, AI recommendations panel.

### Stage E — AI Assistant
- `/api/chat` TanStack server route streaming via Lovable AI Gateway (`google/gemini-3-flash-preview`), system prompt tuned for career/resume/interview guidance.
- `/ai-assistant` page using AI Elements (Conversation, Message, PromptInput, Shimmer).
- Global floating chatbot widget mounted in `_authenticated` layout: collapsible, mobile-responsive, persists messages to `chat_messages`.

### Stage F — Admin Dashboard (if confirmed)
- `_authenticated/_admin/` routes: roadmaps CRUD, modules/YouTube CRUD, jobs CRUD, coding topics CRUD, users list + role management, community moderation.

### Stage G — Production polish
- Skeleton loaders on all data-fetching pages, route-level `errorComponent` + `notFoundComponent`, Zod validation on all forms + server fn inputs, toast (sonner) on all mutations, SEO `head()` per route, mobile responsive audit, image lazy loading.

## Technical notes
- Server fns in `src/lib/*.functions.ts`; admin client only inside handlers via `await import('@/integrations/supabase/client.server')`.
- PDF generation runs client-side (`@react-pdf/renderer`) to avoid Worker native-binary issues.
- Domain validator: regex `/@[\w.-]+\.(edu|ac\.\w+|edu\.\w+)$/i` — easy to extend.
- AI chatbot uses `requireSupabaseAuth` middleware; messages scoped to `userId`.

## Deliverable size
Roughly 60-80 files. I'll ship in the stage order above, verifying build after each stage.

Please confirm the 4 questions above (or just say "go ahead with defaults") and I'll start with Stage A.