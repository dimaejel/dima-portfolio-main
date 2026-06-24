import { CheckCircle2 } from "lucide-react";
import { achievements } from "@/data/portfolio";
import { Reveal, Section, SectionEyebrow } from "./_shared";

export function Achievements() {
  return (
    <Section id="achievements" className="bg-surface/60">
      <Reveal className="text-center max-w-2xl mx-auto mb-12">
        <SectionEyebrow align="center">Achievements</SectionEyebrow>
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-foreground mt-3">
          Milestones Along the Way
        </h2>
      </Reveal>

      <div className="grid md:grid-cols-3 gap-6">
        {achievements.map((a, i) => {
          const Icon = a.icon;
          return (
            <Reveal key={a.title} delay={i * 0.08}>
              <article className="h-full rounded-2xl border border-border bg-elevated p-8 transition-all hover:border-primary/40">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-brand text-white mb-5">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="font-display font-bold text-foreground text-lg mb-4">
                  {a.title}
                </h3>
                <ul className="space-y-3">
                  {a.items.map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm text-text-secondary">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
