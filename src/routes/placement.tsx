import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "./roadmaps.index";
import { COMPANIES } from "@/lib/data";
import {
  Brain,
  Calculator,
  MessageSquareText,
  FileText,
  ArrowRight,
  ExternalLink,
  BookOpen,
  Target,
  Trophy,
  Clock,
  CheckCircle2,
  Play,
  ChevronRight,
  ChevronLeft,
  TrendingUp,
  Star,
  Zap,
  Users,
  Timer,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/placement")({ component: PlacementMain });

/* ─────────────────────────────────────────────────────────── QUIZ DATA ──── */

type QuizQuestion = {
  q: string;
  options: string[];
  answer: number;
  explanation: string;
};

export const QUIZ_BANK: Record<string, QuizQuestion[]> = {
  "Quantitative Aptitude": [
    {
      q: "If 20% of a number is 40, what is 35% of that number?",
      options: ["60", "70", "80", "90"],
      answer: 1,
      explanation: "20% = 40 → number = 200. 35% of 200 = 70.",
    },
    {
      q: "A train 150m long passes a pole in 15 seconds. What is its speed in km/h?",
      options: ["30", "36", "40", "45"],
      answer: 1,
      explanation: "Speed = 150/15 = 10 m/s = 10 × 18/5 = 36 km/h.",
    },
    {
      q: "A man buys an article for ₹80 and sells it for ₹100. What is the profit %?",
      options: ["20%", "25%", "30%", "15%"],
      answer: 1,
      explanation: "Profit = 20. Profit% = (20/80) × 100 = 25%.",
    },
    {
      q: "If A can do a work in 10 days and B in 15 days, how many days together?",
      options: ["5", "6", "7", "8"],
      answer: 1,
      explanation: "Combined rate = 1/10 + 1/15 = 5/30 = 1/6. So 6 days.",
    },
    {
      q: "What is the probability of getting a head in a single coin flip?",
      options: ["1/4", "1/2", "1/3", "3/4"],
      answer: 1,
      explanation: "A fair coin has 2 outcomes. Heads = 1. P = 1/2.",
    },
    {
      q: "Find the LCM of 12 and 18.",
      options: ["24", "36", "48", "54"],
      answer: 1,
      explanation: "12 = 4×3, 18 = 2×9. LCM = 36.",
    },
    {
      q: "If the ratio of two numbers is 3:4 and their sum is 35, what is the larger number?",
      options: ["15", "20", "25", "10"],
      answer: 1,
      explanation: "3x + 4x = 35 → x = 5. Larger = 4×5 = 20.",
    },
    {
      q: "A sum triples in 10 years at simple interest. What is the rate?",
      options: ["15%", "20%", "25%", "30%"],
      answer: 1,
      explanation: "SI = 2P (triples). 2P = P×R×10/100 → R = 20%.",
    },
    {
      q: "Speed of boat in still water = 10 km/h, stream = 2 km/h. Upstream speed?",
      options: ["12", "10", "8", "6"],
      answer: 2,
      explanation: "Upstream = 10 – 2 = 8 km/h.",
    },
    {
      q: "Average of 5 numbers is 12. If one number is removed, average becomes 10. Removed?",
      options: ["16", "18", "20", "22"],
      answer: 2,
      explanation: "Total = 60. New total = 40. Removed = 60 – 40 = 20.",
    },
    {
      q: "What is the compound interest on ₹10,000 for 2 years at 10% per annum compounded annually?",
      options: ["₹2,000", "₹2,100", "₹2,200", "₹2,500"],
      answer: 1,
      explanation: "Amount = 10,000 × (1.1)² = ₹12,100. CI = 12,100 – 10,000 = ₹2,100.",
    },
    {
      q: "A car covers 300 km in 5 hours. How much time will it take to cover 480 km at the same speed?",
      options: ["6 hours", "7 hours", "8 hours", "9 hours"],
      answer: 2,
      explanation: "Speed = 300/5 = 60 km/h. Time = 480 / 60 = 8 hours.",
    },
    {
      q: "Two pipes A and B can fill a tank in 20 min and 30 min respectively. How long if both operate together?",
      options: ["10 min", "12 min", "15 min", "18 min"],
      answer: 1,
      explanation: "Rate = 1/20 + 1/30 = 5/60 = 1/12. Time = 12 minutes.",
    },
    {
      q: "In how many ways can the letters of the word 'LEADER' be arranged?",
      options: ["720", "360", "180", "120"],
      answer: 1,
      explanation: "6 letters with 'E' repeating twice = 6! / 2! = 720 / 2 = 360 ways.",
    },
    {
      q: "If 12 men or 18 women can reap a field in 14 days, in how many days can 8 men and 16 women reap it?",
      options: ["7 days", "9 days", "10 days", "12 days"],
      answer: 1,
      explanation: "12M = 18W → 1M = 1.5W. 8M + 16W = 28W. Time = (18 × 14) / 28 = 9 days.",
    },
    {
      q: "The product of two numbers is 2028 and their HCF is 13. How many such pairs exist?",
      options: ["1", "2", "3", "4"],
      answer: 1,
      explanation: "Let numbers be 13a and 13b. 13a × 13b = 2028 → ab = 12. Co-prime pairs (a,b): (1,12) and (3,4). Total = 2 pairs.",
    },
    {
      q: "A bag contains 4 red and 6 blue balls. What is the probability of drawing 2 red balls together?",
      options: ["2/15", "4/15", "1/5", "2/9"],
      answer: 0,
      explanation: "P = ⁴C₂ / ¹⁰C₂ = 6 / 45 = 2/15.",
    },
    {
      q: "A person sells two chairs for ₹900 each, gaining 10% on one and losing 10% on the other. Overall result?",
      options: ["No loss no gain", "1% loss", "1% gain", "2% loss"],
      answer: 1,
      explanation: "When selling price is same with same % gain/loss x, net result is always loss of (x/10)² % = (10/10)² % = 1% loss.",
    },
    {
      q: "What is 45% of 280 + 28% of 450?",
      options: ["242", "252", "262", "272"],
      answer: 1,
      explanation: "Note that a% of b = b% of a. So 45% of 280 + 28% of 450 = 2 × (45% of 280) = 2 × 126 = 252.",
    },
    {
      q: "Present ages of X and Y are in ratio 4:5. After 5 years, ratio becomes 5:6. What is X's present age?",
      options: ["15 years", "20 years", "25 years", "30 years"],
      answer: 1,
      explanation: "(4x+5)/(5x+5) = 5/6 → 24x + 30 = 25x + 25 → x = 5. X's age = 4 × 5 = 20 years.",
    },
    {
      q: "Find the single discount equivalent to successive discounts of 20% and 10%.",
      options: ["28%", "30%", "25%", "32%"],
      answer: 0,
      explanation: "Equivalent discount = 20 + 10 – (20×10)/100 = 30 – 2 = 28%.",
    },
    {
      q: "A 200-liter mixture of milk and water contains 10% water. How much water must be added to make it 20% water?",
      options: ["20 liters", "25 liters", "30 liters", "15 liters"],
      answer: 1,
      explanation: "Milk = 180L. New mixture total = 180 / 0.8 = 225L. Water to add = 225 – 200 = 25 liters.",
    },
    {
      q: "The mean of 10 observations is 15. If each observation is multiplied by 3, what is the new mean?",
      options: ["15", "30", "45", "60"],
      answer: 2,
      explanation: "Multiplying each observation by k multiplies the mean by k. New mean = 15 × 3 = 45.",
    },
    {
      q: "In what ratio must tea at ₹60/kg be mixed with tea at ₹75/kg to get a mixture worth ₹65/kg?",
      options: ["1:2", "2:1", "3:2", "2:3"],
      answer: 1,
      explanation: "By allegation: (75 – 65) : (65 – 60) = 10 : 5 = 2 : 1.",
    },
    {
      q: "What is the angle between the hour hand and minute hand of a clock at 3:30?",
      options: ["75°", "80°", "85°", "90°"],
      answer: 0,
      explanation: "Angle = |30H – 5.5M| = |30(3) – 5.5(30)| = |90 – 165| = 75°.",
    },
    {
      q: "If log₂ x = 5, what is the value of x?",
      options: ["10", "25", "32", "64"],
      answer: 2,
      explanation: "log₂ x = 5 → x = 2⁵ = 32.",
    },
    {
      q: "A vendor sells 6 lemons for ₹10 and buys them at 4 lemons for ₹5. What is his profit %?",
      options: ["25%", "33.3%", "20%", "40%"],
      answer: 1,
      explanation: "CP per lemon = 5/4 = ₹1.25. SP per lemon = 10/6 = ₹1.67. Profit% = (0.42 / 1.25) × 100 = 33.3%.",
    },
    {
      q: "Find the unit digit of (7¹⁰⁵).",
      options: ["1", "3", "7", "9"],
      answer: 2,
      explanation: "Unit digits of 7 have cyclicity 4 (7, 9, 3, 1). 105 mod 4 = 1. So unit digit is 7¹ = 7.",
    },
    {
      q: "A works twice as fast as B. If B takes 12 days to complete a job, how many days will A and B take together?",
      options: ["3 days", "4 days", "6 days", "8 days"],
      answer: 1,
      explanation: "B takes 12 days → A takes 6 days. Rate = 1/6 + 1/12 = 3/12 = 1/4. Together = 4 days.",
    },
    {
      q: "A square field has an area of 625 sq m. What is the length of its diagonal?",
      options: ["25m", "25√2 m", "30m", "50m"],
      answer: 1,
      explanation: "Side = √625 = 25m. Diagonal = side × √2 = 25√2 m.",
    },
    {
      q: "How many numbers between 100 and 300 are divisible by both 3 and 5?",
      options: ["11", "12", "13", "14"],
      answer: 2,
      explanation: "Divisible by 15. First = 105, last = 285. Count = (285 - 105)/15 + 1 = 12 + 1 = 13 numbers.",
    },
    {
      q: "A box contains 5 white, 4 red and 3 black balls. Two balls are drawn at random. What is probability that neither is red?",
      options: ["14/33", "7/22", "13/33", "5/12"],
      answer: 0,
      explanation: "Non-red balls = 8. Total = 12. P = ⁸C₂ / ¹²C₂ = 28 / 66 = 14/33.",
    },
  ],
  "Logical Reasoning": [
    {
      q: "Find the next in series: 2, 6, 12, 20, 30, ?",
      options: ["40", "42", "44", "46"],
      answer: 1,
      explanation: "Differences: 4, 6, 8, 10, 12. Next = 30 + 12 = 42.",
    },
    {
      q: "If A is B's sister, B is C's brother, C is D's father. How is A related to D?",
      options: ["Aunt", "Mother", "Sister", "Grandmother"],
      answer: 0,
      explanation: "A → sister of B → B is C's brother → C is D's father. A is D's aunt.",
    },
    {
      q: "All dogs are animals. All animals have cells. Therefore?",
      options: ["All dogs have cells", "Some dogs have cells", "No dogs have cells", "None"],
      answer: 0,
      explanation: "This is a valid syllogism. All dogs are animals with cells → All dogs have cells.",
    },
    {
      q: "BDFH : ACEG :: JLNP : ?",
      options: ["IKMO", "KMOP", "KNPR", "LMNO"],
      answer: 0,
      explanation: "BDFH are even letters; ACEG are odd letters before them. JLNP even → IKMO odd.",
    },
    {
      q: "A is taller than B. C is shorter than D. D is shorter than A. Who is shortest?",
      options: ["A", "B", "C", "D"],
      answer: 1,
      explanation: "Order: A > D > C. A > B. Without comparing B and C, B could be shortest.",
    },
    {
      q: "If MANGO is coded as OCPIQ, what is APPLE?",
      options: ["CRRNG", "CQQNG", "CRQNG", "CRNNG"],
      answer: 0,
      explanation: "Each letter is shifted +2. A→C, P→R, P→R, L→N, E→G = CRRNG.",
    },
    {
      q: "5 men take 6 days to complete a task. How many men to finish in 3 days?",
      options: ["8", "10", "12", "15"],
      answer: 1,
      explanation: "5 × 6 = 30 man-days. 30 / 3 = 10 men.",
    },
    {
      q: "Which word cannot be made from COMPUTER? COPE / CUTE / MUTE / MOLE",
      options: ["COPE", "CUTE", "MUTE", "MOLE"],
      answer: 3,
      explanation: "MOLE needs an L, which is not in COMPUTER.",
    },
    {
      q: "Arrange in order: Sentence, Letter, Word, Paragraph",
      options: [
        "Letter, Word, Sentence, Paragraph",
        "Word, Letter, Sentence, Paragraph",
        "Letter, Sentence, Word, Paragraph",
        "Paragraph, Sentence, Word, Letter",
      ],
      answer: 0,
      explanation: "Smallest to largest: Letter → Word → Sentence → Paragraph.",
    },
    {
      q: "If 6 = 66, 7 = 77, 8 = 88, then 9 = ?",
      options: ["89", "98", "99", "109"],
      answer: 2,
      explanation: "Pattern: n = n concatenated twice. 9 = 99.",
    },
    {
      q: "Find the odd one out: 3, 5, 7, 9, 11, 13",
      options: ["3", "7", "9", "13"],
      answer: 2,
      explanation: "9 is a composite number (3×3), whereas all others are prime numbers.",
    },
    {
      q: "If CLOCK is written as KCOLC, how is SYSTEM written?",
      options: ["METSYS", "SYSMET", "METSSY", "SYSTEM"],
      answer: 0,
      explanation: "The word is simply reversed letter by letter. SYSTEM → METSYS.",
    },
    {
      q: "Pointing to a photograph, Rohit said 'She is the daughter of my grandfather's only son.' How is Rohit related to the girl?",
      options: ["Brother", "Uncle", "Cousin", "Father"],
      answer: 0,
      explanation: "Grandfather's only son = Rohit's father. Father's daughter = Rohit's sister. So Rohit is her brother.",
    },
    {
      q: "A person walks 5 km North, turns right and walks 3 km, turns right and walks 5 km. How far is he from starting point?",
      options: ["3 km", "5 km", "8 km", "0 km"],
      answer: 0,
      explanation: "5km North + 5km South cancel out. He is 3 km East from starting point.",
    },
    {
      q: "In a class of 45 students, Riya is ranked 15th from the top. What is her rank from the bottom?",
      options: ["30th", "31st", "32nd", "29th"],
      answer: 1,
      explanation: "Rank from bottom = (Total – Rank from top) + 1 = (45 – 15) + 1 = 31st.",
    },
    {
      q: "Find the missing number in series: 7, 10, 8, 11, 9, 12, ?",
      options: ["7", "10", "12", "13"],
      answer: 1,
      explanation: "Two alternating series: (7, 8, 9, 10) and (10, 11, 12). Next element belongs to first series → 10.",
    },
    {
      q: "If '+' means '×', '–' means '÷', '×' means '–', and '÷' means '+', what is 15 – 3 + 4 × 6 ÷ 2?",
      options: ["16", "18", "20", "22"],
      answer: 0,
      explanation: "Expression = 15 ÷ 3 × 4 – 6 + 2 = 5 × 4 – 6 + 2 = 20 – 6 + 2 = 16.",
    },
    {
      q: "Statement: 'Some books are pens. All pens are pencils.' Conclusion: 'I. Some books are pencils.'",
      options: ["Only I follows", "Only II follows", "Neither follows", "Both follow"],
      answer: 0,
      explanation: "Books overlapping with pens which are inside pencils means some books are definitely pencils.",
    },
    {
      q: "If TODAY is written as UQEBZ, how is BEFORE written?",
      options: ["CFGPSF", "CFGPRF", "CDGPSE", "CFHQSF"],
      answer: 0,
      explanation: "Pattern: +1, +1, +1, +1, +1 on each letter. B→C, E→F, F→G, O→P, R→S, E→F = CFGPSF.",
    },
    {
      q: "Five friends A, B, C, D, E are sitting in a circle facing the center. A is right of B. E is between B and C. Who is left of B?",
      options: ["A", "C", "D", "E"],
      answer: 3,
      explanation: "E is between B and C → E is adjacent to B. Since A is to the right of B, E must be to the left of B.",
    },
    {
      q: "If CAT = 24 and DOG = 26, then PIG = ?",
      options: ["32", "30", "34", "28"],
      answer: 0,
      explanation: "Sum of alphabetical positions: P(16) + I(9) + G(7) = 32.",
    },
    {
      q: "Statement: 'No apple is a mango. All mangoes are sweet.' Conclusion: 'I. Some sweet things are not apples.'",
      options: ["Only I follows", "Only II follows", "Neither follows", "Both follow"],
      answer: 0,
      explanation: "Mangoes are sweet and no mango is an apple. Thus those sweet things (mangoes) are not apples.",
    },
    {
      q: "Look at this series: 36, 34, 30, 28, 24, ... What number should come next?",
      options: ["20", "22", "23", "26"],
      answer: 1,
      explanation: "Pattern: subtract 2, subtract 4, subtract 2, subtract 4... 24 – 2 = 22.",
    },
    {
      q: "Which letter is 5th to the right of the 12th letter from the left in the English alphabet?",
      options: ["P", "Q", "R", "S"],
      answer: 1,
      explanation: "12 + 5 = 17th letter of alphabet = Q.",
    },
    {
      q: "If South-East becomes North, North-East becomes West, then what will West become?",
      options: ["North-East", "South-East", "South-West", "North-West"],
      answer: 1,
      explanation: "All directions rotate 135° anti-clockwise. West + 135° anti-clockwise = South-East.",
    },
    {
      q: "In a certain code language, '123' means 'bright little boy' and '145' means 'tall big boy'. Which digit means 'boy'?",
      options: ["1", "2", "3", "4"],
      answer: 0,
      explanation: "Common digit in '123' and '145' is 1, common word is 'boy'. So 1 means 'boy'.",
    },
    {
      q: "Find the odd pair out:",
      options: ["Cow : Calf", "Dog : Puppy", "Lion : Cub", "Cat : Kitten"],
      answer: 0,
      explanation: "All are adult animal and young offspring pairs.",
    },
    {
      q: "Statement: 'All cars are fast. Some fast things are expensive.' Which conclusion is valid?",
      options: ["All cars are expensive", "Some cars are expensive", "No car is expensive", "None of these necessarily follow"],
      answer: 3,
      explanation: "The set of expensive things might not overlap with cars. None necessarily follow.",
    },
    {
      q: "If 1st January 2024 was Monday, what day was 1st January 2025?",
      options: ["Tuesday", "Wednesday", "Thursday", "Friday"],
      answer: 1,
      explanation: "2024 is a leap year (366 days = 52 weeks + 2 odd days). Monday + 2 = Wednesday.",
    },
    {
      q: "Six people P, Q, R, S, T, U sit in a row. T is between P and R. Q is next to U. P is left of T. Who is on the extreme right if S is far left?",
      options: ["U", "Q", "R", "T"],
      answer: 1,
      explanation: "Arrangement: S P T R U Q. Extreme right person is Q.",
    },
    {
      q: "Which diagram best represents: India, Delhi, Asia?",
      options: ["Three concentric circles", "Two separate circles inside one", "Three overlapping circles", "Disjoint circles"],
      answer: 0,
      explanation: "Delhi is inside India, which is inside Asia → 3 concentric circles.",
    },
    {
      q: "If 'MONKEY' is coded as 'XDJMNL', how is 'TIGER' coded?",
      options: ["QDFHS", "SDFHS", "SHFDQ", "QDFRH"],
      answer: 0,
      explanation: "Reverse order and subtract 1 from each letter. R-1=Q, E-1=D, G-1=F, I-1=H, T-1=S → QDFHS.",
    },
  ],
  "Verbal Ability": [
    {
      q: "Choose the synonym of BENEVOLENT:",
      options: ["Cruel", "Kind", "Angry", "Lazy"],
      answer: 1,
      explanation: "Benevolent means kind and generous.",
    },
    {
      q: "Choose the antonym of LOQUACIOUS:",
      options: ["Talkative", "Verbose", "Taciturn", "Garrulous"],
      answer: 2,
      explanation: "Loquacious = very talkative. Antonym = taciturn (reserved, not talkative).",
    },
    {
      q: "Fill in the blank: She is __ European.",
      options: ["a", "an", "the", "no article"],
      answer: 0,
      explanation: "'European' begins with a consonant sound (yoo-ro), so 'a' is correct.",
    },
    {
      q: "Identify the error: 'He don't know the answer.'",
      options: ["He", "don't", "know", "answer"],
      answer: 1,
      explanation: "For third-person singular, use 'doesn't' instead of 'don't'.",
    },
    {
      q: "Choose the word closest in meaning to EPHEMERAL:",
      options: ["Permanent", "Transient", "Solid", "Deep"],
      answer: 1,
      explanation: "Ephemeral = lasting for a very short time. Synonym = transient.",
    },
    {
      q: "Rearrange: 'market / goes / she / every / to / day / the'",
      options: [
        "She goes to the market every day",
        "She every day goes to the market",
        "Every day market she goes to the",
        "She goes every market the day to",
      ],
      answer: 0,
      explanation: "Correct sentence: She goes to the market every day.",
    },
    {
      q: "Which is the correct spelling?",
      options: ["Accomodation", "Accommodation", "Acommodation", "Accomadation"],
      answer: 1,
      explanation: "Correct: Accommodation (double 'c' and double 'm').",
    },
    {
      q: "Choose the correctly punctuated sentence:",
      options: [
        "Its a beautiful day, isn't it.",
        "It's a beautiful day, isn't it?",
        "Its a beautiful day isn't it?",
        "It's a beautiful day isnt it?",
      ],
      answer: 1,
      explanation: "It's = it is (apostrophe needed). 'isn't it?' needs a question mark.",
    },
    {
      q: "Identify the passive voice: 'The book was written by her.'",
      options: ["Active", "Passive", "Imperative", "Interrogative"],
      answer: 1,
      explanation: "The subject (book) receives the action — this is passive voice.",
    },
    {
      q: "Select the correct one-word substitute: 'One who knows everything'",
      options: ["Omnipotent", "Omniscient", "Omnivore", "Omnipresent"],
      answer: 1,
      explanation: "Omniscient = knowing everything. Omnipotent = all-powerful.",
    },
    {
      q: "Choose the antonym of CANDID:",
      options: ["Frank", "Outspoken", "Deceitful", "Honest"],
      answer: 2,
      explanation: "Candid = truthful and straightforward. Antonym = deceitful or secretive.",
    },
    {
      q: "Fill in the blank: Neither the teacher nor the students __ present today.",
      options: ["was", "were", "is", "has"],
      answer: 1,
      explanation: "When subjects are joined by 'neither... nor', the verb agrees with the subject closest to it ('students' → plural 'were').",
    },
    {
      q: "What does the idiom 'Bite the bullet' mean?",
      options: ["Eat quickly", "Face a difficult situation with courage", "Start a fight", "Shoot an arrow"],
      answer: 1,
      explanation: "'Bite the bullet' means to endure a painful or difficult situation with courage.",
    },
    {
      q: "Choose the correct word: The news __ shocking to everyone.",
      options: ["was", "were", "are", "have been"],
      answer: 0,
      explanation: "'News' is an uncountable singular noun, so singular verb 'was' is used.",
    },
    {
      q: "Select the synonym of PRAGMATIC:",
      options: ["Idealistic", "Practical", "Theoretical", "Fanciful"],
      answer: 1,
      explanation: "Pragmatic means dealing with things sensibly and realistically (practical).",
    },
    {
      q: "Identify the correctly spelled word:",
      options: ["Mischievous", "Mischievous", "Mischevious", "Mischivous"],
      answer: 0,
      explanation: "Correct spelling is Mischievous (m-i-s-c-h-i-e-v-o-u-s).",
    },
    {
      q: "One who looks at the bright side of things is called a/an:",
      options: ["Pessimist", "Optimist", "Atheist", "Altruist"],
      answer: 1,
      explanation: "Optimist = someone who expects the best outcome. Pessimist = expects worst.",
    },
    {
      q: "Fill in the blank: I have been living in this city __ 2018.",
      options: ["for", "since", "from", "in"],
      answer: 1,
      explanation: "Use 'since' with specific starting points of time in perfect continuous tenses.",
    },
    {
      q: "What is the meaning of 'To burn the midnight oil'?",
      options: ["Cause a fire", "Work or study late into the night", "Waste resources", "Sleep early"],
      answer: 1,
      explanation: "'Burn the midnight oil' means to study or work late into the night.",
    },
    {
      q: "Choose the antonym of METICULOUS:",
      options: ["Careful", "Careless", "Thorough", "Precise"],
      answer: 1,
      explanation: "Meticulous = showing great attention to detail. Antonym = careless.",
    },
    {
      q: "Choose the synonym of GREGARIOUS:",
      options: ["Sociable", "Solitary", "Shy", "Hostile"],
      answer: 0,
      explanation: "Gregarious = fond of company; sociable.",
    },
    {
      q: "Select the correct idiom: 'To spill the beans' means to:",
      options: ["Cook food", "Reveal a secret accidentally", "Drop groceries", "Plant seeds"],
      answer: 1,
      explanation: "'Spill the beans' means to reveal secret information.",
    },
    {
      q: "Fill in the blank: He is addicted __ playing online games.",
      options: ["with", "to", "for", "in"],
      answer: 1,
      explanation: "The preposition 'to' follows the word 'addicted'.",
    },
    {
      q: "Identify the part with an error: 'Each of the girls (A) / have done (B) / their homework (C).'",
      options: ["Part A", "Part B", "Part C", "No error"],
      answer: 1,
      explanation: "'Each' is singular, so it requires 'has done' instead of 'have done'.",
    },
    {
      q: "Choose the antonym of AMBIGUOUS:",
      options: ["Unclear", "Vague", "Clear", "Obscure"],
      answer: 2,
      explanation: "Ambiguous = open to more than one interpretation; unclear. Antonym = clear.",
    },
    {
      q: "One who speaks many languages is called a:",
      options: ["Polyglot", "Linguist", "Grammarian", "Orator"],
      answer: 0,
      explanation: "A polyglot is a person who knows and uses several languages.",
    },
    {
      q: "Select the sentence with correct subject-verb agreement:",
      options: [
        "Bread and butter is my favorite breakfast.",
        "Bread and butter are my favorite breakfast.",
        "Bread and butter were my favorite breakfast.",
        "Bread and butter have my favorite breakfast.",
      ],
      answer: 0,
      explanation: "When two nouns express a single idea (bread and butter as a meal), use a singular verb 'is'.",
    },
    {
      q: "Choose the synonym of OBSCURE:",
      options: ["Famous", "Unclear", "Bright", "Obvious"],
      answer: 1,
      explanation: "Obscure means not discovered or known about; uncertain/unclear.",
    },
    {
      q: "Fill in the blank: If I __ rich, I would buy a luxury yacht.",
      options: ["am", "was", "were", "had been"],
      answer: 2,
      explanation: "In hypothetical/unreal conditions (subjunctive mood), use 'were' for all subjects.",
    },
    {
      q: "What does 'A blessing in disguise' mean?",
      options: ["A bad event that turns out to have good results", "A religious ceremony", "A secret gift", "A sudden surprise"],
      answer: 0,
      explanation: "'A blessing in disguise' refers to an apparent misfortune that eventually results in something good.",
    },
    {
      q: "Identify the correctly spelled word:",
      options: ["Entrepreneur", "Enterprenuer", "Entreprenur", "Entrepreneure"],
      answer: 0,
      explanation: "Correct spelling: Entrepreneur (E-n-t-r-e-p-r-e-n-e-u-r).",
    },
    {
      q: "Choose the antonym of BENIGN:",
      options: ["Gentle", "Harmless", "Malignant", "Friendly"],
      answer: 2,
      explanation: "Benign = gentle and kindly / not harmful. Antonym = malignant or harmful.",
    },
  ],
  "Technical & CS Fundamentals": [
    {
      q: "Which data structure operates on a First In, First Out (FIFO) basis?",
      options: ["Stack", "Queue", "Tree", "Graph"],
      answer: 1,
      explanation: "Queue operates on FIFO principle (First In, First Out), whereas Stack is LIFO.",
    },
    {
      q: "What is the time complexity of searching an element in a balanced Binary Search Tree (BST)?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
      answer: 1,
      explanation: "Search time in a balanced BST (like AVL tree) is O(log n).",
    },
    {
      q: "In Relational Database Management Systems (RDBMS), what does ACID stand for?",
      options: [
        "Atomicity, Consistency, Isolation, Durability",
        "Accuracy, Control, Integration, Data",
        "Availability, Concurrency, Indexing, Data",
        "Algorithm, Computation, Input, Output",
      ],
      answer: 0,
      explanation: "ACID guarantees database transaction reliability: Atomicity, Consistency, Isolation, Durability.",
    },
    {
      q: "Which HTTP status code signifies 'Not Found'?",
      options: ["200", "301", "404", "500"],
      answer: 2,
      explanation: "404 is the standard HTTP status code for resource Not Found.",
    },
    {
      q: "Which layer of the OSI model handles routing and packet forwarding?",
      options: ["Data Link Layer", "Network Layer", "Transport Layer", "Session Layer"],
      answer: 1,
      explanation: "Network Layer (Layer 3) handles IP addressing, packet forwarding, and routing.",
    },
    {
      q: "What is deadlock in Operating Systems?",
      options: [
        "A situation where two or more processes are waiting infinitely for resources held by each other",
        "When a process finishes execution",
        "When memory is full",
        "When CPU speed drops to 0",
      ],
      answer: 0,
      explanation: "Deadlock occurs when processes are blocked forever because each holds a resource the other needs.",
    },
    {
      q: "Which OOP concept allows a subclass to provide a specific implementation of a method defined in its superclass?",
      options: ["Encapsulation", "Method Overloading", "Method Overriding", "Abstraction"],
      answer: 2,
      explanation: "Method Overriding allows runtime polymorphism by redefining superclass methods in subclasses.",
    },
    {
      q: "What is the primary key in a relational database table?",
      options: [
        "A column that uniquely identifies each row and cannot be NULL",
        "A key that references another table",
        "A key used only for encryption",
        "Any integer column",
      ],
      answer: 0,
      explanation: "A primary key uniquely identifies every record in a table and cannot contain NULL values.",
    },
    {
      q: "Which sorting algorithm has the best average-case time complexity of O(n log n)?",
      options: ["Bubble Sort", "Merge Sort", "Insertion Sort", "Selection Sort"],
      answer: 1,
      explanation: "Merge Sort consistently guarantees O(n log n) time complexity in worst, average, and best cases.",
    },
    {
      q: "What is the purpose of Git 'rebase' command?",
      options: [
        "To apply commits on top of another base tip",
        "To delete a remote repository",
        "To compile code",
        "To revert a pull request",
      ],
      answer: 0,
      explanation: "Git rebase moves or combines a sequence of commits to a new base commit, creating a linear history.",
    },
    {
      q: "In networking, what protocol resolves domain names (e.g., google.com) to IP addresses?",
      options: ["DHCP", "DNS", "FTP", "HTTP"],
      answer: 1,
      explanation: "DNS (Domain Name System) translates human-readable domain names into machine IP addresses.",
    },
    {
      q: "Which of the following is a non-linear data structure?",
      options: ["Array", "Linked List", "Queue", "Tree"],
      answer: 3,
      explanation: "Tree (and Graph) are non-linear data structures because elements are organized hierarchically.",
    },
    {
      q: "What is virtual memory in Operating Systems?",
      options: [
        "A memory management technique that uses disk space to extend physical RAM",
        "A physical RAM chip",
        "GPU memory",
        "Cache memory",
      ],
      answer: 0,
      explanation: "Virtual memory creates an illusion of larger RAM by storing inactive memory pages on secondary disk storage.",
    },
    {
      q: "Which index in SQL speeds up data retrieval?",
      options: ["B-Tree Index", "Loop Index", "Static Index", "Virtual Index"],
      answer: 0,
      explanation: "B-Tree indexes are standard in relational databases (PostgreSQL, MySQL) for fast O(log n) lookups.",
    },
    {
      q: "What is garbage collection in programming languages like Java or JavaScript?",
      options: [
        "Automatic memory management that deallocates memory occupied by unused objects",
        "Deleting temporary files on disk",
        "Closing database connections",
        "Cleaning syntax errors",
      ],
      answer: 0,
      explanation: "Garbage collection automatically reclaims heap memory used by unreachable objects.",
    },
    {
      q: "What is the worst-case time complexity of QuickSort?",
      options: ["O(n log n)", "O(n²)", "O(n)", "O(1)"],
      answer: 1,
      explanation: "QuickSort has O(n²) worst-case time complexity when the pivot chosen is consistently the smallest/largest element.",
    },
    {
      q: "Which protocol operates at the Transport Layer of the TCP/IP suite and provides reliable, connection-oriented service?",
      options: ["UDP", "IP", "TCP", "ICMP"],
      answer: 2,
      explanation: "TCP (Transmission Control Protocol) is connection-oriented and guarantees reliable packet delivery.",
    },
    {
      q: "What is a Foreign Key in database management?",
      options: [
        "A field in one table that refers to the Primary Key in another table",
        "A key used for external APIs",
        "A key that is encrypted",
        "A primary key in the same table",
      ],
      answer: 0,
      explanation: "A Foreign Key establishes a link/relationship between data in two tables by matching the Primary Key of another table.",
    },
    {
      q: "What does thread thrashing mean in Operating Systems?",
      options: [
        "High CPU utilization",
        "A state where CPU spends more time swapping pages than executing processes",
        "Deleting threads",
        "Running threads in parallel",
      ],
      answer: 1,
      explanation: "Thrashing occurs when the OS spends excessive time paging/swapping between RAM and disk due to insufficient memory.",
    },
    {
      q: "Which data structure is best suited for evaluating postfix expressions?",
      options: ["Queue", "Stack", "Tree", "Array"],
      answer: 1,
      explanation: "Stack is ideal for postfix expression evaluation (operands are pushed, operators pop top 2 elements).",
    },
    {
      q: "What is the main advantage of an AVL Tree over a standard Binary Search Tree?",
      options: ["Uses less memory", "Self-balancing to ensure O(log n) search time", "Faster insertion always", "Supports duplicates"],
      answer: 1,
      explanation: "AVL Trees automatically balance themselves, preventing skewness and guaranteeing O(log n) worst-case lookups.",
    },
    {
      q: "Which design pattern restricts the instantiation of a class to one single instance?",
      options: ["Factory", "Singleton", "Observer", "Strategy"],
      answer: 1,
      explanation: "Singleton design pattern ensures a class has only one instance and provides a global access point to it.",
    },
    {
      q: "What is the HTTP request method used to update an existing resource completely?",
      options: ["GET", "POST", "PUT", "DELETE"],
      answer: 2,
      explanation: "PUT is idempotent and replaces the target resource representation with the request payload.",
    },
    {
      q: "What is Dijkstra's algorithm used for?",
      options: ["Finding minimum spanning tree", "Finding shortest path from a single source in weighted graph", "Topological sorting", "Detecting cycles"],
      answer: 1,
      explanation: "Dijkstra's algorithm finds the shortest path from a single source node to all other nodes in a graph with non-negative edge weights.",
    },
    {
      q: "Which normal form eliminates partial dependency in database normalization?",
      options: ["1NF", "2NF", "3NF", "BCNF"],
      answer: 1,
      explanation: "Second Normal Form (2NF) requires 1NF and ensures all non-key attributes are fully functionally dependent on the primary key.",
    },
    {
      q: "What is the space complexity of Depth First Search (DFS) on a tree of height h?",
      options: ["O(1)", "O(h)", "O(n²)", "O(2ⁿ)"],
      answer: 1,
      explanation: "DFS uses call stack memory proportional to the maximum depth/height h of the tree.",
    },
    {
      q: "What is a RESTful API constraint?",
      options: ["Stateful server", "Statelessness", "Coupled client-server", "No caching"],
      answer: 1,
      explanation: "Statelessness is a core REST constraint: each request from client to server must contain all info needed to process it.",
    },
    {
      q: "Which scheduling algorithm can cause starvation for low-priority processes?",
      options: ["Round Robin", "Priority Scheduling", "FCFS", "Shortest Job First"],
      answer: 1,
      explanation: "Priority Scheduling can cause starvation if high-priority processes keep arriving continuously.",
    },
    {
      q: "In JavaScript, what is the event loop?",
      options: [
        "A mechanism that constantly checks call stack and task queue to execute asynchronous callbacks",
        "A for loop for events",
        "A DOM rendering engine",
        "A thread manager for web workers",
      ],
      answer: 0,
      explanation: "The Event Loop continuously monitors the Call Stack and Callback Queue, pushing queued tasks to the stack when empty.",
    },
    {
      q: "What is the time complexity to insert a node at the beginning of a singly linked list?",
      options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
      answer: 0,
      explanation: "Inserting at head of linked list takes O(1) constant time since no traversal is required.",
    },
    {
      q: "Which RAID level provides striping with parity for fault tolerance?",
      options: ["RAID 0", "RAID 1", "RAID 5", "RAID 10"],
      answer: 2,
      explanation: "RAID 5 uses block-level striping with distributed parity, allowing recovery if a single drive fails.",
    },
    {
      q: "What is the primary function of an ARP (Address Resolution Protocol) in networking?",
      options: ["Resolve IP addresses to MAC addresses", "Resolve domain names to IP", "Encrypt network traffic", "Assign IP dynamically"],
      answer: 0,
      explanation: "ARP maps a 32-bit IPv4 address to a 48-bit physical MAC address on a local network.",
    },
  ],
};

/* ─────────────────────────────────────────────────────────── SECTION DATA ──── */

const SECTIONS = [
  {
    id: "quant",
    icon: Calculator,
    title: "Quantitative Aptitude",
    color: "from-blue-500 to-cyan-500",
    borderColor: "border-blue-500/20",
    description: "Master numbers, speed & accuracy for top placement tests",
    topics: [
      { name: "Percentages", difficulty: "Easy", questions: 45, url: "https://www.indiabix.com/aptitude/percentage/", youtube: "https://www.youtube.com/results?search_query=percentages+aptitude+tricks" },
      { name: "Profit & Loss", difficulty: "Easy", questions: 38, url: "https://www.indiabix.com/aptitude/profit-and-loss/", youtube: "https://www.youtube.com/results?search_query=profit+loss+aptitude" },
      { name: "Time & Work", difficulty: "Medium", questions: 52, url: "https://www.indiabix.com/aptitude/time-and-work/", youtube: "https://www.youtube.com/results?search_query=time+and+work+aptitude+tricks" },
      { name: "Probability", difficulty: "Medium", questions: 30, url: "https://www.indiabix.com/aptitude/probability/", youtube: "https://www.youtube.com/results?search_query=probability+aptitude" },
      { name: "Speed, Distance & Time", difficulty: "Medium", questions: 41, url: "https://www.indiabix.com/aptitude/problems-on-trains/", youtube: "https://www.youtube.com/results?search_query=speed+distance+time+aptitude" },
      { name: "Number Systems", difficulty: "Hard", questions: 28, url: "https://www.indiabix.com/aptitude/numbers/", youtube: "https://www.youtube.com/results?search_query=number+system+aptitude" },
    ],
  },
  {
    id: "reasoning",
    icon: Brain,
    title: "Logical Reasoning",
    color: "from-purple-500 to-violet-500",
    borderColor: "border-purple-500/20",
    description: "Sharpen your analytical thinking for aptitude rounds",
    topics: [
      { name: "Number Series", difficulty: "Easy", questions: 60, url: "https://www.indiabix.com/logical-reasoning/number-series/", youtube: "https://www.youtube.com/results?search_query=number+series+logical+reasoning" },
      { name: "Puzzles", difficulty: "Hard", questions: 35, url: "https://www.indiabix.com/logical-reasoning/puzzles/", youtube: "https://www.youtube.com/results?search_query=puzzles+logical+reasoning" },
      { name: "Syllogism", difficulty: "Medium", questions: 44, url: "https://www.indiabix.com/logical-reasoning/syllogism/", youtube: "https://www.youtube.com/results?search_query=syllogism+tricks" },
      { name: "Blood Relations", difficulty: "Easy", questions: 32, url: "https://www.indiabix.com/logical-reasoning/blood-relations/", youtube: "https://www.youtube.com/results?search_query=blood+relations+logical+reasoning" },
      { name: "Seating Arrangement", difficulty: "Hard", questions: 48, url: "https://www.indiabix.com/logical-reasoning/seating-arrangement/", youtube: "https://www.youtube.com/results?search_query=seating+arrangement+logical+reasoning" },
      { name: "Coding-Decoding", difficulty: "Easy", questions: 55, url: "https://www.indiabix.com/logical-reasoning/coding-decoding/", youtube: "https://www.youtube.com/results?search_query=coding+decoding+reasoning" },
    ],
  },
  {
    id: "verbal",
    icon: MessageSquareText,
    title: "Verbal Ability",
    color: "from-emerald-500 to-teal-500",
    borderColor: "border-emerald-500/20",
    description: "Ace English communication rounds in on-campus drives",
    topics: [
      { name: "Reading Comprehension", difficulty: "Medium", questions: 40, url: "https://www.indiabix.com/verbal-ability/comprehension/", youtube: "https://www.youtube.com/results?search_query=reading+comprehension+aptitude" },
      { name: "Synonyms", difficulty: "Easy", questions: 80, url: "https://www.indiabix.com/verbal-ability/synonyms/", youtube: "https://www.youtube.com/results?search_query=synonyms+verbal+ability" },
      { name: "Grammar Rules", difficulty: "Medium", questions: 65, url: "https://www.indiabix.com/verbal-ability/grammar/", youtube: "https://www.youtube.com/results?search_query=english+grammar+for+placements" },
      { name: "Para Jumbles", difficulty: "Hard", questions: 30, url: "https://www.indiabix.com/verbal-ability/sentence-arrangement/", youtube: "https://www.youtube.com/results?search_query=para+jumbles+verbal+ability" },
      { name: "Sentence Correction", difficulty: "Medium", questions: 55, url: "https://www.indiabix.com/verbal-ability/sentence-correction/", youtube: "https://www.youtube.com/results?search_query=sentence+correction+english" },
      { name: "Antonyms", difficulty: "Easy", questions: 70, url: "https://www.indiabix.com/verbal-ability/antonyms/", youtube: "https://www.youtube.com/results?search_query=antonyms+verbal+ability" },
    ],
  },
];

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  Medium: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  Hard: "bg-rose-500/15 text-rose-400 border-rose-500/20",
};

