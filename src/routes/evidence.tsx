import { createFileRoute } from "@tanstack/react-router";
import {
  Award,
  BookOpen,
  FileBadge,
  FolderGit2,
  Plus,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { Button, Card, Eyebrow, StatusBadge } from "@/components/primitives";
import { createEvidence, apiFetch, type EvidenceRecord } from "@/lib/api";
import type { EvidenceType } from "@/data/skillpass";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/evidence")({
  head: () => ({
    meta: [
      { title: "Evidence Vault — Skillfolio" },
      { name: "description", content: "Every course, project, competition, and micro-credential behind the passport, with verification status and the skills it feeds." },
      { property: "og:title", content: "Evidence Vault — Skillfolio" },
      { property: "og:description", content: "Traceable evidence records: coursework, projects, competitions, and micro-credentials." },
    ],
  }),
  component: EvidencePage,
});

const typeIcon: Record<EvidenceType, typeof BookOpen> = {
  course: BookOpen,
  project: FolderGit2,
  competition: Award,
  credential: FileBadge,
};

const typeLabel: Record<EvidenceType, string> = {
  course: "Course",
  project: "Project",
  competition: "Competition",
  credential: "Micro-credential",
};

function AddEvidenceModal({ onClose, onSaved }: { onClose: () => void; onSaved: (item: EvidenceRecord) => void }) {
  const [title, setTitle] = useState("");
  const [source, setSource] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [type, setType] = useState<EvidenceType>("course");
  const [skills, setSkills] = useState("");
  const [detail, setDetail] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const item = await createEvidence({ title, source, date, type, skills: skills.split(",").map((skill) => skill.trim()).filter(Boolean), detail });
      onSaved(item);
      onClose();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to save evidence.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#14201B]/50 p-4 md:items-center" role="dialog" aria-modal="true" aria-label="Add evidence">
      <div className="w-full max-w-lg rounded-md border border-border bg-surface shadow-float">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="font-slab text-[20px] leading-[26px] text-ink">Add Evidence</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="text-ink-soft hover:text-ink">
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4">
          <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Evidence title" required className="h-10 rounded-sm border border-input bg-background px-3 text-[14px] text-ink" />
          <input value={source} onChange={(event) => setSource(event.target.value)} placeholder="Issuer or source" required className="h-10 rounded-sm border border-input bg-background px-3 text-[14px] text-ink" />
          <div className="grid grid-cols-2 gap-3">
            <select value={type} onChange={(event) => setType(event.target.value as EvidenceType)} className="h-10 rounded-sm border border-input bg-background px-3 text-[14px] text-ink">
              {Object.keys(typeLabel).map((value) => <option key={value} value={value}>{typeLabel[value as EvidenceType]}</option>)}
            </select>
            <input type="date" value={date} onChange={(event) => setDate(event.target.value)} required className="h-10 rounded-sm border border-input bg-background px-3 text-[14px] text-ink" />
          </div>
          <input value={skills} onChange={(event) => setSkills(event.target.value)} placeholder="Skills, separated by commas" className="h-10 rounded-sm border border-input bg-background px-3 text-[14px] text-ink" />
          <textarea value={detail} onChange={(event) => setDetail(event.target.value)} placeholder="Details or verification notes" className="min-h-20 rounded-sm border border-input bg-background p-3 text-[14px] text-ink" />
          {error && <p className="text-[13px] text-gap">{error}</p>}
          <div className="flex justify-end gap-2 border-t border-border pt-3">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit"><Upload size={18} strokeWidth={1.5} /> Save evidence</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EvidenceCard({ item }: { item: EvidenceRecord }) {
  const [open, setOpen] = useState(false);
  const Icon = typeIcon[item.type];
  const fed = item.skills;
  return (
    <Card as="li" hover className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <span className="flex items-center gap-2">
          <Icon size={20} strokeWidth={1.5} className="text-bottle dark:text-brass" />
          <Eyebrow>{typeLabel[item.type]}</Eyebrow>
        </span>
        <StatusBadge status={item.status} />
      </div>
      <h3 className="font-slab text-[15px] leading-[22px] text-ink">{item.title}</h3>
      <p className="text-[13px] leading-[18px] text-ink-soft">
        {item.source} · <span className="font-mono tabular-nums">{item.date}</span>
      </p>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="self-start text-[13px] font-medium text-ink underline decoration-brass decoration-2 underline-offset-4"
      >
        {open ? "Hide passport entries" : `Feeds ${fed.length} passport ${fed.length === 1 ? "entry" : "entries"}`}
      </button>
      {open && (
        <div className="border-t border-border pt-3">
          <p className="text-[13px] leading-[18px] text-ink-soft">{item.detail}</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {fed.map((skill) => (
              <li
                key={s.id}
                className="rounded-sm border border-border px-2 py-1 text-[13px] leading-[18px] text-ink"
              >
                {skill}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}

function EvidencePage() {
  const [modal, setModal] = useState(false);
  const [type, setType] = useState<EvidenceType | "all">("all");
  const [evidence, setEvidence] = useState<EvidenceRecord[]>([]);

  useEffect(() => {
    void apiFetch<EvidenceRecord[]>("/api/evidence").then(setEvidence);
  }, []);

  const list = evidence.filter((e) => type === "all" || e.type === type);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Eyebrow>Records</Eyebrow>
          <h1 className="mt-1 font-slab text-2xl leading-[30px] text-ink md:text-[32px] md:leading-[38px]">
            Evidence Vault
          </h1>
          <p className="mt-2 max-w-2xl text-[15px] text-ink">
            Add courses, projects, credentials, and competition results. New records remain pending until verified.
          </p>
        </div>
        <Button onClick={() => setModal(true)}>
          <Plus size={18} strokeWidth={1.5} /> Add Evidence
        </Button>
      </div>

      <div className="flex flex-wrap gap-1 border-b border-border">
        {(["all", "course", "project", "competition", "credential"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={cn(
              "-mb-px border-b-2 px-3 py-2 text-[13px] transition-colors duration-150 ease-out",
              type === t ? "border-brass text-ink" : "border-transparent text-ink-soft hover:text-ink",
            )}
          >
            {t === "all" ? "All records" : typeLabel[t]}
          </button>
        ))}
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((item) => (
          <EvidenceCard key={item.id} item={item} />
        ))}
      </ul>

      {modal && <AddEvidenceModal onClose={() => setModal(false)} onSaved={(item) => setEvidence((items) => [item, ...items])} />}
    </div>
  );
}
