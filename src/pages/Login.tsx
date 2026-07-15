import { useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";

export function LoginPage() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const { login } = useAuth();
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirect = typeof search.redirect === "string" ? search.redirect : "/admin";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate({ to: redirect as never });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 shadow-xl">
        <h1 className="text-2xl font-semibold">Portfolio CMS Login</h1>
        <p className="mt-2 text-sm text-text-secondary">Sign in to manage portfolio content.</p>
        <div className="mt-6 space-y-4">
          <label className="block text-sm">
            <span className="mb-2 block">Email</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2" />
          </label>
          <label className="block text-sm">
            <span className="mb-2 block">Password</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2" />
          </label>
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          <button disabled={isSubmitting} className="w-full rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground">
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </div>
      </form>
    </div>
  );
}
