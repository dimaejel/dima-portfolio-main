import { Code2, Database, Globe, GraduationCap, Star } from "lucide-react";

export const personalInfo = {
  name: "Dima Ejel",
  initials: "DE",
  title: "Computer Science Graduate",
  roles: ["Software Engineer", "Web Developer", "Problem Solver"],
  bio: "Passionate about building elegant, scalable software solutions. I thrive at the intersection of clean code, intuitive design, and real-world impact. Currently seeking opportunities in Software Engineering and Web Development.",
  email: "dimaejel79@gmail.com",
  linkedin: "linkedin.com/in/dima-ejel",
  linkedinUrl: "https://linkedin.com/in/dima-ejel",
  github: "github.com/dimaejel",
  githubUrl: "https://github.com/dimaejel ",
  location: "[akkar, Jdeidet El Qaytaa]",
  phone: "+961 79 317 242",
  stats: [
    { label: "Projects", value: "4+" },
    { label: "Technologies", value: "10+" },
    { label: "Degree", value: "1" },
    { label: "Status", value: "Open to Work" },
  ],
  interests: [
    "Web Development",
    "Software Engineering",
    "Databases",
    "Open Source",
    "Clean Code",
    "Problem Solving",
  ],
};

export type SkillGroup = {
  title: string;
  skills: { name: string; badge: string; color: string }[];
};

export const skillGroups: SkillGroup[] = [
  {
    title: "Programming Languages",
    skills: [
      { name: "Java", badge: "Jv", color: "#F89820" },
      { name: "C", badge: "C", color: "#5C6BC0" },
      { name: "C++", badge: "C++", color: "#00599C" },
      { name: "JavaScript", badge: "JS", color: "#F7DF1E" },
      { name: "HTML", badge: "<>", color: "#E34F26" },
      { name: "CSS", badge: "{ }", color: "#1572B6" },
      { name: "Python", badge: "Py", color: "#3776AB" },
      { name: "PHP", badge: "PHP", color: "#777BB4" },
    ],
  },
  {
    title: "Frameworks & Libraries",
    skills: [
      { name: "React", badge: "⚛", color: "#61DAFB" },
      { name: "Node.js", badge: "N", color: "#3C873A" },
      { name: "Git", badge: "⎇", color: "#F05032" },
    ],
  },
  {
    title: "Databases",
    skills: [{ name: "MySQL", badge: "DB", color: "#00758F" }],
  },
  {
    title: "Developer Tools",
    skills: [
      { name: "VS Code", badge: "VS", color: "#007ACC" },
      { name: "GitHub", badge: "GH", color: "#181717" },
      { name: "Jira", badge: "J", color: "#FF6C37" },
    ],
  },
];

export type Project = {
  title: string;
  category: "Web" | "Desktop" | "Database";
  description: string;
  techStack: string[];
  github: string;
  demo: string;
  image?: string;
  gradient: string;
  featured?: boolean;
};

export const education = {
  degree: "Bachelor of Science in Computer Science",
  university: "[lebanese University] · [Faculty of Science]",
  period: "[2023] – [2026]",
  courses: [
    "Data Structures & Algorithms",
    "Object-Oriented Programming",
    "Database Systems",
    "Computer Networks",
    "Operating Systems",
    "Software Engineering",
    "Web Development",
    "Computer Graphics",
    "Discrete Mathematics",
    "Linear Algebra",
  ],
};

export type Experience = {
  role: string;
  company: string;
  period: string;
  type: "Internship" | "Academic" | "Freelance" | "Volunteer";
  bullets: string[];
};

export const experience: Experience[] = [
  {
    role: "Academic Project Lead",
    company: "University · Academic",
    period: "[Year]",
    type: "Academic",
    bullets: [
      "Led a team of [N] students to design and deliver [Project Name]",
      "Applied software engineering lifecycle (planning, design, implementation, testing)",
      "Presented final deliverable to faculty evaluators",
    ],
  },
  {
    role: "Freelance Web Developer",
    company: "Self-Employed · Freelance",
    period: "[Year] – Present",
    type: "Freelance",
    bullets: [
      "Designed and built static and dynamic websites for small local clients",
      "Handled full project lifecycle from requirement gathering to deployment",
      "Maintained ongoing client relationships and post-launch support",
    ],
  },
  {
    role: "Tech Community Volunteer",
    company: "[Organization Name] · Volunteer",
    period: "[Year]",
    type: "Volunteer",
    bullets: [
      "Assisted in organizing tech workshops and coding bootcamps",
      "Mentored junior students in programming fundamentals",
      "Contributed to club social media and website content",
    ],
  },
];

export const achievements = [
  {
    title: "Academic Excellence",
    icon: GraduationCap,
    items: [
      "Dean's List / Academic Honor (Year)",
      "Highest GPA in [Subject] course",
      "Top [N]% in graduating class",
      "[Competition / Project Award]",
    ],
  },
  {
    title: "Technical Accomplishments",
    icon: Code2,
    items: [
      "Completed 5+ self-directed projects",
      "Contributed to open-source repository",
      "Solved 50+ algorithmic problems on LeetCode/HackerRank",
      "Built full-stack application independently",
    ],
  },
  {
    title: "Personal Milestones",
    icon: Star,
    items: [
      "Delivered freelance project under deadline",
      "Self-taught React and Node.js in [X] months",
      "Organized campus coding workshop",
      "Mentored [N] junior students",
    ],
  },
];

export const categoryIcons = {
  Web: Globe,
  Desktop: Code2,
  Database: Database,
};

export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Education", href: "#education" },
  { label: "Experience", href: "#experience" },
  { label: "Certifications", href: "#certifications" },
  { label: "Contact", href: "#contact" },
];
