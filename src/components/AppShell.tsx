import { Link, useNavigate } from "@tanstack/react-router";
import { BadgeCheck, FolderLock, IdCard, LayoutDashboard, LogOut, ShieldCheck, Target } from "lucide-react";
import type { ReactNode } from "react";
import { logout } from "@/lib/api";
import { profile } from "@/data/skillpass";
import { apiFetch } from "@/lib/api";
import { ThemeToggle } from "@/components/theme";
import { Ring } from "@/components/primitives";
import { useEffect, useState } from "react";

const tabs = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/passport", label: "Skill Passport", icon: IdCard },
  { to: "/matches", label: "Matches", icon: Target },
  { to: "/evidence", label: "Evidence Vault", icon: FolderLock },
] as const;

function BiasBadge() {
  return (
    <span className="inline-flex items-center gap-2 rounded-sm border border-brass/60 bg-bottle px-2.5 py-1.5">
      <ShieldCheck size={18} strokeWidth={1.5} className="text-brass" />
      <span className="text-[13px] font-medium leading-[18px] text-primary-foreground">
        Bias-free matching active
      </span>
    </span>
  );
}

function IdentityChip() {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(profile);

  useEffect(() => {
    void apiFetch<{ name: string; passport_id: string; strength: number }>("/api/profile")
      .then((result) => setProfileData({ ...profile, name: result.name, passportId: result.passport_id, strength: result.strength }))
      .catch(() => undefined);
  }, []);

  function handleLogout() {
    logout();
    void navigate({ to: "/login", replace: true });
  }

  return (
    <div className="flex items-center gap-3 border-t border-border px-4 py-4">
      <span className="flex h-9 w-9 items-center justify-center rounded-sm border border-brass font-slab text-[15px] text-ink">
        K
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-semibold leading-[18px] text-ink">{profileData.name}</p>
        <p className="truncate font-mono text-[13px] leading-[18px] text-ink-soft">{profileData.passportId}</p>
      </div>
      <Ring value={profileData.strength} size={36} label="Profile strength" />
      <ThemeToggle />
      <button type="button" onClick={handleLogout} aria-label="Sign out" title="Sign out" className="text-ink-soft hover:text-ink">
        <LogOut size={18} strokeWidth={1.5} />
      </button>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background md:flex">
      <aside className="sticky top-0 hidden h-screen w-[264px] shrink-0 flex-col border-r border-border bg-surface md:flex">
        <div className="flex items-center gap-2 px-4 py-6">
          <BadgeCheck size={24} strokeWidth={1.5} className="text-brass" />
          <span className="font-slab text-[20px] leading-[26px] text-ink">Skillfolio</span>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-2">
          {tabs.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: to === "/" }}
              activeProps={{ className: "border-brass bg-primary/10 text-ink" }}
              inactiveProps={{ className: "border-transparent text-ink-soft" }}
              className="flex items-center gap-3 rounded-sm border px-3 py-2.5 text-[15px] transition-colors duration-150 ease-out hover:border-brass hover:text-ink"
            >
              <Icon size={18} strokeWidth={1.5} />
              {label}
            </Link>
          ))}
        </nav>
        <IdentityChip />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-border bg-background px-4 py-3 md:px-8">
          <div className="flex items-center gap-2 md:hidden">
            <BadgeCheck size={20} strokeWidth={1.5} className="text-brass" />
            <span className="font-slab text-[15px] text-ink">Skillfolio</span>
          </div>
          <p className="eyebrow hidden text-ink-soft md:block">Verified skill passport · SOAIDEATHON-S30</p>
          <BiasBadge />
        </header>

        <main className="flex-1 px-4 pb-28 pt-6 md:px-8 md:pb-12">{children}</main>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-30 grid grid-cols-4 border-t border-border bg-surface md:hidden">
        {tabs.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: to === "/" }}
            activeProps={{ className: "border-brass text-ink" }}
            inactiveProps={{ className: "border-transparent text-ink-soft" }}
            className="flex flex-col items-center gap-1 border-t-2 px-1 py-2.5 text-[11px] transition-colors duration-150 ease-out"
          >
            <Icon size={18} strokeWidth={1.5} />
            <span className="text-center leading-[14px]">{label.replace("Skill ", "").replace("Evidence ", "")}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
