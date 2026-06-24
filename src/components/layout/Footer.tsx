import { Github, Linkedin, Mail } from "lucide-react";
import { navLinks, personalInfo } from "@/data/portfolio";

export function Footer() {
  return (
    <footer className="border-t border-border bg-[#060B17]">
      <div className="max-w-6xl mx-auto px-6 py-14 space-y-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-brand text-white font-bold">
              {personalInfo.initials}
            </span>
            <span className="font-display font-bold text-foreground text-lg">
              {personalInfo.name}
            </span>
          </div>
          <p className="text-text-secondary text-sm">
            Building tomorrow's software, one commit at a time.
          </p>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-text-secondary hover:text-primary transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border">
          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} {personalInfo.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href={personalInfo.githubUrl}
              aria-label="GitHub"
              className="text-text-muted hover:text-foreground transition-colors"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href={personalInfo.linkedinUrl}
              aria-label="LinkedIn"
              className="text-text-muted hover:text-foreground transition-colors"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href={`mailto:${personalInfo.email}`}
              aria-label="Email"
              className="text-text-muted hover:text-foreground transition-colors"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
