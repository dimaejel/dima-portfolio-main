import { personalInfo } from "@/data/portfolio";
import { Reveal, Section, SectionEyebrow } from "./_shared";

export function About() {
  return (
    <Section id="about">
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <Reveal className="space-y-6">
          <SectionEyebrow>About Me</SectionEyebrow>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-foreground">
            Crafting Code, <span className="text-gradient">Solving Problems.</span>
          </h2>
          <div className="space-y-4 text-text-secondary leading-relaxed">
            <p>
              I'm a Computer Science graduate with a deep passion for software development
              and technology. My academic journey has equipped me with strong foundations in
              algorithms, data structures, software engineering principles, and full-stack
              development.
            </p>
            <p>
              I love breaking down complex problems into elegant solutions. Whether it's
              building efficient backend systems, designing intuitive web interfaces, or
              modeling relational databases — I approach every challenge with curiosity and
              discipline.
            </p>
            <p>
              My goal is to join a forward-thinking team where I can contribute meaningful
              code from day one, grow as an engineer, and help build products that make a
              real difference.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            {personalInfo.interests.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
              >
                #{tag.replace(/\s+/g, "")}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.15} className="space-y-4">
          <div className="rounded-2xl border border-border bg-surface overflow-hidden shadow-[0_30px_80px_-40px_rgba(0,0,0,0.8)]">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-elevated/60">
              <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
              <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
              <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
              <span className="ml-3 text-xs font-mono text-text-muted">developer.ts</span>
            </div>
            <pre className="px-5 py-5 text-sm leading-relaxed font-mono overflow-x-auto">
              <code>
                <span className="text-[#c586c0]">const</span>{" "}
                <span className="text-[#4fc1ff]">developer</span>{" "}
                <span className="text-foreground">=</span>{" "}
                <span className="text-foreground">{"{"}</span>
                {"\n  "}
                <span className="text-[#9cdcfe]">name</span>
                <span className="text-foreground">:</span>{" "}
                <span className="text-[#ce9178]">"{personalInfo.name}"</span>
                <span className="text-foreground">,</span>
                {"\n  "}
                <span className="text-[#9cdcfe]">role</span>
                <span className="text-foreground">:</span>{" "}
                <span className="text-[#ce9178]">""Full Stack Developer"</span>
                <span className="text-foreground">,</span>
                {"\n  "}
                <span className="text-[#9cdcfe]">skills</span>
                <span className="text-foreground">: [</span>
                <span className="text-[#ce9178]">"Java"</span>
                <span className="text-foreground">, </span>
                <span className="text-[#ce9178]">"React"</span>
                <span className="text-foreground">, </span>
                <span className="text-[#ce9178]">"Node.js"</span>
                <span className="text-foreground">],</span>
                {"\n  "}
               
                <span className="text-[#9cdcfe]">location</span>
                <span className="text-foreground">:</span>{" "}
                <span className="text-[#4fc1ff]">Jdeidet El Qaytaa, Lebanon </span>
                {"\n"}

                  <span className="text-[#9cdcfe]">  available</span>
                <span className="text-foreground">:</span>{" "}
                <span className="text-[#569cd6]">true</span>
                <span className="text-foreground">,</span>
                {"\n  "}
                
                <span className="text-foreground">{"};"}</span>
              </code>
            </pre>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-border bg-surface p-5">
              <div className="font-display font-extrabold text-3xl text-gradient">5+</div>
              <div className="text-sm text-text-secondary mt-1">Projects Completed</div>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-5">
              <div className="font-display font-extrabold text-3xl text-gradient">10+</div>
              <div className="text-sm text-text-secondary mt-1">Technologies</div>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
