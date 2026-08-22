from __future__ import annotations

from typing import Literal

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


app = FastAPI(
    title="Skillfolio API",
    description="Evidence-backed skill passport and explainable matching API.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://127.0.0.1:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Profile(BaseModel):
    name: str
    passport_id: str
    strength: int = Field(ge=0, le=100)


class Evidence(BaseModel):
    id: str
    title: str
    type: Literal["course", "project", "competition", "credential"]
    source: str
    date: str
    status: Literal["Verified", "Pending", "Needs Review"]
    skills: list[str]
    detail: str


class Skill(BaseModel):
    id: str
    name: str
    category: Literal["Technical", "Soft Skills", "Domain Knowledge"]
    level: int = Field(ge=1, le=5)
    verified: bool
    evidence_ids: list[str]


class SkillRequirement(BaseModel):
    name: str
    required_level: int = Field(ge=1, le=5)


class Match(BaseModel):
    id: str
    title: str
    org: str
    kind: Literal["Internship", "Team"]
    domain: str
    score: int = Field(ge=0, le=100)
    summary: str
    requirements: list[SkillRequirement]


class MatchExplanation(BaseModel):
    match: Match
    score: int
    matched_skills: list[str]
    gaps: list[dict[str, str]]
    fairness_note: str


profile = Profile(name="Admin", passport_id="SKP-2604821-IND", strength=82)

skills = [
    Skill(id="s1", name="Python", category="Technical", level=5, verified=True, evidence_ids=["ev-1", "ev-2"]),
    Skill(id="s2", name="SQL", category="Technical", level=4, verified=True, evidence_ids=["ev-1"]),
    Skill(id="s3", name="React.js", category="Technical", level=4, verified=True, evidence_ids=["ev-2"]),
    Skill(id="s4", name="Data Visualization", category="Domain Knowledge", level=4, verified=True, evidence_ids=["ev-3"]),
    Skill(id="s5", name="Team Leadership", category="Soft Skills", level=4, verified=True, evidence_ids=["ev-4"]),
    Skill(id="s6", name="Cloud Fundamentals (AWS)", category="Technical", level=2, verified=False, evidence_ids=["ev-5"]),
]

_evidence = [
    Evidence(
        id="ev-1",
        title="Data Structures & Algorithms - Semester Coursework",
        type="course",
        source="ITER, Siksha 'O' Anusandhan",
        date="2026-05-14",
        status="Verified",
        skills=["Python", "SQL"],
        detail="Registrar-issued transcript with graded laboratory work.",
    ),
    Evidence(
        id="ev-2",
        title="Smart Attendance System - Capstone Project",
        type="project",
        source="ITER Capstone Review Board",
        date="2026-04-28",
        status="Verified",
        skills=["Python", "React.js"],
        detail="Reviewed capstone project with signed commit history.",
    ),
    Evidence(
        id="ev-3",
        title="Google Data Analytics Certificate",
        type="credential",
        source="Coursera / Google",
        date="2026-02-20",
        status="Verified",
        skills=["SQL", "Data Visualization"],
        detail="Professional certificate verified through the issuer API.",
    ),
    Evidence(
        id="ev-4",
        title="Smart India Hackathon - Finalist",
        type="competition",
        source="Ministry of Education, Govt. of India",
        date="2026-03-09",
        status="Verified",
        skills=["React.js", "Team Leadership"],
        detail="National finalist result with team contribution recorded.",
    ),
    Evidence(
        id="ev-5",
        title="AWS Cloud Practitioner Essentials",
        type="credential",
        source="AWS Skill Builder",
        date="2026-06-02",
        status="Pending",
        skills=["Cloud Fundamentals (AWS)"],
        detail="Course completion recorded; issuer verification is pending.",
    ),
]

matches = [
    Match(
        id="m1",
        title="Data Analyst Intern",
        org="Nimbus Fintech",
        kind="Internship",
        domain="Data & Analytics",
        score=91,
        summary="Build lending dashboards and cohort reports for the risk team.",
        requirements=[
            SkillRequirement(name="SQL", required_level=4),
            SkillRequirement(name="Data Visualization", required_level=3),
            SkillRequirement(name="Python", required_level=4),
            SkillRequirement(name="Statistical Modeling", required_level=3),
        ],
    ),
    Match(
        id="m2",
        title="Campus AI-for-Good Team",
        org="Needs a frontend + data teammate",
        kind="Team",
        domain="Applied ML",
        score=87,
        summary="Prepare an accessibility assistant for a state innovation grant.",
        requirements=[
            SkillRequirement(name="React.js", required_level=4),
            SkillRequirement(name="Python", required_level=3),
            SkillRequirement(name="Team Leadership", required_level=3),
            SkillRequirement(name="Public Speaking", required_level=5),
        ],
    ),
    Match(
        id="m3",
        title="Cloud Platform Intern",
        org="Arclight Infrastructure",
        kind="Internship",
        domain="Cloud & Platform",
        score=68,
        summary="Work on deployment tooling and cost-reporting automation.",
        requirements=[
            SkillRequirement(name="Python", required_level=3),
            SkillRequirement(name="Cloud Fundamentals (AWS)", required_level=4),
            SkillRequirement(name="Containers & CI/CD", required_level=4),
        ],
    ),
]

fairness_note = (
    "This score uses only skill-evidence signals. Name, photo, gender, age, "
    "and college tier are excluded from the calculation."
)


def get_skill_map() -> dict[str, Skill]:
    return {skill.name.casefold(): skill for skill in skills}


def explain_match(match: Match) -> MatchExplanation:
    skill_map = get_skill_map()
    matched_skills: list[str] = []
    gaps: list[dict[str, str]] = []

    for requirement in match.requirements:
        skill = skill_map.get(requirement.name.casefold())
        if skill and skill.verified and skill.level >= requirement.required_level:
            matched_skills.append(requirement.name)
            continue

        if skill and not skill.verified:
            suggestion = "Attach verified issuer evidence for this skill."
        elif skill:
            suggestion = f"Raise demonstrated proficiency from level {skill.level} to {requirement.required_level}."
        else:
            suggestion = "Add a project, course, or credential demonstrating this skill."
        gaps.append({"skill": requirement.name, "suggestion": suggestion})

    total = len(match.requirements)
    score = round(len(matched_skills) / total * 100) if total else 0
    return MatchExplanation(
        match=match,
        score=score,
        matched_skills=matched_skills,
        gaps=gaps,
        fairness_note=fairness_note,
    )


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "skillfolio-api"}


