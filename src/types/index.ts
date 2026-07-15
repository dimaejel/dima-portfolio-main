export interface ProjectItem {
  id?: string;
  title: string;
  category: string;
  description: string;
  techStack: string[];
  github: string;
  demo: string;
  gradient: string;
  featured?: boolean;
}

export interface SkillGroupItem {
  id?: string;
  title: string;
  skills: Array<{ name: string; badge: string; color: string }>;
}

export interface ExperienceItem {
  id?: string;
  role: string;
  company: string;
  period: string;
  type: string;
  bullets: string[];
}

export interface CertificateItem {
  id?: string;
  title: string;
  issuer: string;
  date: string;
  link: string;
  gradient: string;
}

export interface ProfileItem {
  id?: string;
  bio?: string;
  avatarUrl?: string;
  location?: string;
  website?: string;
}

export interface UserItem {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "USER";
  profile?: ProfileItem;
}
