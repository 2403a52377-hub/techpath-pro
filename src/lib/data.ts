import type { Domain } from "./auth";

export const DOMAINS: Domain[] = [
  "Full Stack Development",
  "Frontend Development",
  "Backend Development",
  "Data Analytics",
  "Data Science",
  "Artificial Intelligence",
  "Machine Learning",
  "Cybersecurity",
  "Cloud Computing",
  "DevOps",
  "Mobile App Development",
  "UI/UX Design",
  "Software Testing",
  "Blockchain",
];

export const COMPANIES = [
  {
    slug: "google",
    name: "Google",
    color: "from-blue-500 to-red-500",
    role: "SDE",
    ctc: "₹45 LPA",
  },
  {
    slug: "amazon",
    name: "Amazon",
    color: "from-orange-400 to-yellow-500",
    role: "SDE-1",
    ctc: "₹44 LPA",
  },
  {
    slug: "microsoft",
    name: "Microsoft",
    color: "from-sky-500 to-emerald-500",
    role: "SDE",
    ctc: "₹42 LPA",
  },
  {
    slug: "tcs",
    name: "TCS",
    color: "from-blue-600 to-indigo-700",
    role: "Digital",
    ctc: "₹7.5 LPA",
  },
  {
    slug: "infosys",
    name: "Infosys",
    color: "from-indigo-500 to-violet-600",
    role: "SE",
    ctc: "₹6.5 LPA",
  },
  {
    slug: "accenture",
    name: "Accenture",
    color: "from-purple-500 to-pink-500",
    role: "ASE",
    ctc: "₹6.5 LPA",
  },
  {
    slug: "wipro",
    name: "Wipro",
    color: "from-emerald-500 to-cyan-500",
    role: "PA",
    ctc: "₹6.5 LPA",
  },
  {
    slug: "cognizant",
    name: "Cognizant",
    color: "from-blue-500 to-cyan-500",
    role: "GenC",
    ctc: "₹7 LPA",
  },
];

export interface RoadmapStage {
  title: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  skills: { name: string; youtube: string; done?: boolean }[];
}

export const ROADMAPS: Record<
  string,
  { name: string; tagline: string; duration: string; stages: RoadmapStage[] }