@app.get("/api/profile", response_model=Profile)
def get_profile() -> Profile:
    return profile


@app.get("/api/evidence", response_model=list[Evidence])
def list_evidence(
    status: Literal["Verified", "Pending", "Needs Review"] | None = Query(default=None),
) -> list[Evidence]:
    if status is None:
        return _evidence
    return [item for item in _evidence if item.status == status]


@app.get("/api/skills", response_model=list[Skill])
def list_skills(
    verified_only: bool = Query(default=False),
    category: Literal["Technical", "Soft Skills", "Domain Knowledge"] | None = Query(default=None),
) -> list[Skill]:
    return [
        skill
        for skill in skills
        if (not verified_only or skill.verified) and (category is None or skill.category == category)
    ]


@app.get("/api/matches", response_model=list[Match])
def list_matches(
    kind: Literal["Internship", "Team"] | None = Query(default=None),
    domain: str | None = Query(default=None),
    min_score: int = Query(default=0, ge=0, le=100),
) -> list[Match]:
    return [
        match
        for match in matches
        if (kind is None or match.kind == kind)
        and (domain is None or match.domain == domain)
        and match.score >= min_score
    ]


@app.get("/api/matches/{match_id}/explain", response_model=MatchExplanation)
def explain_match_by_id(match_id: str) -> MatchExplanation:
    match = next((item for item in matches if item.id == match_id), None)
    if match is None:
        raise HTTPException(status_code=404, detail="Match not found")
    return explain_match(match)
