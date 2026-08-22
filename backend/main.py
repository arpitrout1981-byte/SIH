from typing import Annotated

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from .data import evidence, matches, profile, skills
from .models import Evidence, Match, MatchExplanation, MatchKind, Profile, Skill, SkillCategory, Status
from .services import explain_match

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


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "skillfolio-api"}


@app.get("/api/profile", response_model=Profile)
def get_profile() -> Profile:
    return profile


@app.get("/api/evidence", response_model=list[Evidence])
def list_evidence(
    status: Annotated[Status | None, Query()] = None,
) -> list[Evidence]:
    return [item for item in evidence if status is None or item.status == status]


@app.get("/api/skills", response_model=list[Skill])
def list_skills(
    verified_only: bool = False,
    category: Annotated[SkillCategory | None, Query()] = None,
) -> list[Skill]:
    return [
        skill
        for skill in skills
        if (not verified_only or skill.verified) and (category is None or skill.category == category)
    ]


@app.get("/api/matches", response_model=list[Match])
def list_matches(
    kind: Annotated[MatchKind | None, Query()] = None,
    domain: str | None = None,
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
