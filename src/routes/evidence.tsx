import { createFileRoute } from "@tanstack/react-router";
import {
  Award,
  BookOpen,
  FileBadge,
  FolderGit2,
  Github,
  Link2,
  Plus,
  Upload,
  X,
} from "lucide-react";
import { useState } from "react";
import { Button, Card, Eyebrow, StatusBadge } from "@/components/primitives";
import { evidence, skillsForEvidence, type Evidence, type EvidenceType } from "@/data/skillpass";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/evidence")({
  head: () => ({
    meta: [
      { title: "Evidence Vault — SkillPass" },
      { name: "description", content: "Every course, project, competition, and micro-credential behind the passport, with verification status and the skills it feeds." },
      { property: "og:title", content: "Evidence Vault — SkillPass" },
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

function AddEvidenceModal({ onClose }: { onClose: () => void }) {
  const options = [
    { icon: Upload, title: "Upload Certificate", note: "PDF or image; the issuer is matched against the recognised-issuer list." },
    { icon: Link2, title: "Connect Coursera", note: "Imports completed courses and certificate IDs through the issuer API." },
    { icon: Github, title: "Link GitHub Repo", note: "Reads commit signatures and language mix as project evidence." },
    { icon: Award, title: "Add Competition Result", note: "Records placement plus the organiser's published result sheet." },
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#14201B]/50 p-4 md:items-center" role="dialog" aria-modal="true" aria-label="Add evidence">
      <div className="w-full max-w-lg rounded-[4px] border border-border bg-surface shadow-float">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="font-slab text-[20px] leading-[26px] text-ink">Add Evidence</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="text-ink-soft hover:text-ink">
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>
        <ul className="flex flex-col gap-2 p-4">
          {options.map(({ icon: Icon, title, note }) => (
            <li key={title}>
              <button
                type="button"
                onClick={onClose}
                className="doc-card doc-card-hover flex w-full items-start gap-3 p-3 text-left"
              >
                <Icon size={20} strokeWidth={1.5} className="mt-0.5 text-bottle dark:text-brass" />
                <span>
                  <span className="block text-[15px] text-ink">{title}</span>
                  <span className="block text-[13px] leading-[18px] text-ink-soft">{note}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
        <div className="flex justify-end border-t border-border px-4 py-3">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

function EvidenceCard({ item }: { item: Evidence }) {
  const [open, setOpen] = useState(false);
  const Icon = typeIcon[item.type];
  const fed = skillsForEvidence(item.id);
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
            {fed.map((s) => (
              <li
                key={s.id}
                className="rounded-sm border border-border px-2 py-1 text-[13px] leading-[18px] text-ink"
              >
                {s.name} · level {s.level}/5
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
            Ten source records back the passport. Each one lists the skills it feeds, so every claim can be traced in both
            directions.
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

      {modal && <AddEvidenceModal onClose={() => setModal(false)} />}
    </div>
  );
}
