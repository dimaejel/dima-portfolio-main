import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowDown, ArrowUp, Download, Github, Linkedin, Mail, User } from "lucide-react";
import { personalInfo, navLinks } from "@/data/portfolio";

function Typewriter({ words }: { words: string[] }) {
  const reduce = useReducedMotion();
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduce) {
      setText(words[0]);
      return;
    }
    const current = words[idx % words.length];
    const speed = deleting ? 40 : 80;
    const t = setTimeout(() => {
      if (!deleting) {
        const next = current.slice(0, text.length + 1);
        setText(next);
        if (next === current) {
          setTimeout(() => setDeleting(true), 1400);
        }
      } else {
        const next = current.slice(0, text.length - 1);
        setText(next);
        if (next === "") {
          setDeleting(false);
          setIdx((i) => i + 1);
        }
      }
    }, speed);
    return () => clearTimeout(t);
  }, [text, deleting, idx, words, reduce]);

  return (
    <span className="font-mono text-primary">
      {text}
      <span className="ml-0.5 inline-block w-[2px] h-[1em] align-middle bg-primary animate-blink" />
    </span>
  );
}

function ProfilePhoto() {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="relative h-full w-full rounded-full bg-gradient-to-br from-elevated to-surface border border-border flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-30" />
        <User className="h-24 w-24 text-text-muted relative" />
        <span className="mt-3 text-xs font-mono text-text-muted relative">Your Photo Here</span>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full rounded-full overflow-hidden border-2 border-primary/30 shadow-[0_0_40px_rgba(79,142,247,0.2)]">
      <img
        src="/profile.jpg"
        alt={`${personalInfo.name} — profile photo`}
        onError={() => setHasError(true)}
        className="h-full w-full object-cover"
        style={{
          position: "absolute",
          width: "150%",
          height: "100%",
          top: "0.5%",
          left: "-1.5%",
          objectFit: "cover",
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background/40 to-transparent" />
    </div>
  );
}

export function Hero() {
  const orbitChips = ["React", "Java", "Node.js", "MySQL"];

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/Dima%20Ejel.pdf";
    link.download = "Dima Ejel.pdf";
    link.click();
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden"
    >
      {/* background decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 dot-grid opacity-40" />
        <div className="absolute -top-32 -right-32 h-[480px] w-[480px] rounded-full bg-primary/15 blur-[120px] animate-blob" />
        <div className="absolute -bottom-40 -left-32 h-[460px] w-[460px] rounded-full bg-secondary/15 blur-[120px] animate-blob [animation-delay:-6s]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 w-full grid lg:grid-cols-[1.2fr_1fr] gap-14 items-center">
        {/* LEFT */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-foreground">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              Available for Opportunities
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="font-display font-extrabold tracking-tight text-foreground text-5xl sm:text-6xl lg:text-7xl leading-[1.05]"
          >
            {personalInfo.name}
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="font-display font-semibold text-2xl sm:text-3xl text-gradient"
          >
            {personalInfo.title}
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="text-lg font-mono min-h-7"
            aria-live="polite"
          >
            <Typewriter words={personalInfo.roles} />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-lg leading-relaxed text-text-secondary max-w-xl"
          >
            {personalInfo.bio}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.6 }}
            className="flex flex-wrap items-center gap-3"
          >
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(124,58,237,0.7)] transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary/70"
            >
              View Projects <ArrowDown className="h-4 w-4" />
            </a>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 rounded-xl border border-primary px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/70"
            >
              <Download className="h-4 w-4" /> Download CV
            </button>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-text-secondary transition-colors hover:text-foreground"
            >
              <Mail className="h-4 w-4" /> Contact Me
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.95, duration: 0.6 }}
            className="flex items-center gap-5 pt-1"
          >
            <a
              href={personalInfo.githubUrl}
              aria-label="GitHub"
              className="text-text-muted hover:text-primary transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href={personalInfo.linkedinUrl}
              aria-label="LinkedIn"
              className="text-text-muted hover:text-primary transition-colors"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href={`mailto:${personalInfo.email}`}
              aria-label="Email"
              className="text-text-muted hover:text-primary transition-colors"
            >
              <Mail className="h-5 w-5" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 max-w-xl"
          >
            {personalInfo.stats.map((s) => (
              <div key={s.label} className="rounded-xl border border-border bg-surface px-4 py-3">
                <div className="font-display font-bold text-foreground text-lg">{s.value}</div>
                <div className="text-xs text-text-muted">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* RIGHT */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
          className="relative mx-auto h-[280px] w-[280px] sm:h-[360px] sm:w-[360px]"
        >
          {/* glow behind photo */}
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-3xl" />

          {/* photo or fallback */}
          <ProfilePhoto />

          {/* orbiting chips */}
          <div className="pointer-events-none absolute inset-0 hidden sm:block">
            {orbitChips.map((chip, i) => (
              <div
                key={chip}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{
                  // @ts-expect-error CSS custom property
                  "--orbit-r": "190px",
                  animation: `orbit ${22 + i * 2}s linear infinite`,
                  animationDelay: `${-i * 5}s`,
                }}
              >
                <span className="inline-flex items-center rounded-full border border-border bg-surface/90 backdrop-blur px-3 py-1 text-xs font-mono text-foreground shadow-lg">
                  {chip}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* scroll indicator */}
      <a
        href={navLinks[1].href}
        aria-label="Scroll to about"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-text-muted hover:text-primary"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="h-5 w-5" />
        </motion.div>
      </a>
    </section>
  );
}

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const fn = () => setVisible(window.scrollY > 300);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  if (!visible) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="fixed bottom-6 right-6 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full bg-gradient-brand text-white shadow-[0_10px_30px_-10px_rgba(124,58,237,0.7)] focus:outline-none focus:ring-2 focus:ring-primary/70"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
