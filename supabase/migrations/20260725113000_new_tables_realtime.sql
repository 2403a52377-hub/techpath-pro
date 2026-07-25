-- ============================================================
-- NEW TABLES FOR TECHLAND REAL-TIME DATA
-- Run this entire block in Supabase SQL Editor
-- ============================================================

-- 1. MENTORS TABLE
CREATE TABLE IF NOT EXISTS public.mentors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  company text NOT NULL,
  location text,
  experience text,
  expertise text[],
  domains text[],
  bio text,
  education text,
  rating numeric DEFAULT 4.5,
  reviews integer DEFAULT 0,
  sessions_completed integer DEFAULT 0,
  linkedin_url text,
  languages text[],
  achievements text[],
  avatar text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active mentors" ON public.mentors
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage mentors" ON public.mentors
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- 2. MENTOR BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.mentor_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id uuid REFERENCES public.mentors(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  message text,
  preferred_time text,
  status text DEFAULT 'pending', -- pending, confirmed, cancelled, completed
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.mentor_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookings" ON public.mentor_bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookings" ON public.mentor_bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all bookings" ON public.mentor_bookings
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- 3. INTERVIEW QUESTIONS TABLE
CREATE TABLE IF NOT EXISTS public.interview_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL, -- 'Technical', 'HR', 'Behavioral'
  question text NOT NULL,
  hint text,
  sample_answer text,
  difficulty text DEFAULT 'Medium', -- Easy, Medium, Hard
  company text, -- optional: Google, Amazon, etc.
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.interview_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read interview questions" ON public.interview_questions
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage questions" ON public.interview_questions
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- 4. INTERVIEW SESSIONS TABLE (to persist scores)
CREATE TABLE IF NOT EXISTS public.interview_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  category text NOT NULL,
  score numeric NOT NULL,
  total_questions integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.interview_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own sessions" ON public.interview_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions" ON public.interview_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all sessions" ON public.interview_sessions
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- 5. FEEDBACK TABLE (if not already exists)
CREATE TABLE IF NOT EXISTS public.feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  type text NOT NULL, -- suggestion, experience, complaint
  rating integer,
  title text NOT NULL,
  message text NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  status text DEFAULT 'submitted', -- submitted, in-progress, fixed, published
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit feedback" ON public.feedback
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can read own feedback" ON public.feedback
  FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all feedback" ON public.feedback
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- SEED: 9 Default Mentors (from hardcoded data)
-- ============================================================
INSERT INTO public.mentors (name, role, company, location, experience, expertise, domains, bio, education, rating, reviews, sessions_completed, is_active)
VALUES
  ('Arjun Menon', 'Senior Software Engineer', 'Google', 'Bangalore', '6 years', ARRAY['React','System Design','DSA'], ARRAY['Full Stack','Data Structures'], 'Ex-Amazon engineer helping students crack top product companies.', 'IIT Madras, B.Tech CSE', 4.9, 127, 89, true),
  ('Priya Krishnaswamy', 'ML Research Engineer', 'Microsoft', 'Hyderabad', '4 years', ARRAY['Python','Machine Learning','AI'], ARRAY['AI/ML','Data Science'], 'Passionate about making AI accessible. Former GATE AIR 45.', 'IIT Bombay, M.Tech AI', 4.8, 93, 65, true),
  ('Rahul Agarwal', 'Full Stack Developer', 'Razorpay', 'Bangalore', '3 years', ARRAY['Node.js','React','PostgreSQL'], ARRAY['Full Stack','Backend'], 'Built features used by 10M+ users. Love teaching clean code practices.', 'NIT Trichy, B.Tech CSE', 4.7, 76, 54, true),
  ('Sneha Patil', 'Product Manager', 'Swiggy', 'Bangalore', '5 years', ARRAY['Product Strategy','Analytics','Roadmaps'], ARRAY['Product Management'], 'Helping engineers transition to PM roles. BITS Pilani alum.', 'BITS Pilani, B.Tech + MBA', 4.9, 112, 78, true),
  ('Karthik Subramaniam', 'DevOps Engineer', 'Freshworks', 'Chennai', '5 years', ARRAY['Docker','Kubernetes','AWS'], ARRAY['Cloud','DevOps'], 'AWS certified. Help students get into SRE and DevOps roles.', 'Anna University, B.Tech', 4.8, 64, 43, true),
  ('Divya Mehta', 'Data Scientist', 'Flipkart', 'Bangalore', '4 years', ARRAY['Python','SQL','Statistics'], ARRAY['Data Science','Analytics'], 'ISB alum. Helping students build strong analytics foundations.', 'IIM Bangalore + B.Tech', 4.7, 88, 61, true),
  ('Vikram Nair', 'Android Developer', 'PhonePe', 'Bangalore', '4 years', ARRAY['Android','Kotlin','Java'], ARRAY['Mobile Development'], 'GDE for Android. Open source contributor. Love mentoring mobile devs.', 'NITK Surathkal, B.Tech', 4.8, 54, 37, true),
  ('Ananya Sharma', 'UI/UX Designer', 'Meesho', 'Bangalore', '3 years', ARRAY['Figma','Design Systems','User Research'], ARRAY['Design'], 'NID graduate. Helping engineers develop design thinking skills.', 'NID Ahmedabad, Product Design', 4.9, 71, 49, true),
  ('Rohit Bansal', 'Competitive Programmer', 'Codeforces', 'Delhi', '2 years', ARRAY['C++','DSA','Competitive Programming'], ARRAY['DSA','Competitive Programming'], 'Codeforces Expert. ICPC regionalist. Loves helping students with CP.', 'DTU, B.Tech CSE', 4.6, 42, 28, true)
ON CONFLICT DO NOTHING;

-- ============================================================
-- SEED: Default Interview Questions
-- ============================================================
INSERT INTO public.interview_questions (category, question, hint, sample_answer, difficulty)
VALUES
  ('Technical', 'Explain the difference between SQL JOIN types.', 'Think about what rows are included/excluded.', 'INNER JOIN returns matching rows only. LEFT JOIN returns all left rows + matches. RIGHT JOIN is opposite. FULL OUTER JOIN returns all rows from both tables.', 'Medium'),
  ('Technical', 'What is the time complexity of HashMap operations?', 'Consider average vs worst case.', 'Average case O(1) for get/put. Worst case O(n) due to hash collisions. Space complexity O(n).', 'Easy'),
  ('Technical', 'Design a URL shortener like bit.ly.', 'Think about hashing, redirects, and scale.', 'Use base62 encoding for short codes stored in a key-value DB. Redirect via 301/302. Cache popular URLs. Consider rate limiting.', 'Hard'),
  ('Technical', 'What is the difference between process and thread?', 'Think about memory and isolation.', 'A process is an independent program with its own memory space. Threads share process memory. Context switching between threads is faster. Processes are more isolated.', 'Medium'),
  ('Technical', 'Explain REST API best practices.', 'Think about HTTP methods, status codes, versioning.', 'Use proper HTTP verbs (GET/POST/PUT/DELETE). Return meaningful status codes. Version APIs (/v1/). Use JSON. Implement pagination. Add rate limiting.', 'Medium'),
  ('Technical', 'What is the CAP theorem?', 'It applies to distributed systems.', 'Consistency, Availability, Partition Tolerance — distributed systems can only guarantee 2 of 3. During network partitions you choose between consistency (return error) or availability (return stale data).', 'Hard'),
  ('HR', 'Tell me about yourself.', 'Keep it professional and structured.', 'Start with education, then experience, then what you want next. Be concise — 90 seconds max. Tie your story to the role you''re applying for.', 'Easy'),
  ('HR', 'Why do you want to join our company?', 'Research the company before answering.', 'Mention specific products/values you admire. Connect them to your skills and goals. Avoid generic answers like "great company culture".', 'Easy'),
  ('HR', 'Where do you see yourself in 5 years?', 'Be honest but align with the company''s growth.', 'Talk about growing technical skills, taking on leadership, contributing to impactful projects. Show ambition but also commitment to the role.', 'Easy'),
  ('HR', 'What is your greatest weakness?', 'Be genuine — pick a real weakness with a growth plan.', 'Choose a real weakness that won''t disqualify you. Show self-awareness and explain what you''re doing to improve. Example: "I used to struggle with public speaking, so I joined Toastmasters."', 'Medium'),
  ('HR', 'Do you have any questions for us?', 'Always prepare 2-3 thoughtful questions.', 'Ask about team structure, current challenges, growth opportunities, or what success looks like in the first 90 days. Never say "No, I''m good."', 'Easy'),
  ('Behavioral', 'Tell me about a time you handled a difficult team member.', 'Use the STAR method.', 'Situation: Describe the conflict. Task: Your responsibility. Action: How you resolved it (communication, empathy). Result: Team improved, project delivered.', 'Medium'),
  ('Behavioral', 'Describe a project where you failed and what you learned.', 'Show growth mindset.', 'Choose a real failure. Explain what went wrong, what you learned, and how you applied that learning. Avoid blaming others.', 'Medium'),
  ('Behavioral', 'How do you handle tight deadlines?', 'Show prioritization skills.', 'Explain how you prioritize tasks (Eisenhower matrix or MoSCoW). Communicate early if scope needs to change. Give a real example where you delivered under pressure.', 'Medium'),
  ('Behavioral', 'Tell me about a time you showed leadership.', 'You don''t need a title to show leadership.', 'Leadership can be mentoring a teammate, driving a project decision, or organizing a team effort. Use STAR format. Focus on impact.', 'Medium'),
  ('Behavioral', 'Describe a situation where you had to learn something quickly.', 'Show adaptability.', 'Give a specific example: new tech stack, new domain, new team. Show what steps you took (docs, tutorials, asking experts) and how fast you became productive.', 'Easy')
ON CONFLICT DO NOTHING;
