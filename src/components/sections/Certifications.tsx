import { Award, ExternalLink } from "lucide-react";
import { useCertificates } from "@/hooks/useCertificates";
import { Reveal, Section, SectionEyebrow } from "./_shared";

export function Certifications() {
  const { data: certifications, isLoading, error } = useCertificates();

  return (
    <Section id="certifications">
      <Reveal className="text-center max-w-2xl mx-auto mb-12">
        <SectionEyebrow align="center">Certifications</SectionEyebrow>
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-foreground mt-3">
          Continuous Learning
        </h2>
      </Reveal>

      {isLoading ? (
        <div className="text-center text-sm text-text-secondary">Loading certifications…</div>
      ) : error ? (
        <div className="text-center text-sm text-red-400">{error}</div>
      ) : certifications.length === 0 ? (
        <div className="text-center text-sm text-text-secondary">No certifications available yet.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.05}>
            <article className="group h-full rounded-2xl border border-border bg-surface overflow-hidden transition-all hover:border-primary/40 hover:-translate-y-1">
              <div
                className={`relative h-36 bg-gradient-to-br ${c.gradient} flex items-center justify-center`}
              >
                <div className="absolute inset-0 dot-grid opacity-20" />
                <Award className="h-14 w-14 text-white/95" strokeWidth={1.4} />
              </div>
              <div className="p-5 space-y-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary">
                  {c.issuer}
                </span>
                <h3 className="font-display font-bold text-foreground leading-snug">
                  {c.title}
                </h3>
                <p className="text-sm text-text-secondary">{c.date}</p>
                <a
                  href={c.link}
                  className="mt-3 inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:border-primary/40 hover:text-primary transition-colors"
                >
                  Verify Certificate <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </article>
          </Reveal>
          ))}
        </div>
      )}
    </Section>
  );
}
