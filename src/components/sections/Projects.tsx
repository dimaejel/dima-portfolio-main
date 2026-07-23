import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ExternalLink, Github, Sparkles } from "lucide-react";
import { categoryIcons } from "@/data/portfolio";
import { useProjects } from "@/hooks/useProjects";
import type { ProjectItem } from "@/types";
import { Reveal, Section, SectionEyebrow } from "./_shared";

const filters = ["All", "Web", "Desktop", "Database"] as const;
type Filter = (typeof filters)[number];

export function Projects() {
  const [filter, setFilter] = useState<Filter>("All");
  const { data: projects, isLoading, error } = useProjects();
  const list = useMemo(
    () => (filter === "All" ? projects : projects.filter((p) => p.category === filter)),
    [filter, projects],
  );

  return (
    <Section id="projects">
      <Reveal className="text-center max-w-2xl mx-auto mb-10">
        <SectionEyebrow align="center">Featured Projects</SectionEyebrow>
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-foreground mt-3">
          Things I've Built
        </h2>
        <p className="text-text-secondary mt-4">
          A selection of academic, personal, and freelance work spanning the web, desktop, and
          database design.
        </p>
      </Reveal>

      <Reveal className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all border ${
              filter === f
                ? "bg-gradient-brand text-white border-transparent shadow-[0_8px_24px_-8px_rgba(124,58,237,0.6)]"
                : "border-border text-text-secondary hover:text-foreground hover:border-primary/40"
            }`}
          >
            {f}
          </button>
        ))}
      </Reveal>

      {isLoading ? (
        <div className="text-center text-sm text-text-secondary">Loading projects…</div>
      ) : error ? (
        <div className="text-center text-sm text-red-400">{error}</div>
      ) : list.length === 0 ? (
        <div className="text-center text-sm text-text-secondary">No projects available yet.</div>
      ) : (
        <motion.div layout className="grid md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {list.map((p) => (
              <ProjectCard key={p.title} project={p} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </Section>
  );
}

function ProjectCard({ project }: { project: ProjectItem }) {
  const Icon = categoryIcons[project.category as keyof typeof categoryIcons] ?? categoryIcons.Web;
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="group relative flex flex-col rounded-2xl border border-border bg-surface overflow-hidden transition-shadow hover:shadow-[0_30px_80px_-40px_rgba(79,142,247,0.4)] hover:border-primary/40"
    >
      <div
        className={`relative h-52 bg-gradient-to-br ${project.gradient} flex items-center justify-center overflow-hidden`}
      >
        <div className="absolute inset-0 dot-grid opacity-20" />
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <Icon className="h-20 w-20 text-white/90 drop-shadow-lg" strokeWidth={1.2} />
        )}
        {project.featured && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-amber-400/95 text-amber-950 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">
            <Sparkles className="h-3 w-3" /> Featured
          </span>
        )}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 -translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
          <a
            href={project.github}
            aria-label="View on GitHub"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-background/80 backdrop-blur text-foreground hover:bg-background"
          >
            <Github className="h-4 w-4" />
          </a>
          <a
            href={project.demo}
            aria-label="Live demo"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-background/80 backdrop-blur text-foreground hover:bg-background"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-6 gap-3">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
          {project.category}
        </span>
        <h3 className="font-display font-bold text-xl text-foreground">{project.title}</h3>
        <p className="text-sm text-text-secondary leading-relaxed">{project.description}</p>
        <div className="flex flex-wrap gap-2 pt-1">
          {project.techStack.map((t) => (
            <span
              key={t}
              className="rounded-full border border-border bg-elevated px-2.5 py-1 text-[11px] font-mono text-text-secondary"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="flex gap-3 pt-4 mt-auto">
          <a
            href={project.github}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground hover:border-primary/40 hover:text-primary transition-colors"
          >
            <Github className="h-3.5 w-3.5" /> GitHub
          </a>
          <a
            href={project.demo}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-brand px-3 py-2 text-xs font-semibold text-white shadow-[0_8px_24px_-10px_rgba(124,58,237,0.6)]"
          >
            <ExternalLink className="h-3.5 w-3.5" /> Live Demo
          </a>
        </div>
      </div>
    </motion.article>
  );
}
