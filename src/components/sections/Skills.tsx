import { motion } from "motion/react";
import { skillGroups } from "@/data/portfolio";
import { Reveal, Section, SectionEyebrow, staggerContainer, staggerItem } from "./_shared";

export function Skills() {
  return (
    <Section id="skills" className="bg-surface/60">
      <Reveal className="text-center max-w-2xl mx-auto mb-14">
        <SectionEyebrow align="center">My Technical Arsenal</SectionEyebrow>
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-foreground mt-3">
          Technologies I've worked with
        </h2>
        <p className="text-text-secondary mt-4">
          A toolkit shaped by curiosity, coursework, and real projects — from systems-level
          languages to modern web stacks.
        </p>
      </Reveal>

      <div className="space-y-12">
        {skillGroups.map((group) => (
          <Reveal key={group.title}>
            <div className="flex items-center gap-4 mb-5">
              <h3 className="font-display font-bold text-foreground text-lg">
                {group.title}
              </h3>
              <span className="h-px flex-1 bg-border" />
              <span className="font-mono text-xs text-text-muted">
                {group.skills.length.toString().padStart(2, "0")}
              </span>
            </div>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
            >
              {group.skills.map((skill) => (
                <motion.div
                  key={skill.name}
                  variants={staggerItem}
                  whileHover={{ scale: 1.03 }}
                  className="group rounded-2xl border border-border bg-elevated p-5 transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_24px_rgba(79,142,247,0.15)]"
                >
                  <div className="flex items-center gap-4">
                    <span
                      className="inline-flex h-11 w-11 items-center justify-center rounded-xl font-display font-bold text-sm text-white shadow-inner"
                      style={{
                        background: `linear-gradient(135deg, ${skill.color}, ${skill.color}aa)`,
                      }}
                      aria-hidden
                    >
                      {skill.badge}
                    </span>
                    <div>
                      <div className="font-semibold text-foreground">{skill.name}</div>
                      <div className="text-xs font-mono text-text-muted uppercase tracking-wider">
                        {group.title.split(" ")[0]}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
