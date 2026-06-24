import { BookOpen, Calendar, GraduationCap } from "lucide-react";
import { education } from "@/data/portfolio";
import { Reveal, Section, SectionEyebrow } from "./_shared";

export function Education() {
  return (
    <Section id="education">
      <Reveal className="text-center max-w-2xl mx-auto mb-12">
        <SectionEyebrow align="center">Education</SectionEyebrow>
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-foreground mt-3">
          Academic Foundation
        </h2>
      </Reveal>

      <Reveal>
        <div className="max-w-3xl mx-auto rounded-2xl border border-border bg-surface p-8 sm:p-10 flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
          <span className="inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-[0_10px_30px_-10px_rgba(124,58,237,0.7)]">
            <GraduationCap className="h-8 w-8" />
          </span>
          <div className="flex-1 space-y-3">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
              Degree
            </span>
            <h3 className="font-display font-bold text-2xl sm:text-[28px] text-foreground leading-tight">
              {education.degree}
            </h3>
            <p className="italic text-text-secondary">{education.university}</p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <span className="inline-flex items-center gap-2 text-sm text-text-secondary">
                <Calendar className="h-4 w-4 text-primary" />
                {education.period}
              </span>
              <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                GPA: {education.gpa}
              </span>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.1} className="mt-10">
        <h4 className="font-display font-semibold text-foreground text-center mb-6">
          Relevant Coursework
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-4xl mx-auto">
          {education.courses.map((c) => (
            <div
              key={c}
              className="flex items-center gap-3 rounded-xl border border-border bg-elevated px-4 py-3 text-sm text-foreground hover:border-primary/40 transition-colors"
            >
              <BookOpen className="h-4 w-4 text-primary shrink-0" />
              <span className="truncate">{c}</span>
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
