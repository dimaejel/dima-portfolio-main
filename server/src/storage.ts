import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { supabase } from "./supabase.js";
export type UserRole = "ADMIN" | "USER";

export interface ProfileRecord {
  id: string;
  userId: string;
  bio?: string;
  avatarUrl?: string;
  location?: string;
  website?: string;
}

export interface UserRecord {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  profile?: ProfileRecord;
  createdAt: string;
}

export interface ProjectRecord {
  id: string;
  title: string;
  category: string;
  description: string;
  techStack: string[];
  github: string;
  demo: string;
  gradient: string;
  featured?: boolean;
}

export interface SkillRecord {
  id: string;
  title: string;
  skills: Array<{ name: string; badge: string; color: string }>;
}

export interface ExperienceRecord {
  id: string;
  role: string;
  company: string;
  period: string;
  type: string;
  bullets: string[];
}

export interface CertificateRecord {
  id: string;
  title: string;
  issuer: string;
  date: string;
  link: string;
  gradient: string;
}

export interface ContentStore {
  users: UserRecord[];
  projects: ProjectRecord[];
  skills: SkillRecord[];
  experience: ExperienceRecord[];
  certificates: CertificateRecord[];
  profile: ProfileRecord | null;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.resolve(__dirname, "..", "data");
const dataFile = path.join(dataDir, "cms.json");

const defaultStore: ContentStore = {
  users: [
    {
      id: "admin-1",
      email: "admin@example.com",
      password: "$2a$10$qUHnjCWcbACQ4TdU8ooPV.fON7dDF/u7mbocSqxhjvzf8zGDyIOyq",
      name: "Admin",
      role: "ADMIN",
      createdAt: new Date().toISOString(),
      profile: {
        id: "profile-1",
        userId: "admin-1",
        bio: "Portfolio Administrator",
        location: "",
        website: "",
      },
    },
  ],
  projects: [
    {
      id: "project-1",
      title: "Hospital Management Website",
      category: "Web",
      description:
        "A full-featured web application for managing hospital operations including patient registration, appointment scheduling, doctor management, and medical record tracking.",
      techStack: ["HTML", "CSS", "JavaScript", "MySQL"],
      github: "#",
      demo: "#",
      gradient: "from-teal-500 to-blue-600",
      featured: true,
    },
    {
      id: "project-2",
      title: "OpenGL 3D Ball Simulation",
      category: "Desktop",
      description:
        "An interactive 3D graphics simulation using OpenGL featuring real-time rendering of a 3D ball with lighting and physics-based bouncing.",
      techStack: ["C++", "OpenGL", "GLUT", "3D Graphics"],
      github: "#",
      demo: "N/A — Desktop App",
      gradient: "from-orange-500 to-red-600",
    },
  ],
  skills: [
    {
      id: "skill-group-1",
      title: "Programming Languages",
      skills: [
        { name: "Java", badge: "Jv", color: "#F89820" },
        { name: "C", badge: "C", color: "#5C6BC0" },
        { name: "JavaScript", badge: "JS", color: "#F7DF1E" },
      ],
    },
    {
      id: "skill-group-2",
      title: "Frameworks & Libraries",
      skills: [
        { name: "React", badge: "⚛", color: "#61DAFB" },
        { name: "Node.js", badge: "N", color: "#3C873A" },
      ],
    },
  ],
  experience: [
    {
      id: "experience-1",
      role: "Academic Project Lead",
      company: "University · Academic",
      period: "[Year]",
      type: "Academic",
      bullets: [
        "Led a team to design and deliver a full-stack project.",
        "Applied software engineering best practices.",
        "Presented the final deliverable to faculty.",
      ],
    },
    {
      id: "experience-2",
      role: "Freelance Web Developer",
      company: "Self-Employed · Freelance",
      period: "[Year] – Present",
      type: "Freelance",
      bullets: [
        "Built websites for local clients.",
        "Managed project lifecycle from planning to launch.",
        "Maintained post-launch support.",
      ],
    },
  ],
  certificates: [
    {
      id: "certificate-1",
      title: "Introduction to Web Development",
      issuer: "Coursera",
      date: "2024",
      link: "#",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: "certificate-2",
      title: "React - The Complete Guide",
      issuer: "Udemy",
      date: "2024",
      link: "#",
      gradient: "from-sky-500 to-indigo-500",
    },
  ],
  profile: null,
};

async function ensureStoreFile() {
  await mkdir(dataDir, { recursive: true });
  try {
    await readFile(dataFile, "utf8");
  } catch {
    await writeFile(dataFile, JSON.stringify(defaultStore, null, 2));
  }
}

export async function readStore(): Promise<ContentStore> {
  await ensureStoreFile();
  const content = await readFile(dataFile, "utf8");
  const parsed = JSON.parse(content) as ContentStore;
  if (!parsed.projects) parsed.projects = defaultStore.projects;
  if (!parsed.skills) parsed.skills = defaultStore.skills;
  if (!parsed.experience) parsed.experience = defaultStore.experience;
  if (!parsed.certificates) parsed.certificates = defaultStore.certificates;
  if (!parsed.users) parsed.users = [];
  if (!parsed.profile) parsed.profile = null;
  return parsed;
}

export async function writeStore(store: ContentStore) {
  await ensureStoreFile();
  await writeFile(dataFile, JSON.stringify(store, null, 2));
}
export async function testSupabase() {
  if (!supabase) {
    console.error("Supabase is not initialized");
    return;
  }

  const { data, error } = await supabase.from("projects").select("*");
  if (error) {
    console.log(error);
    return;
  }

  console.log(data);
}
