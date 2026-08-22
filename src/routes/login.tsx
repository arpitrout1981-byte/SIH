import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { BadgeCheck, LockKeyhole, ShieldCheck } from "lucide-react";
import { FormEvent, useState } from "react";
import { login as apiLogin, signup as apiSignup } from "@/lib/api";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [signingUp, setSigningUp] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim() || !password || (signingUp && !name.trim())) {
      setError(signingUp ? "Enter your name, email, and password." : "Enter your email and password to continue.");
      return;
    }

    const action = signingUp ? apiSignup(email.trim(), password, name.trim()) : apiLogin(email.trim(), password);
    void action
      .then(() => navigate({ to: "/" }))
      .catch((reason: unknown) => {
        setError(reason instanceof Error ? reason.message : "Unable to sign in.");
      });
  }

  return (
    <main className="guilloche flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <section className="doc-card unfold w-full max-w-md bg-surface p-6 shadow-float md:p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BadgeCheck size={26} strokeWidth={1.5} className="text-brass" />
            <span className="font-slab text-xl text-ink">Skillfolio</span>
          </div>
          <ShieldCheck size={22} strokeWidth={1.5} className="text-brass" />
        </div>

        <div className="mt-10">
          <p className="eyebrow text-ink-soft">Verified skill passport</p>
          <h1 className="mt-2 font-slab text-3xl leading-tight text-ink">{signingUp ? "Create your passport" : "Welcome back"}</h1>
          <p className="mt-2 text-[15px] text-ink-soft">
            {signingUp ? "Start with an empty passport and build it with your own evidence." : "Sign in to open your dashboard and continue building your profile."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
          {signingUp && (
            <label className="flex flex-col gap-1.5 text-[13px] font-medium text-ink">
              Full name
              <input type="text" value={name} onChange={(event) => setName(event.target.value)} className="h-11 rounded-sm border border-input bg-background px-3 text-[15px] text-ink" autoComplete="name" required />
            </label>
          )}
          <label className="flex flex-col gap-1.5 text-[13px] font-medium text-ink">
            Email address
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="h-11 rounded-sm border border-input bg-background px-3 text-[15px] text-ink placeholder:text-ink-soft"
              autoComplete="email"
              required
            />
          </label>
          <label className="flex flex-col gap-1.5 text-[13px] font-medium text-ink">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              className="h-11 rounded-sm border border-input bg-background px-3 text-[15px] text-ink placeholder:text-ink-soft"
              autoComplete="current-password"
              required
            />
          </label>
          {error && <p className="text-[13px] text-gap">{error}</p>}
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-sm bg-primary px-4 text-[15px] font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <LockKeyhole size={17} strokeWidth={1.5} />
            {signingUp ? "Create account" : "Sign in"}
          </button>
        </form>

        <button type="button" onClick={() => { setSigningUp((value) => !value); setError(""); }} className="mt-6 w-full border-t border-border pt-4 text-center text-[12px] leading-[18px] text-ink-soft underline underline-offset-4">
          {signingUp ? "Already have an account? Sign in" : "New here? Create an account"}
        </button>
      </section>
    </main>
  );
}