> = {
  "full-stack": {
    name: "Full Stack Developer",
    tagline: "Master end-to-end web development",
    duration: "6-9 months",
    stages: [
      {
        title: "Foundations",
        level: "Beginner",
        skills: [
          {
            name: "HTML5 & Semantic Web",
            youtube: "https://www.youtube.com/results?search_query=html+full+course",
          },
          {
            name: "CSS3 & Flex/Grid",
            youtube: "https://www.youtube.com/results?search_query=css+full+course",
          },
          {
            name: "JavaScript ES6+",
            youtube: "https://www.youtube.com/results?search_query=javascript+full+course",
          },
          {
            name: "Git & GitHub",
            youtube: "https://www.youtube.com/results?search_query=git+github+tutorial",
          },
        ],
      },
      {
        title: "Frontend Frameworks",
        level: "Intermediate",
        skills: [
          {
            name: "React.js",
            youtube: "https://www.youtube.com/results?search_query=react+full+course",
          },
          {
            name: "TypeScript",
            youtube: "https://www.youtube.com/results?search_query=typescript+tutorial",
          },
          {
            name: "Tailwind CSS",
            youtube: "https://www.youtube.com/results?search_query=tailwind+css+crash+course",
          },
          {
            name: "Next.js / TanStack",
            youtube: "https://www.youtube.com/results?search_query=nextjs+tutorial",
          },
        ],
      },
      {
        title: "Backend & Database",
        level: "Intermediate",
        skills: [
          {
            name: "Node.js + Express",
            youtube: "https://www.youtube.com/results?search_query=node+express+tutorial",
          },
          {
            name: "REST & GraphQL APIs",
            youtube: "https://www.youtube.com/results?search_query=rest+api+tutorial",
          },
          {
            name: "PostgreSQL / MongoDB",
            youtube: "https://www.youtube.com/results?search_query=postgresql+tutorial",
          },
          {
            name: "Authentication & JWT",
            youtube: "https://www.youtube.com/results?search_query=jwt+authentication",
          },
        ],
      },
      {
        title: "Production & Scale",
        level: "Advanced",
        skills: [
          {
            name: "Docker & CI/CD",
            youtube: "https://www.youtube.com/results?search_query=docker+tutorial",
          },
          {
            name: "AWS / Vercel deploy",
            youtube: "https://www.youtube.com/results?search_query=aws+deploy+web+app",
          },
          {
            name: "System Design Basics",
            youtube: "https://www.youtube.com/results?search_query=system+design+basics",
          },
          {
            name: "Testing (Jest/Playwright)",
            youtube: "https://www.youtube.com/results?search_query=jest+playwright+testing",
          },
        ],
      },
    ],
  },
  frontend: {
    name: "Frontend Developer",
    tagline: "Craft delightful user interfaces",
    duration: "4-6 months",
    stages: [
      {
        title: "Web Basics",
        level: "Beginner",
        skills: [
          {
            name: "HTML & Accessibility",
            youtube: "https://youtube.com/results?search_query=html+accessibility",
          },
          { name: "Modern CSS", youtube: "https://youtube.com/results?search_query=modern+css" },
          {
            name: "Responsive Design",
            youtube: "https://youtube.com/results?search_query=responsive+design",
          },
        ],
      },
      {
        title: "JavaScript Mastery",
        level: "Intermediate",
        skills: [
          {
            name: "JavaScript Deep Dive",
            youtube: "https://youtube.com/results?search_query=javascript+deep+dive",
          },
          {
            name: "DOM & Events",
            youtube: "https://youtube.com/results?search_query=javascript+dom",
          },
          {
            name: "Async / Fetch",
            youtube: "https://youtube.com/results?search_query=javascript+async",
          },
        ],
      },
      {
        title: "React Ecosystem",
        level: "Advanced",
        skills: [
          { name: "React", youtube: "https://youtube.com/results?search_query=react+course" },
          {
            name: "State Management",
            youtube: "https://youtube.com/results?search_query=zustand+redux",
          },
          {
            name: "Animations (Framer Motion)",
            youtube: "https://youtube.com/results?search_query=framer+motion",
          },
        ],
      },
    ],
  },
  backend: {
    name: "Backend Developer",
    tagline: "Build scalable server-side systems",
    duration: "5-7 months",
    stages: [
      {
        title: "Language & Tools",
        level: "Beginner",
        skills: [
          {
            name: "Node.js / Python / Java",
            youtube: "https://youtube.com/results?search_query=nodejs+tutorial",
          },
          {
            name: "Git & Linux CLI",
            youtube: "https://youtube.com/results?search_query=linux+cli",
          },
        ],
      },
      {
        title: "APIs & Databases",
        level: "Intermediate",
        skills: [
          { name: "REST APIs", youtube: "https://youtube.com/results?search_query=rest+api" },
          { name: "PostgreSQL", youtube: "https://youtube.com/results?search_query=postgresql" },
          {
            name: "Redis Caching",
            youtube: "https://youtube.com/results?search_query=redis+tutorial",
          },
        ],
      },
      {
        title: "Distributed Systems",
        level: "Advanced",
        skills: [
          {
            name: "Microservices",
            youtube: "https://youtube.com/results?search_query=microservices",
          },
          {
            name: "Message Queues",
            youtube: "https://youtube.com/results?search_query=kafka+rabbitmq",
          },
          {
            name: "System Design",
            youtube: "https://youtube.com/results?search_query=system+design",
          },
        ],
      },
    ],
  },
  "data-analyst": {
    name: "Data Analyst",
    tagline: "Turn raw data into business decisions",
    duration: "4-6 months",
    stages: [
      {
        title: "Foundations",
        level: "Beginner",
        skills: [
          {
            name: "Excel / Google Sheets",
            youtube: "https://youtube.com/results?search_query=excel+for+data+analysis",
          },
          { name: "SQL Basics", youtube: "https://youtube.com/results?search_query=sql+tutorial" },
          {
            name: "Statistics 101",
            youtube: "https://youtube.com/results?search_query=statistics+for+data",
          },
        ],
      },
      {
        title: "Tools",
        level: "Intermediate",
        skills: [
          {
            name: "Python (Pandas)",
            youtube: "https://youtube.com/results?search_query=pandas+tutorial",
          },
          { name: "Power BI", youtube: "https://youtube.com/results?search_query=power+bi" },
          { name: "Tableau", youtube: "https://youtube.com/results?search_query=tableau" },
        ],
      },
      {
        title: "Advanced Analytics",
        level: "Advanced",
        skills: [
          { name: "A/B Testing", youtube: "https://youtube.com/results?search_query=ab+testing" },
          {
            name: "Data Storytelling",
            youtube: "https://youtube.com/results?search_query=data+storytelling",
          },
        ],
      },
    ],
  },
  "data-science": {
    name: "Data Scientist",
    tagline: "Build models that learn from data",
    duration: "8-12 months",
    stages: [
      {
        title: "Math & Python",
        level: "Beginner",
        skills: [
          {
            name: "Python",
            youtube: "https://youtube.com/results?search_query=python+for+data+science",
          },
          {
            name: "Linear Algebra",
            youtube: "https://youtube.com/results?search_query=linear+algebra",
          },
          {
            name: "Probability & Stats",
            youtube: "https://youtube.com/results?search_query=probability+statistics",
          },
        ],
      },
      {
        title: "ML Foundations",
        level: "Intermediate",
        skills: [
          {
            name: "Scikit-learn",
            youtube: "https://youtube.com/results?search_query=scikit+learn",
          },
          {
            name: "Feature Engineering",
            youtube: "https://youtube.com/results?search_query=feature+engineering",
          },
        ],
      },
      {
        title: "Deep Learning",
        level: "Advanced",
        skills: [
          {
            name: "PyTorch / TensorFlow",
            youtube: "https://youtube.com/results?search_query=pytorch+tutorial",
          },
          { name: "NLP / LLMs", youtube: "https://youtube.com/results?search_query=llm+course" },
        ],
      },
    ],
  },
  "ai-ml": {
    name: "AI / ML Engineer",
    tagline: "Productionize machine learning systems",
    duration: "9-12 months",
    stages: [
      {
        title: "Core ML",
        level: "Beginner",
        skills: [
          { name: "Python + Numpy", youtube: "https://youtube.com/results?search_query=numpy" },
          {
            name: "ML Algorithms",
            youtube: "https://youtube.com/results?search_query=ml+algorithms",
          },
        ],
      },
      {
        title: "Deep Learning",
        level: "Intermediate",
        skills: [
          {
            name: "Neural Networks",
            youtube: "https://youtube.com/results?search_query=neural+networks",
          },
          {
            name: "Computer Vision",
            youtube: "https://youtube.com/results?search_query=computer+vision",
          },
          {
            name: "Transformers",
            youtube: "https://youtube.com/results?search_query=transformers",
          },
        ],
      },
      {
        title: "MLOps",
        level: "Advanced",
        skills: [
          { name: "Model Deployment", youtube: "https://youtube.com/results?search_query=mlops" },
          {
            name: "Vector Databases",
            youtube: "https://youtube.com/results?search_query=vector+database",
          },
        ],
      },
    ],
  },
  cybersecurity: {
    name: "Cybersecurity Engineer",
    tagline: "Defend systems from modern threats",
    duration: "6-9 months",
    stages: [
      {
        title: "Fundamentals",
        level: "Beginner",
        skills: [
          {
            name: "Networking",
            youtube: "https://youtube.com/results?search_query=networking+basics",
          },
          { name: "Linux", youtube: "https://youtube.com/results?search_query=linux+for+hackers" },
        ],
      },
      {
        title: "Security Skills",
        level: "Intermediate",
        skills: [
          {
            name: "Ethical Hacking",
            youtube: "https://youtube.com/results?search_query=ethical+hacking",
          },
          {
            name: "Web Pentesting",
            youtube: "https://youtube.com/results?search_query=web+pentesting",
          },
        ],
      },
      {
        title: "Advanced",
        level: "Advanced",
        skills: [
          {
            name: "Cloud Security",
            youtube: "https://youtube.com/results?search_query=cloud+security",
          },
          { name: "SOC / SIEM", youtube: "https://youtube.com/results?search_query=soc+analyst" },
        ],
      },
    ],
  },
  cloud: {
    name: "Cloud Engineer",
    tagline: "Architect resilient cloud systems",
    duration: "5-7 months",
    stages: [
      {
        title: "Cloud Basics",
        level: "Beginner",
        skills: [
          {
            name: "AWS Core",
            youtube: "https://youtube.com/results?search_query=aws+for+beginners",
          },
          { name: "Linux & Bash", youtube: "https://youtube.com/results?search_query=linux+bash" },
        ],
      },
      {
        title: "Automation",
        level: "Intermediate",
        skills: [
          {
            name: "Terraform / IaC",
            youtube: "https://youtube.com/results?search_query=terraform",
          },
          { name: "Kubernetes", youtube: "https://youtube.com/results?search_query=kubernetes" },
        ],
      },
      {
        title: "Architecture",
        level: "Advanced",
        skills: [
          {
            name: "Solutions Architect",
            youtube: "https://youtube.com/results?search_query=aws+solutions+architect",
          },
        ],
      },
    ],
  },
  devops: {
    name: "DevOps Engineer",
    tagline: "Bridge development and operations",
    duration: "5-7 months",
    stages: [
      {
        title: "Foundations",
        level: "Beginner",
        skills: [
          { name: "Linux & Git", youtube: "https://youtube.com/results?search_query=linux+git" },
          {
            name: "Shell Scripting",
            youtube: "https://youtube.com/results?search_query=shell+scripting",
          },
        ],
      },
      {
        title: "CI/CD",
        level: "Intermediate",
        skills: [
          { name: "Docker", youtube: "https://youtube.com/results?search_query=docker" },
          {
            name: "GitHub Actions",
            youtube: "https://youtube.com/results?search_query=github+actions",
          },
          { name: "Kubernetes", youtube: "https://youtube.com/results?search_query=kubernetes" },
        ],
      },
      {
        title: "Observability",
        level: "Advanced",
        skills: [
          {
            name: "Prometheus + Grafana",
            youtube: "https://youtube.com/results?search_query=prometheus+grafana",
          },
        ],
      },
    ],
  },
  mobile: {
    name: "Mobile App Developer",
    tagline: "Ship apps to millions of devices",
    duration: "5-7 months",
    stages: [
      {
        title: "Basics",
        level: "Beginner",
        skills: [
          {
            name: "Dart / Kotlin / Swift",
            youtube: "https://youtube.com/results?search_query=dart+language",
          },
        ],
      },
      {
        title: "Frameworks",
        level: "Intermediate",
        skills: [
          { name: "Flutter", youtube: "https://youtube.com/results?search_query=flutter+tutorial" },
          {
            name: "React Native",
            youtube: "https://youtube.com/results?search_query=react+native",
          },
        ],
      },
      {
        title: "Production",
        level: "Advanced",
        skills: [
          {
            name: "App Store Deploy",
            youtube: "https://youtube.com/results?search_query=publish+app+store",
          },
        ],
      },
    ],
  },
};

