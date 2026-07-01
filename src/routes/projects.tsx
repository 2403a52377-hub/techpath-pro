import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "./roadmaps.index";
import {
  Github, Clock, ExternalLink, Code2, Play, BookOpen,
  ChevronDown, Star, Zap, Trophy, Youtube, Globe,
  CheckSquare, Square, RotateCcw, Clipboard, ClipboardCheck,
  Monitor, X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/projects")({ component: Projects });

/* ─────────────────────── TYPES ──── */
type Skill = { name: string; docsUrl: string; color: string };
type Project = {
  title: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  skills: Skill[];
  description: string;
  whatYouLearn: string[];
  steps: string[];
  codeSnippet: string;
  githubSearch: string;
  youtubeSearch: string;
  stackblitzUrl?: string;
  liveDemo?: string;
};

/* ─────────────────────── DATA ──── */
const ALL_PROJECTS: Project[] = [
  {
    title: "Personal Portfolio Website",
    duration: "1 week", level: "Beginner",
    description: "Build your own portfolio to showcase your skills, projects, and contact info. The #1 project every developer needs.",
    whatYouLearn: ["HTML structure & semantic tags", "CSS Flexbox & Grid layouts", "Responsive design with media queries", "Basic JavaScript DOM manipulation", "Hosting on GitHub Pages / Netlify"],
    steps: ["Create index.html with sections: header, about, projects, contact", "Style with CSS — use Flexbox for nav, Grid for project cards", "Add a hamburger menu with JavaScript toggle", "Add smooth scroll & CSS hover animations", "Deploy free on GitHub Pages or Netlify"],
    skills: [
      { name: "HTML", docsUrl: "https://developer.mozilla.org/en-US/docs/Web/HTML", color: "bg-orange-500/15 text-orange-400 border-orange-500/20" },
      { name: "CSS", docsUrl: "https://developer.mozilla.org/en-US/docs/Web/CSS", color: "bg-blue-500/15 text-blue-400 border-blue-500/20" },
      { name: "JavaScript", docsUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript", color: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20" },
    ],
    codeSnippet: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>My Portfolio</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: #0f172a; color: #e2e8f0; }
    nav { display: flex; justify-content: space-between; padding: 1rem 2rem; }
    nav a { color: #94a3b8; text-decoration: none; margin-left: 1.5rem; }
    nav a:hover { color: #6366f1; }
    #about { min-height: 100vh; display: flex; flex-direction: column;
             justify-content: center; padding: 2rem; }
    h1 { font-size: 3rem; font-weight: 700; }
    .highlight { color: #6366f1; }
    .projects-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                     gap: 1.5rem; padding: 2rem; }
    .card { background: #1e293b; border-radius: 1rem; padding: 1.5rem;
            border: 1px solid #334155; transition: transform 0.2s; }
    .card:hover { transform: translateY(-4px); border-color: #6366f1; }
  </style>
</head>
<body>
  <nav>
    <span style="font-weight:700;color:#6366f1">Portfolio</span>
    <div>
      <a href="#about">About</a>
      <a href="#projects">Projects</a>
      <a href="#contact">Contact</a>
    </div>
  </nav>
  <section id="about">
    <h1>Hi, I'm <span class="highlight">Your Name</span> 👋</h1>
    <p style="color:#94a3b8;margin-top:1rem;font-size:1.2rem">Full Stack Developer | B.Tech CSE</p>
    <a href="#projects" style="margin-top:2rem;display:inline-block;background:#6366f1;color:white;padding:0.75rem 2rem;border-radius:9999px;text-decoration:none">View Projects →</a>
  </section>
  <section id="projects">
    <h2 style="padding:2rem;font-size:2rem">My Projects</h2>
    <div class="projects-grid">
      <div class="card">
        <h3>Project Name</h3>
        <p style="color:#94a3b8;margin:0.5rem 0">Brief description of what you built.</p>
        <a href="#" style="color:#6366f1;font-size:0.875rem">View on GitHub →</a>
      </div>
    </div>
  </section>
</body>
</html>`,
    githubSearch: "https://github.com/topics/portfolio-website",
    youtubeSearch: "https://www.youtube.com/results?search_query=html+css+portfolio+website+tutorial",
    stackblitzUrl: "https://stackblitz.com/edit/web-platform-gsgj7n?embed=1&file=index.html",
    liveDemo: "https://codepen.io/trending",
  },
  {
    title: "Todo App with LocalStorage",
    duration: "3 days", level: "Beginner",
    description: "Classic CRUD app — create, read, update, delete tasks. Tasks persist via localStorage even after refresh.",
    whatYouLearn: ["JavaScript arrays and objects", "localStorage for persistence", "DOM manipulation (create, append, remove)", "Event listeners & form handling", "React useState & useEffect"],
    steps: ["Create HTML form with an input + Add button", "Write JS to push tasks to array and render as list", "Add delete and complete-toggle functionality", "Save tasks to localStorage, load on refresh", "Style with CSS — strikethrough for completed tasks"],
    skills: [
      { name: "JavaScript", docsUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript", color: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20" },
      { name: "React", docsUrl: "https://react.dev", color: "bg-cyan-500/15 text-cyan-400 border-cyan-500/20" },
      { name: "Hooks", docsUrl: "https://react.dev/reference/react", color: "bg-purple-500/15 text-purple-400 border-purple-500/20" },
    ],
    codeSnippet: `import { useState, useEffect } from 'react';

function TodoApp() {
  const [todos, setTodos] = useState(() => {
    try { return JSON.parse(localStorage.getItem('todos') ?? '[]'); }
    catch { return []; }
  });
  const [input, setInput] = useState('');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (!input.trim()) return;
    setTodos([...todos, { id: Date.now(), text: input, done: false }]);
    setInput('');
  };

  const toggle = (id) =>
    setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));

  const remove = (id) =>
    setTodos(todos.filter(t => t.id !== id));

  return (
    <div style={{ maxWidth: 480, margin: '2rem auto', fontFamily: 'Inter, sans-serif' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>📝 Todo App</h1>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTodo()}
          placeholder="Add a task..."
          style={{ flex: 1, padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}
        />
        <button onClick={addTodo}
          style={{ background: '#6366f1', color: 'white', border: 'none',
                   padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer' }}>
          Add
        </button>
      </div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map(todo => (
          <li key={todo.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '0.5rem',
            background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <span
              onClick={() => toggle(todo.id)}
              style={{ flex: 1, cursor: 'pointer',
                       textDecoration: todo.done ? 'line-through' : 'none',
                       color: todo.done ? '#94a3b8' : '#1e293b' }}>
              {todo.done ? '✅' : '⬜'} {todo.text}
            </span>
            <button onClick={() => remove(todo.id)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>✕</button>
          </li>
        ))}
      </ul>
      <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
        {todos.filter(t => t.done).length}/{todos.length} completed
      </p>
    </div>
  );
}

export default TodoApp;`,
    githubSearch: "https://github.com/topics/todo-app",
    youtubeSearch: "https://www.youtube.com/results?search_query=react+todo+app+tutorial+2024",
    stackblitzUrl: "https://stackblitz.com/edit/vitejs-vite-react-ts?embed=1&file=src/App.tsx",
  },
  {
    title: "Weather Dashboard",
    duration: "5 days", level: "Beginner",
    description: "Fetch real weather data from OpenWeatherMap API. Display temperature, humidity, forecast, and city search.",
    whatYouLearn: ["REST API calls with fetch()", "Async/await & Promises", "JSON data parsing", "Dynamic DOM updates", "Error handling"],
    steps: ["Register at openweathermap.org for a free API key", "Build search bar UI that takes a city name", "Call /weather endpoint with the city name", "Parse JSON and display temp, humidity, wind, icon", "Add 5-day forecast using /forecast endpoint"],
    skills: [
      { name: "API", docsUrl: "https://openweathermap.org/api", color: "bg-blue-500/15 text-blue-400 border-blue-500/20" },
      { name: "fetch()", docsUrl: "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API", color: "bg-green-500/15 text-green-400 border-green-500/20" },
      { name: "Async/Await", docsUrl: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous", color: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20" },
    ],
    codeSnippet: `const API_KEY = 'YOUR_OPENWEATHERMAP_KEY'; // Get free at openweathermap.org

async function getWeather(city) {
  const res = await fetch(
    \`https://api.openweathermap.org/data/2.5/weather?q=\${city}&appid=\${API_KEY}&units=metric\`
  );
  if (!res.ok) throw new Error('City not found');
  const data = await res.json();

  return {
    city: data.name,
    country: data.sys.country,
    temp: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    humidity: data.main.humidity,
    description: data.weather[0].description,
    icon: \`https://openweathermap.org/img/wn/\${data.weather[0].icon}@2x.png\`,
    windSpeed: data.wind.speed,
  };
}

// Usage
async function handleSearch() {
  const city = document.getElementById('cityInput').value;
  try {
    const weather = await getWeather(city);
    document.getElementById('result').innerHTML = \`
      <h2>\${weather.city}, \${weather.country}</h2>
      <img src="\${weather.icon}" alt="\${weather.description}" />
      <p>\${weather.temp}°C — \${weather.description}</p>
      <p>Humidity: \${weather.humidity}% | Wind: \${weather.windSpeed} m/s</p>
    \`;
  } catch (err) {
    alert(err.message);
  }
}`,
    githubSearch: "https://github.com/topics/weather-app",
    youtubeSearch: "https://www.youtube.com/results?search_query=weather+app+javascript+api+tutorial",
    stackblitzUrl: "https://stackblitz.com/edit/web-platform-gsgj7n?embed=1&file=index.html",
  },
  {
    title: "E-commerce Storefront",
    duration: "3 weeks", level: "Intermediate",
    description: "Full shopping cart — product listings, cart management, Stripe payments. The project that gets you hired.",
    whatYouLearn: ["React state management with Zustand", "Stripe payment integration", "React Router for multi-page apps", "Database design for products & orders", "Authentication with Supabase"],
    steps: ["Set up React + Vite project with Tailwind CSS", "Build product listing with filter & sort", "Implement cart with Zustand (add, remove, update qty)", "Create checkout with form validation", "Integrate Stripe test mode for payments", "Connect Supabase for product database"],
    skills: [
      { name: "React", docsUrl: "https://react.dev", color: "bg-cyan-500/15 text-cyan-400 border-cyan-500/20" },
      { name: "Zustand", docsUrl: "https://zustand-demo.pmnd.rs", color: "bg-orange-500/15 text-orange-400 border-orange-500/20" },
      { name: "Stripe", docsUrl: "https://stripe.com/docs", color: "bg-violet-500/15 text-violet-400 border-violet-500/20" },
      { name: "Supabase", docsUrl: "https://supabase.com/docs", color: "bg-green-500/15 text-green-400 border-green-500/20" },
    ],
    codeSnippet: `// Cart store with Zustand + persistence
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(persist(
  (set, get) => ({
    items: [],

    addItem: (product) => {
      const existing = get().items.find(i => i.id === product.id);
      if (existing) {
        set({
          items: get().items.map(i =>
            i.id === product.id ? { ...i, qty: i.qty + 1 } : i
          )
        });
      } else {
        set({ items: [...get().items, { ...product, qty: 1 }] });
      }
    },

    removeItem: (id) =>
      set({ items: get().items.filter(i => i.id !== id) }),

    updateQty: (id, qty) =>
      set({ items: get().items.map(i => i.id === id ? { ...i, qty } : i) }),

    clearCart: () => set({ items: [] }),

    total: () =>
      get().items.reduce((sum, i) => sum + i.price * i.qty, 0),

    count: () =>
      get().items.reduce((sum, i) => sum + i.qty, 0),
  }),
  { name: 'cart-storage' }
));

// ProductCard component
function ProductCard({ product }) {
  const addItem = useCartStore(s => s.addItem);
  return (
    <div className="card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>₹{product.price.toLocaleString()}</p>
      <button onClick={() => addItem(product)}>Add to Cart</button>
    </div>
  );
}`,
    githubSearch: "https://github.com/topics/ecommerce",
    youtubeSearch: "https://www.youtube.com/results?search_query=react+ecommerce+stripe+tutorial+2024",
    stackblitzUrl: "https://stackblitz.com/edit/vitejs-vite-react-ts?embed=1&file=src/App.tsx",
  },
  {
    title: "Realtime Chat App",
    duration: "2 weeks", level: "Intermediate",
    description: "Build WhatsApp-like real-time messaging with rooms, online status, and typing indicators using Supabase Realtime.",
    whatYouLearn: ["Supabase Realtime subscriptions", "User auth & sessions", "Message ordering & pagination", "Typing indicators & online presence", "File upload to cloud storage"],
    steps: ["Create user auth with Supabase (email/password)", "Design schema: users, rooms, messages tables", "Enable Supabase Realtime on messages table", "Subscribe to new messages — update UI instantly", "Add typing indicator using presence channels", "Polish with timestamps and read receipts"],
    skills: [
      { name: "Supabase", docsUrl: "https://supabase.com/docs", color: "bg-green-500/15 text-green-400 border-green-500/20" },
      { name: "Realtime", docsUrl: "https://supabase.com/docs/guides/realtime", color: "bg-blue-500/15 text-blue-400 border-blue-500/20" },
      { name: "Auth", docsUrl: "https://supabase.com/docs/guides/auth", color: "bg-orange-500/15 text-orange-400 border-orange-500/20" },
    ],
    codeSnippet: `import { supabase } from './supabase';

// Subscribe to new messages in a room
function subscribeToRoom(roomId, onMessage) {
  return supabase
    .channel(\`room:\${roomId}\`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: \`room_id=eq.\${roomId}\`,
    }, payload => onMessage(payload.new))
    .subscribe();
}

// Presence — who is online
function trackPresence(roomId, userId) {
  const channel = supabase.channel(\`presence:\${roomId}\`);
  channel
    .on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState();
      console.log('Online users:', Object.keys(state).length);
    })
    .subscribe(async status => {
      if (status === 'SUBSCRIBED') {
        await channel.track({ user_id: userId, online_at: new Date().toISOString() });
      }
    });
  return channel;
}

// Send message
async function sendMessage(roomId, userId, content) {
  const { error } = await supabase.from('messages').insert({
    room_id: roomId, user_id: userId,
    content, created_at: new Date().toISOString(),
  });
  if (error) console.error(error);
}`,
    githubSearch: "https://github.com/topics/chat-app",
    youtubeSearch: "https://www.youtube.com/results?search_query=realtime+chat+app+supabase+react",
    stackblitzUrl: "https://stackblitz.com/edit/vitejs-vite-react-ts?embed=1&file=src/App.tsx",
  },
  {
    title: "AI SaaS Platform",
    duration: "6 weeks", level: "Advanced",
    description: "Production-grade AI-powered SaaS — auth, subscription billing, LLM streaming, and a modern dashboard.",
    whatYouLearn: ["OpenAI / Gemini API with streaming", "Stripe subscription billing (tiers)", "Rate limiting & API key management", "Full-stack Next.js App Router", "Production deployment on Vercel"],
    steps: ["Scaffold Next.js 14 with Tailwind + Shadcn/UI", "Set up Supabase for auth, database, storage", "Integrate OpenAI API with streaming responses", "Add Stripe — Free / Pro subscription tiers", "Implement usage limits per plan", "Build dashboard with usage analytics", "Deploy to Vercel with env variables"],
    skills: [
      { name: "OpenAI", docsUrl: "https://platform.openai.com/docs", color: "bg-green-500/15 text-green-400 border-green-500/20" },
      { name: "Next.js", docsUrl: "https://nextjs.org/docs", color: "bg-blue-500/15 text-blue-400 border-blue-500/20" },
      { name: "Stripe", docsUrl: "https://stripe.com/docs", color: "bg-violet-500/15 text-violet-400 border-violet-500/20" },
      { name: "Supabase", docsUrl: "https://supabase.com/docs", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
    ],
    codeSnippet: `// Next.js Route Handler — OpenAI Streaming
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  const { prompt, userId } = await req.json();

  // Check usage limit
  const usage = await checkUsage(userId);
  if (usage.count >= usage.limit) {
    return Response.json({ error: 'Monthly limit reached. Upgrade to Pro.' }, { status: 429 });
  }

  const stream = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    stream: true,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content ?? '';
        controller.enqueue(encoder.encode(text));
      }
      controller.close();
      // Increment usage counter
      await incrementUsage(userId);
    },
  });

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}`,
    githubSearch: "https://github.com/topics/saas",
    youtubeSearch: "https://www.youtube.com/results?search_query=ai+saas+nextjs+openai+tutorial+2024",
    stackblitzUrl: "https://stackblitz.com/edit/nextjs?embed=1&file=pages/index.tsx",
  },
  {
    title: "Distributed URL Shortener",
    duration: "4 weeks", level: "Advanced",
    description: "URL shortener like bit.ly — handles millions of redirects, Redis caching, analytics, and custom domains.",
    whatYouLearn: ["System design for high traffic", "Redis caching patterns", "Database indexing & query optimization", "Rate limiting (token bucket)", "Click analytics with charts"],
    steps: ["Design schema (urls, clicks, users tables)", "Implement Base62 encoding for short codes", "Add Redis caching — cache-aside pattern", "Build analytics: clicks, country, device, referrer", "Add rate limiting per user/IP", "Build dashboard with click charts"],
    skills: [
      { name: "System Design", docsUrl: "https://github.com/donnemartin/system-design-primer", color: "bg-blue-500/15 text-blue-400 border-blue-500/20" },
      { name: "Redis", docsUrl: "https://redis.io/docs/", color: "bg-red-500/15 text-red-400 border-red-500/20" },
      { name: "Node.js", docsUrl: "https://nodejs.org/en/docs", color: "bg-green-500/15 text-green-400 border-green-500/20" },
      { name: "PostgreSQL", docsUrl: "https://www.postgresql.org/docs/", color: "bg-sky-500/15 text-sky-400 border-sky-500/20" },
    ],
    codeSnippet: `// URL Shortener Core — Node.js + Redis
import { createClient } from 'redis';
import { customAlphabet } from 'nanoid';

const redis = createClient({ url: process.env.REDIS_URL });
await redis.connect();

const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 7
);

// Shorten URL
async function shortenUrl(originalUrl, userId) {
  const code = nanoid(); // e.g. "Xk2mP9a"

  await db.query(
    'INSERT INTO urls (code, original_url, user_id, created_at) VALUES ($1,$2,$3,NOW())',
    [code, originalUrl, userId]
  );

  // Cache for 24h
  await redis.setEx(\`url:\${code}\`, 86400, originalUrl);
  return \`https://sh.rt/\${code}\`;
}

// Redirect with analytics
async function redirect(req, res) {
  const { code } = req.params;

  // Cache-aside: check Redis first
  let url = await redis.get(\`url:\${code}\`);
  if (!url) {
    const row = await db.query('SELECT original_url FROM urls WHERE code=$1', [code]);
    url = row.rows[0]?.original_url;
    if (url) await redis.setEx(\`url:\${code}\`, 86400, url);
  }

  if (!url) return res.status(404).json({ error: 'Short URL not found' });

  // Track the click async (don't block redirect)
  db.query('INSERT INTO clicks (code, ip, user_agent, clicked_at) VALUES ($1,$2,$3,NOW())',
    [code, req.ip, req.headers['user-agent']]);

  res.redirect(301, url);
}`,
    githubSearch: "https://github.com/topics/url-shortener",
    youtubeSearch: "https://www.youtube.com/results?search_query=url+shortener+system+design+nodejs",
    liveDemo: "https://github.com/donnemartin/system-design-primer",
  },
];

const LEVEL_COLORS = {
  Beginner:     { badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30", icon: Star,   dot: "bg-emerald-400" },
  Intermediate: { badge: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",   icon: Zap,    dot: "bg-yellow-400" },
  Advanced:     { badge: "bg-rose-500/15 text-rose-400 border-rose-500/30",          icon: Trophy, dot: "bg-rose-400"   },
};

/* ─────────────────────── STEP TRACKER ──── */
function useStepTracker(projectTitle: string, totalSteps: number) {
  const key = `steps-${projectTitle}`;
  const [checked, setChecked] = useState<boolean[]>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(key) ?? "null");
      if (Array.isArray(saved) && saved.length === totalSteps) return saved;
    } catch {}
    return new Array(totalSteps).fill(false);
  });

  function toggle(i: number) {
    setChecked((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      localStorage.setItem(key, JSON.stringify(next));
      return next;
    });
  }

  function reset() {
    const fresh = new Array(totalSteps).fill(false);
    setChecked(fresh);
    localStorage.setItem(key, JSON.stringify(fresh));
  }

  const done = checked.filter(Boolean).length;
  return { checked, toggle, reset, done };
}

/* ─────────────────────── PROJECT CARD ──── */
function ProjectCard({ p, defaultOpen }: { p: Project; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  const [codeOpen, setCodeOpen] = useState(false);
  const [playOpen, setPlayOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { checked, toggle, reset, done } = useStepTracker(p.title, p.steps.length);
  const meta = LEVEL_COLORS[p.level];
  const LevelIcon = meta.icon;
  const progress = Math.round((done / p.steps.length) * 100);

  function copy() {
    navigator.clipboard.writeText(p.codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={cn("glass-card rounded-2xl overflow-hidden border transition-all", open ? "border-primary/30" : "border-white/5")}>
      {/* Header */}
      <button onClick={() => { setOpen(!open); setPlayOpen(false); }} className="w-full p-5 flex items-center gap-4 text-left hover:bg-white/2 transition-colors">
        <div className={cn("size-2.5 rounded-full shrink-0", meta.dot)} />
        <div className="flex-1">
          <h3 className="font-bold text-base">{p.title}</h3>
          <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">{p.description}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {done > 0 && (
            <span className="text-xs text-emerald-400 font-semibold hidden sm:block">
              {done}/{p.steps.length} done
            </span>
          )}
          <span className="text-xs text-muted-foreground hidden sm:flex items-center gap-1">
            <Clock className="size-3" /> {p.duration}
          </span>
          <ChevronDown className={cn("size-5 text-muted-foreground transition-transform", open && "rotate-180")} />
        </div>
      </button>

      {/* Progress bar */}
      {done > 0 && (
        <div className="h-0.5 bg-white/5">
          <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}

      {open && (
        <div className="border-t border-white/5">
          <div className="p-5 space-y-5">
            {/* Description */}
            <p className="text-sm text-muted-foreground">{p.description}</p>

            {/* Skills — clickable to docs */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Skills & Official Docs</p>
              <div className="flex flex-wrap gap-2">
                {p.skills.map((s) => (
                  <a key={s.name} href={s.docsUrl} target="_blank" rel="noopener noreferrer"
                    className={cn("text-xs px-3 py-1.5 rounded-full border font-semibold flex items-center gap-1.5 hover:scale-105 transition-transform", s.color)}>
                    <BookOpen className="size-3" /> {s.name} <ExternalLink className="size-2.5" />
                  </a>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              {/* What You'll Learn */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">What You'll Learn</p>
                <ul className="space-y-1.5">
                  {p.whatYouLearn.map((l) => (
                    <li key={l} className="flex items-start gap-2 text-sm">
                      <span className="size-1.5 rounded-full bg-primary mt-2 shrink-0" /> {l}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Interactive Step Tracker */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                    Step-by-Step Guide
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{done}/{p.steps.length}</span>
                    {done > 0 && (
                      <button onClick={reset} className="text-muted-foreground hover:text-foreground transition-colors">
                        <RotateCcw className="size-3.5" />
                      </button>
                    )}
                  </div>
                </div>
                <ol className="space-y-2">
                  {p.steps.map((step, i) => (
                    <li key={i}
                      onClick={() => toggle(i)}
                      className={cn("flex items-start gap-2 text-sm cursor-pointer p-2 rounded-lg transition-all hover:bg-white/3", checked[i] && "opacity-60")}
                    >
                      {checked[i]
                        ? <CheckSquare className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                        : <Square className="size-4 text-muted-foreground shrink-0 mt-0.5" />}
                      <span className={cn(checked[i] && "line-through text-muted-foreground")}>{step}</span>
                    </li>
                  ))}
                </ol>
                {done === p.steps.length && (
                  <div className="mt-3 text-center text-xs font-bold text-emerald-400 bg-emerald-500/10 rounded-lg py-2">
                    🎉 Project Complete!
                  </div>
                )}
              </div>
            </div>

            {/* Code Snippet */}
            <div>
              <button onClick={() => setCodeOpen(!codeOpen)}
                className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
                <Code2 className="size-4" />
                {codeOpen ? "Hide" : "View"} Starter Code
                <span className="text-xs text-muted-foreground">(click to copy)</span>
              </button>
              {codeOpen && (
                <div className="mt-3 rounded-xl bg-black/50 border border-white/10 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/2">
                    <span className="text-xs text-muted-foreground font-mono">{p.title.toLowerCase().replace(/\s+/g, "-")}.tsx</span>
                    <button onClick={copy} className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors">
                      {copied ? <><ClipboardCheck className="size-3.5" /> Copied!</> : <><Clipboard className="size-3.5" /> Copy</>}
                    </button>
                  </div>
                  <pre className="p-4 text-xs font-mono text-green-300 overflow-x-auto whitespace-pre leading-relaxed max-h-80">
                    {p.codeSnippet}
                  </pre>
                </div>
              )}
            </div>

            {/* In-App Playground */}
            {p.stackblitzUrl && (
              <div>
                <button onClick={() => setPlayOpen(!playOpen)}
                  className="flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent/80 transition-colors">
                  <Monitor className="size-4" />
                  {playOpen ? "Close" : "▶ Open"} In-App Code Playground
                  {!playOpen && <span className="text-xs text-muted-foreground ml-1">powered by StackBlitz</span>}
                </button>
                {playOpen && (
                  <div className="mt-3 rounded-xl overflow-hidden border border-white/10 relative">
                    <div className="flex items-center justify-between px-4 py-2 bg-white/3 border-b border-white/10">
                      <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <Play className="size-3 text-emerald-400" /> StackBlitz Playground — edit & run code live
                      </span>
                      <button onClick={() => setPlayOpen(false)} className="text-muted-foreground hover:text-foreground">
                        <X className="size-4" />
                      </button>
                    </div>
                    <iframe
                      src={p.stackblitzUrl}
                      className="w-full"
                      style={{ height: 520 }}
                      title={`${p.title} playground`}
                      allow="accelerometer; camera; encrypted-media; geolocation; gyroscope; microphone; midi; payment; usb; xr-spatial-tracking"
                      sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-2 border-t border-white/5">
              <Button variant="hero" size="sm" asChild>
                <a href={p.githubSearch} target="_blank" rel="noopener noreferrer">
                  <Github className="size-4" /> GitHub References
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href={p.youtubeSearch} target="_blank" rel="noopener noreferrer">
                  <Youtube className="size-4 text-rose-400" /> Video Tutorial
                </a>
              </Button>
              {p.liveDemo && (
                <Button variant="outline" size="sm" asChild>
                  <a href={p.liveDemo} target="_blank" rel="noopener noreferrer">
                    <Globe className="size-4 text-emerald-400" /> Live Demo
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────── MAIN PAGE ──── */
function Projects() {
  const levels = ["Beginner", "Intermediate", "Advanced"] as const;
  const [projectList, setProjectList] = useState<Project[]>(ALL_PROJECTS);

  useEffect(() => {
    (async () => {
      // 1. Fetch custom projects from Supabase
      const { data: dbProjects } = await supabase.from("projects" as any).select("*");
      
      // 2. Fetch custom projects from local storage fallback
      let localProjects: any[] = [];
      try {
        localProjects = JSON.parse(localStorage.getItem("customProjects") ?? "[]");
      } catch {
        localProjects = [];
      }

      // Combine them
      const customProjects: Project[] = [
        ...(dbProjects ?? []).map((p: any) => ({
          title: p.title,
          duration: "2-3 weeks",
          level: (p.difficulty === "Beginner" || p.difficulty === "Intermediate" || p.difficulty === "Advanced") ? p.difficulty : "Beginner",
          skills: [
            { name: p.domain_name.split(" ")[0], docsUrl: "#", color: "bg-primary/10 text-primary border-primary/20" }
          ],
          description: p.description,
          whatYouLearn: ["Project structure & design", "Feature implementation", "Debugging & testing"],
          steps: ["Scaffold project files", "Write core components", "Test features", "Deploy/Run locally"],
          codeSnippet: `// Source code available at:\n// ${p.github_reference ?? "https://github.com"}`,
          githubSearch: p.github_reference ?? "https://github.com/topics/project",
          youtubeSearch: `https://www.youtube.com/results?search_query=${encodeURIComponent(p.title + " tutorial")}`,
          stackblitzUrl: ""
        })),
        ...localProjects
      ];

      // Track deleted projects
      let deletedTitles: string[] = [];
      try {
        deletedTitles = JSON.parse(localStorage.getItem("deletedProjects") ?? "[]");
      } catch {
        deletedTitles = [];
      }

      const combined = [...ALL_PROJECTS, ...customProjects].filter(
        (p) => !deletedTitles.includes(p.title)
      );
      setProjectList(combined);
    })();
  }, []);

  return (
    <AppShell>
      <PageHeader
        title="Project Guidance"
        subtitle="Expand any project for step-by-step guide, clickable docs, copyable code, and a live in-app code playground."
      />

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Projects", value: projectList.length, icon: Code2 },
          { label: "Code Snippets", value: projectList.length, icon: BookOpen },
          { label: "In-App Playground", value: projectList.filter(p => p.stackblitzUrl).length, icon: Monitor },
          { label: "Difficulty Levels", value: 3, icon: Star },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="glass-card rounded-2xl p-4 flex items-center gap-3">
              <div className="size-9 rounded-xl bg-primary/10 grid place-items-center shrink-0">
                <Icon className="size-4 text-primary" />
              </div>
              <div>
                <p className="text-xl font-bold gradient-text">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Projects */}
      <div className="mt-8 space-y-10">
        {levels.map((level) => {
          const meta = LEVEL_COLORS[level];
          const LevelIcon = meta.icon;
          const projects = projectList.filter((p) => p.level === level);
          return (
            <section key={level}>
              <div className="flex items-center gap-3 mb-4">
                <div className={cn("size-8 rounded-xl grid place-items-center border", meta.badge)}>
                  <LevelIcon className="size-4" />
                </div>
                <h2 className="text-xl font-bold">{level} Projects</h2>
                <span className={cn("text-xs px-2.5 py-1 rounded-full border font-semibold", meta.badge)}>
                  {projects.length} projects
                </span>
              </div>
              <div className="space-y-4">
                {projects.map((p) => <ProjectCard key={p.title} p={p} />)}
              </div>
            </section>
          );
        })}
      </div>
    </AppShell>
  );
}
