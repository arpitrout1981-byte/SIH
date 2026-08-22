import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown, TriangleAlert } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button, Card, Eyebrow, FairnessNote, KindBadge, Ring } from "@/components/primitives";
import { useChartColors } from "@/components/theme";
import { FAIRNESS_NOTE } from "@/data/skillpass";
import { apiFetch, type Recommendation } from "@/lib/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/matches")({
  head: () => ({
    meta: [
      { title: "Matches — Skillfolio" },
      { name: "description", content: "Internship and team matches with the evidence behind each score, the skills still missing, and a fairness note on every card." },
      { property: "og:title", content: "Matches — Skillfolio" },
      { property: "og:description", content: "Explainable matching: evidence per requirement, named skill gaps, and bias-excluded scoring." },
    ],
  }),
  component: MatchesPage,
});

function CompareChart({ data }: { data: { skill: string; you: number; required: number }[] }) {
  const c = useChartColors();
  return (
    <div className="h-[220px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid stroke={c.grid} strokeOpacity={0.6} vertical={false} />
          <XAxis dataKey="skill" tick={{ fill: c.text, fontSize: 12 }} stroke={c.grid} />
          <YAxis domain={[0, 5]} tick={{ fill: c.text, fontSize: 12 }} stroke={c.grid} />
          <Tooltip
            contentStyle={{
              background: c.surface,
              border: `1px solid ${c.border}`,
              borderRadius: 4,
              color: c.text,
              fontSize: 13,
            }}
            labelStyle={{ color: c.text }}
          />
          <Legend wrapperStyle={{ fontSize: 12, color: c.text }} />
          <Bar dataKey="you" name="Your level" fill={c.primary} radius={[2, 2, 0, 0]} />
          <Bar dataKey="required" name="Required level" fill={c.secondary} radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MatchCard({ recommendation }: { recommendation: Recommendation }) {
  const match = recommendation.match;
  const [open, setOpen] = useState(false);
  return (
    <Card as="li" hover className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <KindBadge kind={match.kind} />
            <Eyebrow>{match.domain}</Eyebrow>
          </div>
          <h3 className="mt-2 font-slab text-[20px] leading-[26px] text-ink">{match.title}</h3>
          <p className="text-[13px] leading-[18px] text-ink-soft">{match.org}</p>
          <p className="mt-2 text-[15px] text-ink">{match.summary}</p>
        </div>
        <Ring value={match.score} label="Match score" />
      </div>

      <div>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex items-center gap-2 rounded-sm border border-border px-3 py-2 text-[13px] font-medium text-ink transition-colors duration-150 ease-out hover:border-brass"
        >
          Why this match?
          <ChevronDown
            size={18}
            strokeWidth={1.5}
            className={cn("transition-transform duration-150 ease-out", open && "rotate-180")}
          />
        </button>
        {open && (
          <div className="mt-3 rounded-md border border-border bg-surface p-4 shadow-float">
            <Eyebrow>Evidence behind this score</Eyebrow>
            <ul className="mt-2 flex flex-col gap-2">
              {recommendation.matched_skills.map((skill) => (
                <li key={skill} className="text-[15px] text-ink">
                  <span className="font-semibold">{skill}</span> is supported by your evidence.
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <Eyebrow>Your skills vs required</Eyebrow>
              <p className="text-[13px] text-ink-soft">Add more verified evidence to improve your recommendation score.</p>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-border pt-3">
        <Eyebrow>Skill gaps</Eyebrow>
        <ul className="mt-2 flex flex-col gap-2">
          {recommendation.gaps.map((g) => (
            <li key={g.skill} className="flex flex-wrap items-start gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-sm border border-gap px-2 py-1 text-[13px] font-semibold leading-[18px] text-gap">
                <TriangleAlert size={18} strokeWidth={1.5} />
                {g.skill} missing
              </span>
              <span className="flex-1 text-[13px] leading-[18px] text-ink">{g.suggestion}</span>
            </li>
          ))}
        </ul>
      </div>

      <FairnessNote text={recommendation.fairness_note || FAIRNESS_NOTE} />
    </Card>
  );
}

function MatchesPage() {
  const [kind, setKind] = useState<"All" | "Internship" | "Team">("All");
  const [domain, setDomain] = useState("All domains");
  const [minScore, setMinScore] = useState(60);
  const [sort, setSort] = useState<"score" | "title">("score");
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => {
    void apiFetch<Recommendation[]>("/api/recommendations").then(setRecommendations);
  }, []);

  const domains = useMemo(() => ["All domains", ...new Set(recommendations.map((item) => item.match.domain))], [recommendations]);

  const list = useMemo(
    () =>
      recommendations
        .filter((item) => (kind === "All" || item.match.kind === kind) && (domain === "All domains" || item.match.domain === domain) && item.score >= minScore)
        .sort((a, b) => (sort === "score" ? b.score - a.score : a.match.title.localeCompare(b.match.title))),
    [kind, domain, minScore, recommendations, sort],
  );

  const selectClass =
    "rounded-sm border border-border bg-surface px-3 py-2 text-[13px] text-ink transition-colors duration-150 ease-out hover:border-brass";

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div>
        <Eyebrow>Opportunities</Eyebrow>
        <h1 className="mt-1 font-slab text-2xl leading-[30px] text-ink md:text-[32px] md:leading-[38px]">Matches</h1>
        <p className="mt-2 max-w-2xl text-[15px] text-ink">
          Internships and multidisciplinary team openings, scored against verified passport evidence. Each card names the
          evidence used, the requirements still missing, and the attributes excluded from scoring.
        </p>
      </div>

      <Card className="flex flex-wrap items-end gap-4">
        <label className="flex flex-col gap-1">
          <Eyebrow>Type</Eyebrow>
          <select value={kind} onChange={(e) => setKind(e.target.value as typeof kind)} className={selectClass}>
            {["All", "Internship", "Team"].map((k) => (
              <option key={k}>{k}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <Eyebrow>Domain</Eyebrow>
          <select value={domain} onChange={(e) => setDomain(e.target.value)} className={selectClass}>
            {domains.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <Eyebrow>Sort</Eyebrow>
          <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className={selectClass}>
            <option value="score">Match score, high to low</option>
            <option value="title">Title, A to Z</option>
          </select>
        </label>
        <label className="flex min-w-[200px] flex-1 flex-col gap-1">
          <Eyebrow>Minimum score — {minScore}%</Eyebrow>
          <input
            type="range"
            min={50}
            max={95}
            step={1}
            value={minScore}
            onChange={(e) => setMinScore(Number(e.target.value))}
            className="accent-[var(--color-action-primary)]"
          />
        </label>
      </Card>

      {list.length === 0 ? (
        <Card className="flex flex-col items-start gap-3">
          <p className="text-[15px] text-ink">
            No matches meet these filters. Widen the score range or clear a filter to see more.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setKind("All");
              setDomain("All domains");
              setMinScore(60);
            }}
          >
            Clear filters
          </Button>
        </Card>
      ) : (
        <ul className="flex flex-col gap-4">
          {list.map((item) => (
            <MatchCard key={item.match.id} recommendation={item} />
          ))}
        </ul>
      )}
    </div>
  );
}
