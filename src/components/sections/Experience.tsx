import { Briefcase } from "lucide-react";
import { useExperience } from "@/hooks/useExperience";
import type { ExperienceItem } from "@/types";
import { Reveal, Section, SectionEyebrow } from "./_shared";

const badgeColors: Record<string, string> = {
  Internship: "bg-primary/15 text-primary border-primary/30",
  Academic: "bg-secondary/15 text-secondary border-secondary/30",
  Freelance: "bg-success/15 text-success border-success/30",
  Volunteer: "bg-orange-500/15 text-orange-400 border-orange-400/30",
};

export function ExperienceSection() {
  const { data: experience, isLoading, error } = useExperience();

  return (
    <Section id="experience" className="bg-surface/60">
      <Reveal className="text-center max-w-2xl mx-auto mb-14">
        <SectionEyebrow align="center">Experience</SectionEyebrow>
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-foreground mt-3">
          A Growing Journey
        </h2>
      </Reveal>

      {isLoading ? (
        <div className="text-center text-sm text-text-secondary">Loading experience…</div>
      ) : error ? (
        <div className="text-center text-sm text-red-400">{error}</div>
      ) : experience.length === 0 ? (
        <div className="text-center text-sm text-text-secondary">No experience entries available yet.</div>
      ) : (
        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-px bg-gradient-to-b from-primary/60 via-secondary/40 to-transparent" />

          <div className="space-y-8">
            {experience.map((e, i) => (
            <Reveal key={e.role + i} delay={i * 0.05}>
              <div className="relative pl-12 sm:pl-16">
                <span className="absolute left-2.5 sm:left-4.5 top-5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-gradient-brand ring-4 ring-background">
                  <Briefcase className="h-2.5 w-2.5 text-white" />
                </span>
                <article
                  className="rounded-2xl border border-border bg-elevated p-6 border-l-[3px] border-l-primary"
                  style={{
                    borderImage: "linear-gradient(180deg,#4F8EF7,#7C3AED) 1",
                  }}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                    <div>
                      <h3 className="font-display font-bold text-foreground text-lg">
                        {e.role}
                      </h3>
                      <p className="text-sm text-text-secondary">{e.company}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${badgeColors[e.type]}`}
                      >
                        {e.type}
                      </span>
                      <span className="font-mono text-xs text-text-muted">{e.period}</span>
                    </div>
                  </div>
                  <ul className="mt-3 space-y-1.5 text-sm text-text-secondary">
                    {e.bullets.map((b) => (
                      <li key={b} className="flex gap-2.5">
                        <span className="mt-2 inline-block h-1 w-1 rounded-full bg-primary shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </div>
            </Reveal>
            ))}
          </div>
        </div>
      )}
    </Section>
  );
}
