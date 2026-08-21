import { CheckCircle2, Clock, Flag, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import type { Status } from "@/data/skillpass";
import { cn } from "@/lib/utils";

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("eyebrow text-ink-soft", className)}>{children}</p>;
}

export function Card({
  children,
  className,
  hover,
  as: As = "div",
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  as?: "div" | "li" | "article" | "section";
}) {
  return <As className={cn("doc-card p-4", hover && "doc-card-hover", className)}>{children}</As>;
}

export function Button({
  children,
  variant = "primary",
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "outline" | "quiet" }) {
  return (
    <button
      {...rest}
      className={cn(
        "inline-flex items-center gap-2 rounded-sm px-3 py-2 text-[13px] font-medium transition-colors duration-150 ease-out",
        variant === "primary" && "bg-primary text-primary-foreground hover:opacity-90",
        variant === "outline" && "border border-border text-ink hover:border-brass",
        variant === "quiet" && "text-ink-soft hover:text-ink",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function StatTile({
  icon: Icon,
  label,
  value,
  note,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  note: string;
}) {
  return (
    <Card hover className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Eyebrow>{label}</Eyebrow>
        <Icon size={20} strokeWidth={1.5} className="text-bottle dark:text-brass" />
      </div>
      <p className="font-slab text-[28px] leading-8 text-ink">{value}</p>
      <p className="text-[13px] leading-[18px] text-ink-soft">{note}</p>
    </Card>
  );
}

const statusMap: Record<Status, { icon: LucideIcon; className: string }> = {
  Verified: { icon: CheckCircle2, className: "text-bottle dark:text-[#7FB894]" },
  Pending: { icon: Clock, className: "text-brass" },
  "Needs Review": { icon: Flag, className: "text-gap" },
};

export function StatusBadge({ status }: { status: Status }) {
  const { icon: Icon, className } = statusMap[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm border border-border px-2 py-1 text-[13px] font-semibold leading-[18px]",
        className,
      )}
    >
      <Icon size={18} strokeWidth={1.5} />
      {status}
    </span>
  );
}

export function KindBadge({ kind }: { kind: "Internship" | "Team" }) {
  return (
    <span className="eyebrow inline-flex items-center rounded-sm border border-border px-2 py-1 text-ink">
      {kind}
    </span>
  );
}

export function Ring({
  value,
  size = 64,
  label,
}: {
  value: number;
  size?: number;
  label?: string;
}) {
  const stroke = 6;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" role="img" aria-label={`${label ?? "Score"}: ${value}%`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-border" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="butt"
          strokeDasharray={`${(c * value) / 100} ${c}`}
          className="stroke-primary"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-mono text-[13px] tabular-nums text-ink">
        {value}%
      </span>
    </div>
  );
}

export function ProficiencyBar({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-1" role="img" aria-label={`Proficiency ${level} of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={cn("h-2 w-6 rounded-sm border", i <= level ? "border-primary bg-primary" : "border-border")}
        />
      ))}
    </div>
  );
}

export function FairnessNote({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 border-t border-border pt-3">
      <span className="mt-0.5 text-brass">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      </span>
      <div>
        <p className="eyebrow text-ink-soft">Fairness check</p>
        <p className="mt-1 text-[13px] leading-[18px] text-ink">{text}</p>
      </div>
    </div>
  );
}
