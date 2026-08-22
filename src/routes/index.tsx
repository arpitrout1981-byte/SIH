import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { BadgeCheck, Clock, Layers, Target } from "lucide-react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, Eyebrow, KindBadge, Ring, StatTile, StatusBadge } from "@/components/primitives";
import { useChartColors } from "@/components/theme";
import { profile, radarData, skillGrowth } from "@/data/skillpass";
import { apiFetch, hasSession, type EvidenceRecord, type Recommendation } from "@/lib/api";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && !hasSession()) {
      throw redirect({ to: "/login" });
    }
  },
  head: () => ({
    meta: [
      { title: "Skillfolio — Verified Skill Passport & Explainable Matching" },
      {
        name: "description",
        content:
          "Skillfolio turns verified coursework, projects, competitions, and micro-credentials into one portable skill passport, then matches it to internships and teams with evidence, gaps, and fairness stated on screen.",
      },
      { property: "og:title", content: "Skillfolio — Verified Skill Passport" },
      {
        property: "og:description",
        content: "One portable, evidence-backed skill passport with explainable, bias-free matching.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const [profileData, setProfileData] = useState(profile);
  const [evidenceData, setEvidenceData] = useState<EvidenceRecord[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const c = useChartColors();
  const recent = evidenceData.slice(0, 4);
  const top = recommendations.slice(0, 3);

  useEffect(() => {
    if (!hasSession()) {
      void navigate({ to: "/login", replace: true });
      return;
    }
    void Promise.all([
      apiFetch<{ name: string; passport_id: string; strength: number }>("/api/profile"),
      apiFetch<EvidenceRecord[]>("/api/evidence"),
      apiFetch<Recommendation[]>("/api/recommendations"),
    ])
      .then(([result, userEvidence, userRecommendations]) => {
        setProfileData({
          name: result.name,
          passportId: result.passport_id,
          strength: result.strength,
          mrz: profile.mrz,
        });
        setEvidenceData(userEvidence);
        setRecommendations(userRecommendations);
        setAuthenticated(true);
      })
      .catch(() => navigate({ to: "/login", replace: true }));
  }, [navigate]);

  if (!authenticated) {
    return null;
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Eyebrow>Passport holder</Eyebrow>
          <h1 className="mt-1 font-slab text-2xl leading-[30px] text-ink md:text-[32px] md:leading-[38px]">
            Welcome back, {profileData.name}
          </h1>
          <p className="mt-2 font-mono text-[13px] tabular-nums text-ink-soft">
            {profile.passportId} · last verification 2026-06-02
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Ring value={profileData.strength} size={72} label="Profile strength" />
          <div>
            <Eyebrow>Profile strength</Eyebrow>
            <p className="text-[15px] text-ink">Two pending verifications from full strength</p>
          </div>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile icon={BadgeCheck} label="Verified credentials" value={String(evidenceData.filter((item) => item.status === "Verified").length)} note="Issuer-confirmed records" />
        <StatTile icon={Target} label="Available matches" value={String(recommendations.length)} note="Based on current evidence" />
        <StatTile icon={Layers} label="Skills tracked" value={String(new Set(evidenceData.flatMap((item) => item.skills)).size)} note="Skills found in your vault" />
        <StatTile icon={Clock} label="Pending verifications" value={String(evidenceData.filter((item) => item.status !== "Verified").length)} note="Awaiting review" />
      </section>

      <section className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <Eyebrow>Skill growth</Eyebrow>
          <h2 className="mt-1 font-slab text-[20px] leading-[26px] text-ink">Verified proficiency, last 6 months</h2>
          <div className="mt-4 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={evidenceData.length ? skillGrowth : []} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid stroke={c.grid} strokeOpacity={0.6} vertical={false} />
                <XAxis dataKey="month" tick={{ fill: c.text, fontSize: 12 }} stroke={c.grid} />
                <YAxis tick={{ fill: c.text, fontSize: 12 }} stroke={c.grid} />
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
                <Line
                  type="monotone"
                  dataKey="proficiency"
                  name="Weighted proficiency"
                  stroke={c.primary}
                  strokeWidth={2}
                  dot={{ r: 3, fill: c.primary }}
                />
                <Line
                  type="monotone"
                  dataKey="verified"
                  name="Verified evidence items"
                  stroke={c.secondary}
                  strokeWidth={2}
                  dot={{ r: 3, fill: c.secondary }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <Eyebrow>Category coverage</Eyebrow>
          <h2 className="mt-1 font-slab text-[20px] leading-[26px] text-ink">Top skill categories</h2>
          <div className="mt-4 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={evidenceData.length ? radarData : []} outerRadius="72%">
                <PolarGrid stroke={c.grid} />
                <PolarAngleAxis dataKey="category" tick={{ fill: c.text, fontSize: 12 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={{ fill: c.text, fontSize: 11 }} stroke={c.grid} />
                <Legend wrapperStyle={{ fontSize: 12, color: c.text }} />
                <Radar name="You" dataKey="you" stroke={c.primary} fill={c.primary} fillOpacity={0.35} />
                <Radar name="Cohort benchmark" dataKey="benchmark" stroke={c.secondary} fill={c.secondary} fillOpacity={0.18} />
                <Tooltip
                  contentStyle={{
                    background: c.surface,
                    border: `1px solid ${c.border}`,
                    borderRadius: 4,
                    color: c.text,
                    fontSize: 13,
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-5">
        <div className="flex flex-col gap-3 lg:col-span-3">
          <h2 className="font-slab text-[20px] leading-[26px] text-ink">Top matches this week</h2>
          <ul className="flex flex-col gap-3">
            {top.map((item) => (
              <li key={item.match.id}>
                <Link to="/matches" className="doc-card doc-card-hover flex items-center justify-between gap-4 p-4">
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-2">
                      <KindBadge kind={item.match.kind} />
                      <Eyebrow>{item.match.domain}</Eyebrow>
                    </span>
                    <span className="mt-1.5 block font-slab text-[15px] leading-[22px] text-ink">{item.match.title}</span>
                    <span className="block text-[13px] leading-[18px] text-ink-soft">{item.match.org}</span>
                    <span className="mt-1 block text-[13px] leading-[18px] text-gap">
                      Gap: {item.gaps.map((g) => g.skill).join(", ") || "None"}
                    </span>
                  </span>
                  <Ring value={item.score} size={56} label="Match score" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3 lg:col-span-2">
          <h2 className="font-slab text-[20px] leading-[26px] text-ink">Recently verified</h2>
          <ul className="flex flex-col gap-3">
            {recent.map((e) => (
              <Card as="li" key={e.id} hover className="flex flex-col gap-2">
                <p className="font-slab text-[15px] leading-[22px] text-ink">{e.title}</p>
                <p className="text-[13px] leading-[18px] text-ink-soft">
                  {e.source} · <span className="font-mono tabular-nums">{e.date}</span>
                </p>
                <StatusBadge status={e.status} />
              </Card>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