export const PROJECTS_BY_LEVEL = {
  Beginner: [
    {
      title: "Personal Portfolio Website",
      duration: "1 week",
      skills: ["HTML", "CSS", "JS"],
      github: "https://github.com/topics/portfolio-website",
    },
    {
      title: "Todo App with LocalStorage",
      duration: "3 days",
      skills: ["React", "Hooks"],
      github: "https://github.com/topics/todo-app",
    },
    {
      title: "Weather Dashboard",
      duration: "5 days",
      skills: ["API", "Fetch"],
      github: "https://github.com/topics/weather-app",
    },
  ],
  Intermediate: [
    {
      title: "E-commerce Storefront",
      duration: "3 weeks",
      skills: ["React", "Stripe", "DB"],
      github: "https://github.com/topics/ecommerce",
    },
    {
      title: "Realtime Chat App",
      duration: "2 weeks",
      skills: ["WebSockets", "Auth"],
      github: "https://github.com/topics/chat-app",
    },
    {
      title: "Movie Recommender",
      duration: "2 weeks",
      skills: ["Python", "ML"],
      github: "https://github.com/topics/movie-recommendation",
    },
  ],
  Advanced: [
    {
      title: "AI SaaS Platform",
      duration: "6 weeks",
      skills: ["LLMs", "Payments", "Auth"],
      github: "https://github.com/topics/saas",
    },
    {
      title: "Distributed URL Shortener",
      duration: "4 weeks",
      skills: ["System Design", "Redis"],
      github: "https://github.com/topics/url-shortener",
    },
    {
      title: "Open-source Contribution",
      duration: "Ongoing",
      skills: ["Git", "Collab"],
      github: "https://github.com/explore",
    },
  ],
};