const PREP_TIPS = [
  { icon: Clock, tip: "Solve 20 questions/day for 30 days before your drive" },
  { icon: Target, tip: "Focus on weak topics first. Take sectional tests" },
  { icon: TrendingUp, tip: "Speed + accuracy: practice with a timer always" },
  { icon: Trophy, tip: "Aim for 80%+ accuracy before a full-length mock" },
];

const TOP_RESOURCES = [
  { name: "IndiaBix", desc: "1000+ practice questions with solutions", url: "https://www.indiabix.com/", color: "from-blue-500 to-indigo-500", icon: BookOpen },
  { name: "PrepInsta", desc: "Company-specific placement preparation", url: "https://prepinsta.com/", color: "from-violet-500 to-purple-500", icon: Target },
  { name: "FreshersWorld", desc: "Previous year placement papers", url: "https://www.freshersworld.com/placement-papers", color: "from-emerald-500 to-teal-500", icon: FileText },
  { name: "GeeksForGeeks", desc: "CS fundamentals + aptitude questions", url: "https://www.geeksforgeeks.org/placements-gq/", color: "from-green-500 to-emerald-600", icon: Zap },
  { name: "Testbook", desc: "Live mock tests & performance analysis", url: "https://testbook.com/", color: "from-orange-500 to-amber-500", icon: Trophy },
  { name: "Unacademy", desc: "Aptitude video lectures & live classes", url: "https://unacademy.com/", color: "from-rose-500 to-pink-500", icon: Play },
];

