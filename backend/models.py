from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


EvidenceType = Literal["course", "project", "competition", "credential"]
Status = Literal["Verified", "Pending", "Needs Review"]
SkillCategory = Literal["Technical", "Soft Skills", "Domain Knowledge"]
MatchKind = Literal["Internship", "Team"]


class Profile(BaseModel):
    name: str
    passport_id: str
    strength: int = Field(ge=0, le=100)


class LoginRequest(BaseModel):
    email: str
    password: str = Field(min_length=1)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    profile_name: str


class Evidence(BaseModel):
    id: str
    title: str
    type: EvidenceType
    source: str
    date: str
    status: Status
    skills: list[str]
    detail: str


class Skill(BaseModel):
    id: str
    name: str
    category: SkillCategory
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
    kind: MatchKind
    domain: str
    score: int = Field(ge=0, le=100)
    summary: str
    requirements: list[SkillRequirement]


class Gap(BaseModel):
    skill: str
    suggestion: str


class MatchExplanation(BaseModel):
    match: Match
    score: int = Field(ge=0, le=100)
    matched_skills: list[str]
    gaps: list[Gap]
    fairness_note: str
