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
