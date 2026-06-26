import {
  Code2,
  Database,
  Globe,
  GraduationCap,
  Star,
} from "lucide-react";

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
  location: "[akkar, Jdeidet El Qaytaa] · Open to Remote",
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
  gradient: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    title: "Hospital Management Website",
    category: "Web",
    description:
      "A full-featured web application for managing hospital operations including patient registration, appointment scheduling, doctor management, and medical record tracking. Built with a focus on clean UI and reliable data management.",
    techStack: ["HTML", "CSS", "JavaScript", "MySQL"],
    github: "#",
    demo: "#",
    gradient: "from-teal-500 to-blue-600",
    featured: true,
  },
  
  {
    title: "OpenGL 3D Ball Simulation",
    category: "Desktop",
    description:
      "An interactive 3D graphics simulation using OpenGL featuring real-time rendering of a 3D ball with lighting, textures, physics-based bouncing, and keyboard controls for camera movement.",
    techStack: ["C++", "OpenGL", "GLUT", "3D Graphics"],
    github: "#",
    demo: "N/A — Desktop App",
    gradient: "from-orange-500 to-red-600",
  },
  {
    title: "Portfolio Website",
    category: "Web",
    description:
      "This very portfolio — a modern, fully responsive personal website built with React and TypeScript showcasing projects, skills, and professional background. Features smooth animations and a clean, dark design system.",
    techStack: ["React", "TypeScript", "Tailwind CSS", "Motion"],
    github: "#",
    demo: "#",
    gradient: "from-blue-500 to-violet-600",
  },
  {
    title: "E-Commerce Web Application (Team Project | Full-Stack)",
    category: "Web",
    description:
      "A full-stack e-commerce web application built with modern technologies, featuring user authentication, product management, shopping cart functionality, and secure payment processing.",
    techStack: ["HTML", "SQL"],
    github: "#",
    demo: "N/A",
    gradient: "from-emerald-500 to-teal-600",
  },
];

export const education = {
  degree: "Bachelor of Science in Computer Science",
  university: "[lebanese University] · [Faculty of Science]",
  period: "[2023] – [2026]",
  gpa: "3.80 / 4.00",
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

export const certifications = [
  { title: "Introduction to Web Development", issuer: "Coursera", date: "2024", link: "#", gradient: "from-blue-500 to-cyan-500" },
  { title: "Java Programming Masterclass", issuer: "Udemy", date: "2023", link: "#", gradient: "from-orange-500 to-red-500" },
  { title: "SQL and Database Design", issuer: "edX", date: "2023", link: "#", gradient: "from-emerald-500 to-teal-500" },
  { title: "React - The Complete Guide", issuer: "Udemy", date: "2024", link: "#", gradient: "from-sky-500 to-indigo-500" },
  { title: "Git & GitHub Essentials", issuer: "LinkedIn Learning", date: "2023", link: "#", gradient: "from-violet-500 to-purple-500" },
  { title: "CS50: Introduction to Computer Science", issuer: "Harvard/edX", date: "2022", link: "#", gradient: "from-rose-500 to-pink-500" },
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
