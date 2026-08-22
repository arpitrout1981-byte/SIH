from __future__ import annotations

from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware

from .auth import get_current_user, hash_password, issue_token, verify_password
from .database import add_evidence, create_user, find_user, get_profile, get_user_skill_signals, init_db, list_evidence, list_vacancies, revoke_session, update_profile
from .models import Evidence, EvidenceCreate, LoginRequest, Match, MatchExplanation, MessageResponse, Profile, ProfileUpdate, SignupRequest, TokenResponse, Vacancy
from .services import explain_match

app = FastAPI(title="Skillfolio API", description="Evidence-backed skill passport and explainable matching API.", version="2.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://127.0.0.1:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
init_db()


def current_user(user: dict[str, str] = Depends(get_current_user)) -> dict[str, str]:
    return user


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "skillfolio-api"}


@app.post("/api/auth/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def signup(request: SignupRequest) -> TokenResponse:
    if find_user(request.email) is not None:
        raise HTTPException(status_code=409, detail="An account with this email already exists")
    user = create_user(request.email, hash_password(request.password), request.name)
    return TokenResponse(access_token=issue_token(user["id"]), profile_name=user["name"])


@app.post("/api/auth/login", response_model=TokenResponse)
def login(request: LoginRequest) -> TokenResponse:
    user = find_user(request.email)
    if user is None or not verify_password(request.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return TokenResponse(access_token=issue_token(user["id"]), profile_name=user["name"])


@app.post("/api/auth/logout", response_model=MessageResponse)
def logout(user: dict[str, str] = Depends(current_user)) -> MessageResponse:
    revoke_session(user["token"])
    return MessageResponse(message="Signed out")


@app.get("/api/profile", response_model=Profile)
def profile(user: dict[str, str] = Depends(current_user)) -> Profile:
    return Profile.model_validate(get_profile(user["id"]))


@app.patch("/api/profile", response_model=Profile)
def edit_profile(request: ProfileUpdate, user: dict[str, str] = Depends(current_user)) -> Profile:
    return Profile.model_validate(update_profile(user["id"], request.name))


@app.get("/api/evidence", response_model=list[Evidence])
def evidence(user: dict[str, str] = Depends(current_user)) -> list[Evidence]:
    return [Evidence.model_validate(item) for item in list_evidence(user["id"])]


@app.post("/api/evidence", response_model=Evidence, status_code=status.HTTP_201_CREATED)
def create_evidence(request: EvidenceCreate, user: dict[str, str] = Depends(current_user)) -> Evidence:
    return Evidence.model_validate(add_evidence(user["id"], request.model_dump()))


@app.get("/api/vacancies", response_model=list[Vacancy])
def vacancies(_: dict[str, str] = Depends(current_user)) -> list[Vacancy]:
    return [Vacancy.model_validate(item) for item in list_vacancies()]


@app.get("/api/recommendations", response_model=list[MatchExplanation])
def recommendations(user: dict[str, str] = Depends(current_user)) -> list[MatchExplanation]:
    signals = get_user_skill_signals(user["id"])
    return [
        explain_match(Match.model_validate(item), signals)
        for item in list_vacancies()
    ]


@app.get("/api/matches/{match_id}/explain", response_model=MatchExplanation)
def explain_match_by_id(match_id: str, _: dict[str, str] = Depends(current_user)) -> MatchExplanation:
    vacancy = next((item for item in list_vacancies() if item["id"] == match_id), None)
    if vacancy is None:
        raise HTTPException(status_code=404, detail="Vacancy not found")
    return explain_match(Match.model_validate(vacancy), get_user_skill_signals(_["id"]))