/* ─────────────────────────────────────────────────────────── MOCK TEST ──── */

type MockTestState = "select" | "running" | "results";

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generateSessionQuestions(pool: QuizQuestion[], count: number = 10): QuizQuestion[] {
  const shuffledPool = shuffleArray(pool);
  const selectedSubset = shuffledPool.slice(0, Math.min(count, pool.length));
  
  return selectedSubset.map((q) => {
    const correctAnswerText = q.options[q.answer];
    const shuffledOptions = shuffleArray(q.options);
    const newAnswerIndex = shuffledOptions.indexOf(correctAnswerText);
    return {
      ...q,
      options: shuffledOptions,
      answer: newAnswerIndex,
    };
  });
}

function MockTestModule({ onBack }: { onBack: () => void }) {
  const [state, setState] = useState<MockTestState>("select");
  const [selectedCategory, setSelectedCategory] = useState<string>("Quantitative Aptitude");
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [quizCategories, setQuizCategories] = useState<string[]>(Object.keys(QUIZ_BANK));

  useEffect(() => {
    try {
      const customQuizBank = JSON.parse(localStorage.getItem("customQuizBank") ?? "{}");
      const cats = Array.from(new Set([...Object.keys(QUIZ_BANK), ...Object.keys(customQuizBank)]));
      setQuizCategories(cats);
    } catch {}
  }, []);

  function getQuestionCount(cat: string) {
    try {
      const baseCount = QUIZ_BANK[cat]?.length ?? 0;
      const customQuizBank = JSON.parse(localStorage.getItem("customQuizBank") ?? "{}");
      const customCount = customQuizBank[cat]?.length ?? 0;
      return baseCount + customCount;
    } catch {
      return QUIZ_BANK[cat]?.length ?? 0;
    }
  }

  useEffect(() => {
    if (state !== "running") return;
    if (timeLeft <= 0) { endTest(); return; }
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [state, timeLeft]);

  function startTest() {
    let pool: QuizQuestion[] = [];
    try {
      const baseQuestions = QUIZ_BANK[selectedCategory] ?? [];
      const customQuizBank = JSON.parse(localStorage.getItem("customQuizBank") ?? "{}");
      const customQuestions = customQuizBank[selectedCategory] ?? [];
      pool = [...baseQuestions, ...customQuestions];
    } catch {
      pool = QUIZ_BANK[selectedCategory] ?? [];
    }

    const sessionSet = generateSessionQuestions(pool, 10);
    setQuestions(sessionSet);
    setQIndex(0);
    setSelected(null);
    setConfirmed(false);
    setAnswers(new Array(sessionSet.length).fill(null));
    setTimeLeft(600);
    setState("running");
  }

  function confirmAnswer() {
    if (selected === null) return;
    const updated = [...answers];
    updated[qIndex] = selected;
    setAnswers(updated);
    setConfirmed(true);
  }

  function goNext() {
    if (qIndex >= questions.length - 1) { endTest(); return; }
    setQIndex((i) => i + 1);
    setSelected(answers[qIndex + 1] ?? null);
    setConfirmed(answers[qIndex + 1] !== null);
  }

  function goPrev() {
    if (qIndex <= 0) return;
    setQIndex((i) => i - 1);
    setSelected(answers[qIndex - 1] ?? null);
    setConfirmed(answers[qIndex - 1] !== null);
  }

  function endTest() { setState("results"); }

  const score = answers.filter((a, i) => a === questions[i]?.answer).length;

  if (state === "select") {
    return (
      <AppShell>
        <div className="max-w-2xl mx-auto py-8">
          <button onClick={onBack} className="text-sm text-muted-foreground flex items-center gap-1 mb-6 hover:text-foreground">
            <ChevronLeft className="size-4" /> Back to Placement Prep
          </button>
          <h1 className="text-2xl font-bold mb-2 flex items-center gap-2"><FileText className="size-6 text-orange-400" /> Mock Test</h1>
          <p className="text-sm text-muted-foreground mb-6">10 randomized questions per session · 10 minutes · Instant scoring & explanations</p>

          <div className="space-y-3 mb-6">
            {quizCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn("w-full text-left glass-card rounded-2xl p-5 border transition-all flex items-center gap-4",
                  selectedCategory === cat ? "border-primary/40 bg-primary/5" : "border-white/5 hover:border-white/15")}
              >
                <div className={cn("size-4 rounded-full border-2 shrink-0", selectedCategory === cat ? "border-primary bg-primary" : "border-white/30")} />
                <div>
                  <p className="font-bold">{cat}</p>
                  <p className="text-xs text-muted-foreground">{getQuestionCount(cat)} questions in pool · 10 random/session · 10 min</p>
                </div>
                {selectedCategory === cat && <CheckCircle2 className="size-5 text-primary ml-auto" />}
              </button>
            ))}
          </div>
          <Button variant="hero" size="lg" className="w-full" onClick={startTest}>
            Start Mock Test <ChevronRight className="size-5" />
          </Button>
        </div>
      </AppShell>
    );
  }

  if (state === "results") {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <AppShell>
        <div className="max-w-2xl mx-auto py-8">
          <button onClick={() => setState("select")} className="text-sm text-muted-foreground flex items-center gap-1 mb-6 hover:text-foreground">
            <ChevronLeft className="size-4" /> Back
          </button>
          <div className="glass-card rounded-2xl p-8 text-center mb-6">
            <div className={cn("size-20 rounded-full grid place-items-center mx-auto mb-4 text-white text-2xl font-bold", pct >= 70 ? "bg-gradient-to-br from-emerald-500 to-teal-500" : pct >= 50 ? "bg-gradient-to-br from-yellow-500 to-orange-500" : "bg-gradient-to-br from-rose-500 to-pink-600")}>
              {pct}%
            </div>
            <h2 className="text-2xl font-bold">{pct >= 70 ? "Excellent! 🎉" : pct >= 50 ? "Good effort! 👍" : "Keep practicing! 💪"}</h2>
            <p className="text-muted-foreground mt-1">{score}/{questions.length} correct in {selectedCategory}</p>
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-emerald-500/10 rounded-xl p-3">
                <p className="text-xl font-bold text-emerald-400">{score}</p>
                <p className="text-xs text-muted-foreground">Correct</p>
              </div>
              <div className="bg-rose-500/10 rounded-xl p-3">
                <p className="text-xl font-bold text-rose-400">{questions.length - score}</p>
                <p className="text-xs text-muted-foreground">Wrong</p>
              </div>
              <div className="bg-primary/10 rounded-xl p-3">
                <p className="text-xl font-bold text-primary">{pct}%</p>
                <p className="text-xs text-muted-foreground">Score</p>
              </div>
            </div>
          </div>

          <h3 className="font-bold text-lg mb-3">Review All Questions</h3>
          <div className="space-y-3 mb-6">
            {questions.map((q, i) => {
              const userAns = answers[i];
              const correct = userAns === q.answer;
              return (
                <div key={i} className={cn("glass-card rounded-xl p-4 border", correct ? "border-emerald-500/20" : "border-rose-500/20")}>
                  <div className="flex items-start gap-2 mb-2">
                    {correct ? <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" /> : <XCircle className="size-4 text-rose-400 shrink-0 mt-0.5" />}
                    <p className="text-sm font-medium">{q.q}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 mb-2">
                    {q.options.map((opt, oi) => (
                      <div key={oi} className={cn("text-xs px-3 py-1.5 rounded-lg",
                        oi === q.answer ? "bg-emerald-500/15 text-emerald-400 font-semibold" :
                        oi === userAns && !correct ? "bg-rose-500/15 text-rose-400 line-through" :
                        "text-muted-foreground")}>
                        {oi === q.answer && "✓ "}{opt}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground bg-white/3 rounded-lg px-3 py-2">💡 {q.explanation}</p>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setState("select")}>
              <RotateCcw className="size-4 mr-2" /> Try Another
            </Button>
            <Button variant="hero" className="flex-1" onClick={startTest}>
              Retry Same
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

  // Running state
  const currentQ = questions[qIndex];
  return (
    <AppShell>
      <div className="max-w-xl mx-auto py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <button onClick={onBack} className="text-sm text-muted-foreground flex items-center gap-1 hover:text-foreground">
            <ChevronLeft className="size-4" /> Quit
          </button>
          <div className={cn("flex items-center gap-2 px-4 py-1.5 rounded-xl text-sm font-bold", timeLeft < 120 ? "bg-rose-500/20 text-rose-400" : "bg-primary/10 text-primary")}>
            <Timer className="size-4" />
            {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-5">
          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-primary rounded-full transition-all" style={{ width: `${((qIndex + 1) / questions.length) * 100}%` }} />
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">{qIndex + 1}/{questions.length}</span>
        </div>

        {/* Question */}
        <div className="glass-card rounded-2xl p-6 border border-white/5">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-400">{selectedCategory}</span>
          <h2 className="text-lg font-bold mt-1 mb-5">{currentQ.q}</h2>

          {/* Options */}
          <div className="space-y-3 mb-5">
            {currentQ.options.map((opt, oi) => {
              let cls = "border border-white/10 bg-background/40 hover:border-primary/40 hover:bg-primary/5 cursor-pointer";
              if (confirmed) {
                if (oi === currentQ.answer) cls = "border-emerald-500/50 bg-emerald-500/10 text-emerald-300";
                else if (oi === selected) cls = "border-rose-500/50 bg-rose-500/10 text-rose-300 line-through";
                else cls = "border-white/5 bg-background/20 opacity-50";
              } else if (oi === selected) {
                cls = "border-primary/60 bg-primary/10";
              }
              return (
                <button
                  key={oi}
                  disabled={confirmed}
                  onClick={() => setSelected(oi)}
                  className={cn("w-full text-left px-4 py-3 rounded-xl text-sm transition-all flex items-center gap-3", cls)}
                >
                  <span className={cn("size-6 rounded-full border text-xs font-bold grid place-items-center shrink-0", oi === selected && !confirmed ? "border-primary text-primary" : "border-white/20")}>
                    {["A", "B", "C", "D"][oi]}
                  </span>
                  {opt}
                  {confirmed && oi === currentQ.answer && <CheckCircle2 className="size-4 text-emerald-400 ml-auto" />}
                  {confirmed && oi === selected && oi !== currentQ.answer && <XCircle className="size-4 text-rose-400 ml-auto" />}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {confirmed && (
            <div className="bg-white/3 border border-white/5 rounded-xl p-4 mb-4">
              <p className="text-xs font-bold text-primary mb-1">💡 Explanation</p>
              <p className="text-xs text-muted-foreground">{currentQ.explanation}</p>
            </div>
          )}

          {/* Nav Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={goPrev} disabled={qIndex === 0}><ChevronLeft className="size-4" /></Button>
            {!confirmed ? (
              <Button variant="hero" className="flex-1" onClick={confirmAnswer} disabled={selected === null}>
                Confirm
              </Button>
            ) : (
              <Button variant="hero" className="flex-1" onClick={goNext}>
                {qIndex >= questions.length - 1 ? "See Results" : "Next"} <ChevronRight className="size-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Question navigator dots */}
        <div className="flex flex-wrap gap-1.5 mt-4 justify-center">
          {questions.map((_, i) => (
            <div key={i} className={cn("size-2.5 rounded-full", i === qIndex ? "bg-primary" : answers[i] !== null ? answers[i] === questions[i].answer ? "bg-emerald-500" : "bg-rose-500" : "bg-white/15")} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}

/* ─────────────────────────────────────────────────────────── MAIN PAGE ──── */

function PlacementMain() {
  const [mockMode, setMockMode] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  if (mockMode) return <MockTestModule onBack={() => setMockMode(false)} />;

  return (
    <AppShell>
      <PageHeader
        title="Placement Preparation"
        subtitle="Aptitude, reasoning, mock tests, and company-specific tracks — built around top recruiter patterns."
      />

      {/* Stats Bar */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Practice Questions", value: "5,000+", icon: BookOpen },
          { label: "Mock Tests", value: "30+ In-App", icon: FileText },
          { label: "Companies Covered", value: "50+", icon: Users },
          { label: "Students Placed", value: "92%", icon: Trophy },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="glass-card rounded-2xl p-4 flex items-center gap-3">
              <div className="size-9 rounded-xl bg-primary/10 grid place-items-center shrink-0">
                <Icon className="size-4 text-primary" />
              </div>
              <div>
                <p className="text-lg font-bold gradient-text">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Tips */}
      <div className="mt-6 glass-card rounded-2xl p-5 border border-primary/10">
        <h3 className="font-bold text-sm uppercase tracking-widest text-primary mb-3 flex items-center gap-2">
          <Star className="size-4" /> Placement Prep Tips
        </h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {PREP_TIPS.map(({ icon: Icon, tip }) => (
            <div key={tip} className="flex items-start gap-2.5">
              <div className="size-6 rounded-lg bg-primary/10 grid place-items-center shrink-0 mt-0.5">
                <Icon className="size-3.5 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── In-App Mock Test CTA ── */}
      <div
        onClick={() => setMockMode(true)}
        className="mt-6 cursor-pointer glass-card rounded-2xl p-6 border border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-rose-500/5 hover:shadow-elegant hover:-translate-y-0.5 transition-all flex items-center justify-between group"
      >
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 grid place-items-center">
            <FileText className="size-6 text-white" />
          </div>
          <div>
            <p className="font-bold text-lg">📝 Take In-App Mock Test</p>
            <p className="text-sm text-muted-foreground">10 randomized questions per session · 10 mins · Instant results & explanations</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-orange-400 font-semibold text-sm shrink-0">
          Start Now <ChevronRight className="size-5 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* Aptitude Sections */}
      <div className="mt-6 space-y-4">
        {SECTIONS.map((section) => {
          const Icon = section.icon;
          const isOpen = activeSection === section.id;
          return (
            <div key={section.id} className={cn("glass-card rounded-2xl overflow-hidden border transition-all duration-300", isOpen ? section.borderColor : "border-white/5")}>
              <button
                onClick={() => setActiveSection(isOpen ? null : section.id)}
                className="w-full p-5 flex items-center gap-4 text-left hover:bg-white/2 transition-colors"
              >
                <div className={`size-12 rounded-xl bg-gradient-to-br ${section.color} grid place-items-center shrink-0`}>
                  <Icon className="size-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold">{section.title}</h3>
                  <p className="text-sm text-muted-foreground">{section.description}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Badge variant="secondary" className="hidden sm:flex bg-white/5 text-muted-foreground">{section.topics.length} topics</Badge>
                  <ChevronRight className={cn("size-5 text-muted-foreground transition-transform duration-300", isOpen && "rotate-90")} />
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5">
                  <div className="h-px bg-white/5 mb-5" />
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {section.topics.map((topic) => (
                      <div key={topic.name} className="rounded-xl border border-white/5 bg-background/40 p-4 flex flex-col gap-3 hover:border-primary/20 transition-all">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold text-sm leading-snug">{topic.name}</p>
                          <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0", DIFFICULTY_COLORS[topic.difficulty])}>{topic.difficulty}</span>
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <CheckCircle2 className="size-3 text-emerald-400" />{topic.questions} practice questions
                        </p>
                        <div className="flex gap-2 mt-auto">
                          <a href={topic.url} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                            <BookOpen className="size-3" /> Practice
                          </a>
                          <a href={topic.youtube} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors">
                            <Play className="size-3" /> Watch
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Free Resources */}
      <section className="mt-10">
        <div className="mb-4">
          <h2 className="text-xl font-bold">Free Study Resources</h2>
          <p className="text-sm text-muted-foreground">Best free platforms used by placed students</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOP_RESOURCES.map((r) => {
            const Icon = r.icon;
            return (
              <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer" className="group glass-card rounded-2xl p-5 hover:shadow-elegant hover:-translate-y-1 transition-all flex items-start gap-4 border border-white/5 hover:border-primary/20">
                <div className={`size-10 rounded-xl bg-gradient-to-br ${r.color} grid place-items-center shrink-0`}>
                  <Icon className="size-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold group-hover:text-primary transition-colors">{r.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{r.desc}</p>
                </div>
                <ExternalLink className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5" />
              </a>
            );
          })}
        </div>
      </section>

      {/* Company Tracks */}
      <section className="mt-10">
        <div className="mb-4">
          <h2 className="text-xl font-bold">Company-specific preparation</h2>
          <p className="text-sm text-muted-foreground">Dedicated tracks with interview process, top questions, and prep roadmaps.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {COMPANIES.map((c) => (
            <Link key={c.slug} to="/companies/$slug" params={{ slug: c.slug }} className="group glass-card rounded-2xl p-5 hover:shadow-elegant hover:-translate-y-1 transition-all border border-white/5 hover:border-primary/20">
              <div className={`size-10 rounded-xl bg-gradient-to-br ${c.color} mb-3`} />
              <p className="font-bold">{c.name}</p>
              <p className="text-xs text-muted-foreground">{c.role} • {c.ctc}</p>
              <p className="mt-3 text-xs flex items-center gap-1 text-primary font-semibold">Open track <ArrowRight className="size-3" /></p>
            </Link>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
