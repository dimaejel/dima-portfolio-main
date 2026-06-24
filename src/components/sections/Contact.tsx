import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Github, Linkedin, Loader2, Mail, MapPin, Send } from "lucide-react";
import { personalInfo } from "@/data/portfolio";
import { Reveal, Section, SectionEyebrow } from "./_shared";

const schema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Enter a valid email address"),
  subject: z.string().min(3, "Add a brief subject"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormData = z.infer<typeof schema>;

export function Contact() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    await new Promise((r) => setTimeout(r, 1100));
    console.log("Contact form:", data);
    setSent(true);
    reset();
    setTimeout(() => setSent(false), 4000);
  };

  const inputClass =
    "w-full rounded-xl bg-elevated border border-border text-foreground placeholder:text-text-muted px-3.5 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors";

  return (
    <Section id="contact">
      <div className="grid lg:grid-cols-2 gap-12">
        <Reveal className="space-y-6">
          <SectionEyebrow>Contact</SectionEyebrow>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-foreground">
            Let's Work <span className="text-gradient">Together.</span>
          </h2>
          <p className="text-text-secondary leading-relaxed">
            I'm currently open to full-time Software Engineering, Web Development, and IT
            roles. Reach out — I respond within 24 hours.
          </p>

          <div className="space-y-3 pt-2">
            <ContactRow
              icon={<Mail className="h-5 w-5" />}
              label="Email"
              value={personalInfo.email}
              href={`mailto:${personalInfo.email}`}
            />
            <ContactRow
              icon={<Linkedin className="h-5 w-5" />}
              label="LinkedIn"
              value={personalInfo.linkedin}
              href={personalInfo.linkedinUrl}
            />
            <ContactRow
              icon={<Github className="h-5 w-5" />}
              label="GitHub"
              value={personalInfo.github}
              href={personalInfo.githubUrl}
            />
            <ContactRow
              icon={<MapPin className="h-5 w-5" />}
              label="Location"
              value={personalInfo.location}
            />
          </div>

          <div className="flex items-center gap-3 pt-4">
            {[
              { icon: Github, href: personalInfo.githubUrl, label: "GitHub" },
              { icon: Linkedin, href: personalInfo.linkedinUrl, label: "LinkedIn" },
              { icon: Mail, href: `mailto:${personalInfo.email}`, label: "Email" },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-text-secondary hover:bg-primary/10 hover:border-primary hover:text-primary transition-colors"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-2xl border border-border bg-surface p-6 sm:p-8 space-y-4"
            noValidate
          >
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Jane Doe"
                {...register("name")}
                className={inputClass}
              />
              {errors.name && (
                <p className="mt-1.5 text-sm text-red-400">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@company.com"
                {...register("email")}
                className={inputClass}
              />
              {errors.email && (
                <p className="mt-1.5 text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-1.5">
                Subject
              </label>
              <input
                id="subject"
                type="text"
                placeholder="Opportunity at Acme Corp"
                {...register("subject")}
                className={inputClass}
              />
              {errors.subject && (
                <p className="mt-1.5 text-sm text-red-400">{errors.subject.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1.5">
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                placeholder="Tell me a bit about the role and team…"
                {...register("message")}
                className={`${inputClass} resize-y min-h-32`}
              />
              {errors.message && (
                <p className="mt-1.5 text-sm text-red-400">{errors.message.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-brand px-5 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(124,58,237,0.7)] disabled:opacity-70 transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary/70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" /> Send Message
                </>
              )}
            </button>

            {sent && (
              <p className="text-sm text-success text-center">
                Thanks! Your message has been received.
              </p>
            )}
          </form>
        </Reveal>
      </div>
    </Section>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const Inner = (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-surface px-4 py-3 transition-colors hover:border-primary/40">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </span>
      <div className="min-w-0">
        <div className="text-xs font-mono uppercase tracking-wider text-text-muted">
          {label}
        </div>
        <div className="text-sm text-foreground truncate">{value}</div>
      </div>
    </div>
  );
  return href ? (
    <a href={href} className="block">
      {Inner}
    </a>
  ) : (
    Inner
  );
}