export const JOBS = [
  {
    role: "SDE Intern",
    company: "Google",
    location: "Bangalore",
    type: "Internship",
    stipend: "₹1.2L/mo",
    tags: ["Off-Campus", "6 months"],
  },
  {
    role: "Frontend Engineer",
    company: "Razorpay",
    location: "Remote",
    type: "Full-time",
    stipend: "₹18 LPA",
    tags: ["Fresher"],
  },
  {
    role: "Data Analyst Intern",
    company: "Flipkart",
    location: "Bangalore",
    type: "Internship",
    stipend: "₹60k/mo",
    tags: ["Summer"],
  },
  {
    role: "ML Engineer",
    company: "Sarvam AI",
    location: "Bangalore",
    type: "Full-time",
    stipend: "₹25 LPA",
    tags: ["Fresher", "AI"],
  },
  {
    role: "Cloud Engineer",
    company: "Amazon",
    location: "Hyderabad",
    type: "Full-time",
    stipend: "₹22 LPA",
    tags: ["Fresher"],
  },
  {
    role: "Cybersecurity Intern",
    company: "Microsoft",
    location: "Bangalore",
    type: "Internship",
    stipend: "₹80k/mo",
    tags: ["Summer"],
  },
];

export const MENTORS = [
  {
    name: "Ananya Sharma",
    role: "SDE-2 @ Google",
    expertise: "DSA, System Design",
    price: "Free",
    rating: 4.9,
  },
  {
    name: "Rohan Verma",
    role: "ML Engineer @ Sarvam AI",
    expertise: "ML, Research",
    price: "₹500/session",
    rating: 4.8,
  },
  {
    name: "Priya Iyer",
    role: "PM @ Microsoft",
    expertise: "Product, Career",
    price: "₹800/session",
    rating: 5.0,
  },
  {
    name: "Karthik Nair",
    role: "Senior @ IIT Madras",
    expertise: "Placements",
    price: "Free",
    rating: 4.7,
  },
  {
    name: "Sneha Reddy",
    role: "SDE @ Amazon",
    expertise: "Behavioral, Interviews",
    price: "₹400/session",
    rating: 4.9,
  },
  {
    name: "Aditya Mehta",
    role: "Founding Eng @ YC Startup",
    expertise: "Full Stack, Startups",
    price: "₹1000/session",
    rating: 5.0,
  },
];

export const CODING_PLATFORMS = [
  {
    name: "LeetCode",
    desc: "Patterns & company tagged problems",
    url: "https://leetcode.com",
    color: "from-yellow-400 to-orange-500",
  },
  {
    name: "HackerRank",
    desc: "Skill certifications & contests",
    url: "https://hackerrank.com",
    color: "from-emerald-400 to-green-600",
  },
  {
    name: "CodeChef",
    desc: "Indian competitive programming",
    url: "https://codechef.com",
    color: "from-amber-700 to-orange-800",
  },
  {
    name: "GeeksforGeeks",
    desc: "DSA, CS fundamentals",
    url: "https://geeksforgeeks.org",
    color: "from-green-500 to-emerald-700",
  },
];
