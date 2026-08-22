from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from .auth import get_current_user, hash_password, issue_token, verify_password
from .database import create_user, find_user, get_collection, get_profile as read_profile, init_db
from .models import Evidence, LoginRequest, Match, MatchExplanation, MatchKind, Profile, Skill, SkillCategory, Status, TokenResponse
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

init_db()
if find_user("admin@example.com") is None:
    create_user("admin@example.com", hash_password("admin123"))


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "skillfolio-api"}


@app.post("/api/auth/login", response_model=TokenResponse)
def login(request: LoginRequest) -> TokenResponse:
    user = find_user(request.email)
    if user is None or not verify_password(request.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return TokenResponse(access_token=issue_token(user["email"]), profile_name=user["profile_name"])


@app.get("/api/profile", response_model=Profile)
def get_profile_route(_: dict[str, str] = Depends(get_current_user)) -> Profile:
    return Profile.model_validate(read_profile())


@app.get("/api/evidence", response_model=list[Evidence])
def list_evidence(
    status: Annotated[Status | None, Query()] = None,
    _: dict[str, str] = Depends(get_current_user),
) -> list[Evidence]:
    return [Evidence.model_validate(item) for item in get_collection("evidence") if status is None or item["status"] == status]


@app.get("/api/skills", response_model=list[Skill])
def list_skills(
    verified_only: bool = False,
    category: Annotated[SkillCategory | None, Query()] = None,
    _: dict[str, str] = Depends(get_current_user),
) -> list[Skill]:
    return [
        Skill.model_validate(skill)
        for skill in get_collection("skills")
        if (not verified_only or skill["verified"]) and (category is None or skill["category"] == category)
    ]


@app.get("/api/matches", response_model=list[Match])
def list_matches(
    kind: Annotated[MatchKind | None, Query()] = None,
    domain: str | None = None,
    min_score: int = Query(default=0, ge=0, le=100),
    _: dict[str, str] = Depends(get_current_user),
) -> list[Match]:
    return [
        Match.model_validate(match)
        for match in get_collection("matches")
        if (kind is None or match["kind"] == kind)
        and (domain is None or match["domain"] == domain)
        and match["score"] >= min_score
    ]


@app.get("/api/matches/{match_id}/explain", response_model=MatchExplanation)
def explain_match_by_id(match_id: str, _: dict[str, str] = Depends(get_current_user)) -> MatchExplanation:
    match = next((Match.model_validate(item) for item in get_collection("matches") if item["id"] == match_id), None)
    if match is None:
        raise HTTPException(status_code=404, detail="Match not found")
    return explain_match(match)
