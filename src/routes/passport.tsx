import { createFileRoute } from "@tanstack/react-router";
import { ChevronRight, Download, Share2, Stamp } from "lucide-react";
import { useEffect, useState } from "react";
import { Button, Card, Eyebrow, ProficiencyBar, StatusBadge } from "@/components/primitives";
import { profile, type SkillCategory } from "@/data/skillpass";
import { cn } from "@/lib/utils";
import { apiFetch, type EvidenceRecord, type UserSkill } from "@/lib/api";

export const Route = createFileRoute("/passport")({
  head: () => ({
    meta: [
      { title: "Skill Passport — Skillfolio" },
      { name: "description", content: "A portable, evidence-backed skill passport: verified technical, soft, and domain skills with traceable sources." },
      { property: "og:title", content: "Skill Passport — Skillfolio" },
      { property: "og:description", content: "Verified skills, proficiency levels, and the exact evidence behind each entry." },
    ],
  }),
  component: PassportPage,
});

const categories: SkillCategory[] = ["Technical", "Soft Skills", "Domain Knowledge"];
type PassportProfile = typeof profile & {
  verifiedSkills: number;
  totalSkills: number;
  evidenceItems: number;
};

function PassportHero({ profileData }: { profileData: PassportProfile }) {
  return (
    <section className="unfold relative overflow-hidden border-2 border-brass bg-surface">
      <div className="guilloche pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="relative flex flex-col gap-6 p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Eyebrow>Republic of verified skills</Eyebrow>
            <h1 className="mt-2 font-slab text-2xl leading-[30px] text-ink md:text-[32px] md:leading-[38px]">
              Skill Passport — {profileData.name}
            </h1>
            <p className="mt-2 font-mono text-[14px] tracking-[0.02em] tabular-nums text-ink">
              ID {profileData.passportId} · Issued 2026-06-14 · Valid through 2028-06-14
            </p>
          </div>
          <div className="flex shrink-0 -rotate-12 flex-col items-center border-2 border-brass px-3 py-2 text-brass">
            <Stamp size={20} strokeWidth={1.5} />
            <span className="eyebrow mt-1 text-brass">Verified</span>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            ["Holder", profileData.name],
            ["Issuing authority", "Skillfolio Registry"],
            ["Verified skills", `${profileData.verifiedSkills} of ${profileData.totalSkills}`],
            ["Evidence items", String(profileData.evidenceItems)],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="eyebrow text-ink-soft">{k}</dt>
              <dd className="mt-1 text-[15px] text-ink">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="flex flex-wrap gap-2">
          <Button>
            <Share2 size={18} strokeWidth={1.5} /> Share Passport
          </Button>
          <Button variant="outline">
            <Download size={18} strokeWidth={1.5} /> Export as PDF
          </Button>
        </div>

        <div className="border-t border-brass/50 pt-3">
          <pre className="overflow-x-auto whitespace-pre font-mono text-[13px] leading-[20px] tracking-[0.02em] text-ink">
{profile.mrz[0]}
{"\n"}
{profile.mrz[1]}
          </pre>
        </div>
      </div>
    </section>
  );
}

function SkillRow({ skill, evidence }: { skill: UserSkill; evidence: EvidenceRecord[] }) {
  const [open, setOpen] = useState(false);
  return (
    <li className="doc-card doc-card-hover">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full flex-col gap-3 p-4 text-left md:flex-row md:items-center md:justify-between"
      >
        <span className="flex items-center gap-2">
          <ChevronRight
            size={18}
            strokeWidth={1.5}
            className={cn("text-ink-soft transition-transform duration-150 ease-out", open && "rotate-90")}
          />
          <span className="text-[15px] text-ink">{skill.name}</span>
          {skill.verified ? (
            <span className="inline-flex items-center gap-1 text-brass" title="Verified skill">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
              <span className="text-[13px] font-semibold leading-[18px]">Verified</span>
            </span>
          ) : (
            <span className="text-[13px] font-semibold leading-[18px] text-gap">Self-reported</span>
          )}
        </span>
        <span className="flex items-center gap-4">
          <ProficiencyBar level={skill.level} />
          <span className="text-[13px] leading-[18px] text-ink-soft">
            Backed by {skill.evidence_ids.length} evidence {skill.evidence_ids.length === 1 ? "item" : "items"}
          </span>
        </span>
      </button>
      {open && (
        <ul className="border-t border-border px-4 py-3">
          {skill.evidence_ids.map((id) => {
            const ev = evidence.find((item) => item.id === id);
            if (!ev) return null;
            return (
              <li key={id} className="flex flex-col gap-1 py-2 md:flex-row md:items-center md:justify-between">
                <span>
                  <span className="text-[15px] text-ink">{ev.title}</span>
                  <span className="block text-[13px] leading-[18px] text-ink-soft">
                    {ev.source} · {ev.date}
                  </span>
                </span>
                <StatusBadge status={ev.status} />
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
}

function PassportPage() {
  const [tab, setTab] = useState<SkillCategory>("Technical");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [profileData, setProfileData] = useState<PassportProfile>({
    ...profile,
    verifiedSkills: 0,
    totalSkills: 0,
    evidenceItems: 0,
  });
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [userEvidence, setUserEvidence] = useState<EvidenceRecord[]>([]);

  useEffect(() => {
    void Promise.all([
      apiFetch<{ name: string; passport_id: string; strength: number; verified_skills: number; total_skills: number; evidence_items: number }>("/api/profile"),
      apiFetch<UserSkill[]>("/api/skills"),
      apiFetch<EvidenceRecord[]>("/api/evidence"),
    ])
      .then(([result, skillsResult, evidenceResult]) => {
        setProfileData({
          ...profile,
          name: result.name,
          passportId: result.passport_id,
          strength: result.strength,
          verifiedSkills: result.verified_skills,
          totalSkills: result.total_skills,
          evidenceItems: result.evidence_items,
        });
        setUserSkills(skillsResult);
        setUserEvidence(evidenceResult);
      })
      .catch(() => undefined);
  }, []);

  const rows = userSkills.filter((s) => s.category === tab && (!verifiedOnly || s.verified));

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8">
      <PassportHero profileData={profileData} />

      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-slab text-[20px] leading-[26px] text-ink">Skills of record</h2>
          <div className="flex rounded-sm border border-border">
            {(["Verified only", "Include self-reported"] as const).map((label, i) => {
              const active = verifiedOnly === (i === 0);
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => setVerifiedOnly(i === 0)}
                  className={cn(
                    "px-3 py-2 text-[13px] transition-colors duration-150 ease-out",
                    active ? "bg-primary text-primary-foreground" : "text-ink-soft hover:text-ink",
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex gap-1 border-b border-border" role="tablist">
          {categories.map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={tab === c}
              onClick={() => setTab(c)}
              className={cn(
                "-mb-px border-b-2 px-3 py-2 text-[15px] transition-colors duration-150 ease-out",
                tab === c ? "border-brass text-ink" : "border-transparent text-ink-soft hover:text-ink",
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <ul className="flex flex-col gap-2">
          {rows.map((skill) => (
            <SkillRow key={skill.id} skill={skill} evidence={userEvidence} />
          ))}
        </ul>
        {rows.length === 0 && (
          <Card>
            <p className="text-[15px] text-ink">
              No skills in this category yet. Add evidence in your vault to build your skill record.
            </p>
          </Card>
        )}
      </section>
    </div>
  );
}
