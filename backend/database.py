from __future__ import annotations

import hashlib
import json
import os
import secrets
import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from .data import matches
from .models import Vacancy

DB_PATH = Path(os.getenv("SKILLFOLIO_DB_PATH", Path(__file__).with_name("skillfolio.db")))


def connect() -> sqlite3.Connection:
    connection = sqlite3.connect(DB_PATH, timeout=10)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    return connection


def now() -> str:
    return datetime.now(timezone.utc).isoformat()


def init_db() -> None:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    with connect() as connection:
        connection.executescript(
            """
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                email TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                name TEXT NOT NULL,
                created_at TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS profiles (
                user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
                passport_id TEXT NOT NULL UNIQUE,
                strength INTEGER NOT NULL DEFAULT 0
            );
            CREATE TABLE IF NOT EXISTS evidence (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                payload TEXT NOT NULL,
                created_at TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS vacancies (
                id TEXT PRIMARY KEY,
                payload TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS sessions (
                token_hash TEXT PRIMARY KEY,
                user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                expires_at INTEGER NOT NULL,
                revoked_at TEXT
            );
            """
        )
        for vacancy in matches:
            payload = Vacancy(
                **vacancy.model_dump(),
                url=None,
                source="Skillfolio seed",
                updated_at=now(),
            ).model_dump_json()
            connection.execute(
                "INSERT OR IGNORE INTO vacancies (id, payload, updated_at) VALUES (?, ?, ?)",
                (vacancy.id, payload, now()),
            )
        connection.commit()


def create_user(email: str, password_hash: str, name: str) -> dict[str, str]:
    user_id = secrets.token_urlsafe(16)
    passport_id = f"SKP-{secrets.randbelow(9000000) + 1000000}-IND"
    with connect() as connection:
        connection.execute(
            "INSERT INTO users (id, email, password_hash, name, created_at) VALUES (?, ?, ?, ?, ?)",
            (user_id, email.casefold(), password_hash, name.strip(), now()),
        )
        connection.execute("INSERT INTO profiles (user_id, passport_id) VALUES (?, ?)", (user_id, passport_id))
        connection.commit()
    return {"id": user_id, "email": email.casefold(), "name": name.strip()}


def find_user(email: str) -> sqlite3.Row | None:
    with connect() as connection:
        return connection.execute("SELECT * FROM users WHERE email = ?", (email.casefold(),)).fetchone()


def find_user_by_id(user_id: str) -> sqlite3.Row | None:
    with connect() as connection:
        return connection.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()


def get_profile(user_id: str) -> dict[str, Any]:
    with connect() as connection:
        row = connection.execute(
            "SELECT users.name, profiles.passport_id, profiles.strength FROM profiles JOIN users ON users.id = profiles.user_id WHERE user_id = ?",
            (user_id,),
        ).fetchone()
    if row is None:
        raise RuntimeError("Profile is not initialized")
    result = dict(row)
    user_skills = list_user_skills(user_id)
    result["verified_skills"] = sum(1 for skill in user_skills if skill["verified"])
    result["total_skills"] = len(user_skills)
    result["evidence_items"] = len(list_evidence(user_id))
    return result


def update_profile(user_id: str, name: str) -> dict[str, Any]:
    with connect() as connection:
        connection.execute("UPDATE users SET name = ? WHERE id = ?", (name.strip(), user_id))
        connection.commit()
    return get_profile(user_id)


def list_evidence(user_id: str) -> list[dict[str, Any]]:
    with connect() as connection:
        rows = connection.execute("SELECT payload FROM evidence WHERE user_id = ? ORDER BY created_at DESC", (user_id,)).fetchall()
    return [json.loads(row["payload"]) for row in rows]


def list_user_skills(user_id: str) -> list[dict[str, Any]]:
    grouped: dict[str, dict[str, Any]] = {}
    for item in list_evidence(user_id):
        verified = item["status"] == "Verified"
        for name in item.get("skills", []):
            key = name.casefold()
            skill = grouped.setdefault(
                key,
                {
                    "id": f"user-skill-{key.replace(' ', '-')}",
                    "name": name,
                    "category": "Technical",
                    "level": 3 if verified else 1,
                    "verified": verified,
                    "evidence_ids": [],
                },
            )
            skill["level"] = max(skill["level"], 3 if verified else 1)
            skill["verified"] = skill["verified"] or verified
            if item["id"] not in skill["evidence_ids"]:
                skill["evidence_ids"].append(item["id"])
    return list(grouped.values())


def get_user_skill_signals(user_id: str) -> list[tuple[str, int, bool]]:
    signals: dict[str, tuple[int, bool]] = {}
    for item in list_evidence(user_id):
        verified = item["status"] == "Verified"
        for skill_name in item.get("skills", []):
            current = signals.get(skill_name.casefold())
            level = 3 if verified else 1
            if current is None or level > current[0]:
                signals[skill_name.casefold()] = (level, verified)
    return [(name, level, verified) for name, (level, verified) in signals.items()]


def add_evidence(user_id: str, payload: dict[str, Any]) -> dict[str, Any]:
    item = {"id": f"ev-{secrets.token_urlsafe(9)}", "status": "Pending", **payload}
    with connect() as connection:
        connection.execute(
            "INSERT INTO evidence (id, user_id, payload, created_at) VALUES (?, ?, ?, ?)",
            (item["id"], user_id, json.dumps(item), now()),
        )
        connection.commit()
    return item


def list_vacancies() -> list[dict[str, Any]]:
    with connect() as connection:
        rows = connection.execute("SELECT payload FROM vacancies ORDER BY updated_at DESC").fetchall()
    return [json.loads(row["payload"]) for row in rows]


def save_session(token: str, user_id: str, expires_at: int) -> None:
    token_hash = hashlib.sha256(token.encode()).hexdigest()
    with connect() as connection:
        connection.execute("INSERT INTO sessions VALUES (?, ?, ?, NULL)", (token_hash, user_id, expires_at))
        connection.commit()


def get_session(token: str) -> sqlite3.Row | None:
    token_hash = hashlib.sha256(token.encode()).hexdigest()
    with connect() as connection:
        return connection.execute("SELECT * FROM sessions WHERE token_hash = ?", (token_hash,)).fetchone()


def revoke_session(token: str) -> None:
    token_hash = hashlib.sha256(token.encode()).hexdigest()
    with connect() as connection:
        connection.execute("UPDATE sessions SET revoked_at = ? WHERE token_hash = ?", (now(), token_hash))
        connection.commit()
