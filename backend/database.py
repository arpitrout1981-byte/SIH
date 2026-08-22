from __future__ import annotations

import json
import sqlite3
from pathlib import Path
from typing import Any

from .data import evidence, matches, profile, skills

DB_PATH = Path(__file__).with_name("skillfolio.db")


def connect() -> sqlite3.Connection:
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def init_db() -> None:
    with connect() as connection:
        connection.executescript(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                profile_name TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS profiles (
                id INTEGER PRIMARY KEY CHECK (id = 1),
                name TEXT NOT NULL,
                passport_id TEXT NOT NULL,
                strength INTEGER NOT NULL
            );
            CREATE TABLE IF NOT EXISTS evidence (
                id TEXT PRIMARY KEY,
                payload TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS skills (
                id TEXT PRIMARY KEY,
                payload TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS matches (
                id TEXT PRIMARY KEY,
                payload TEXT NOT NULL
            );
            """
        )
        connection.execute(
            "INSERT OR IGNORE INTO profiles VALUES (1, ?, ?, ?)",
            (profile.name, profile.passport_id, profile.strength),
        )
        for item in evidence:
            connection.execute(
                "INSERT OR IGNORE INTO evidence VALUES (?, ?)",
                (item.id, item.model_dump_json()),
            )
        for item in skills:
            connection.execute(
                "INSERT OR IGNORE INTO skills VALUES (?, ?)",
                (item.id, item.model_dump_json()),
            )
        for item in matches:
            connection.execute(
                "INSERT OR IGNORE INTO matches VALUES (?, ?)",
                (item.id, item.model_dump_json()),
            )
        connection.commit()


def get_profile() -> dict[str, Any]:
    with connect() as connection:
        row = connection.execute("SELECT name, passport_id, strength FROM profiles WHERE id = 1").fetchone()
    if row is None:
        raise RuntimeError("Profile is not initialized")
    return dict(row)


def get_collection(table: str) -> list[dict[str, Any]]:
    if table not in {"evidence", "skills", "matches"}:
        raise ValueError("Unsupported collection")
    with connect() as connection:
        rows = connection.execute(f"SELECT payload FROM {table}").fetchall()
    return [json.loads(row["payload"]) for row in rows]


def find_user(email: str) -> sqlite3.Row | None:
    with connect() as connection:
        return connection.execute(
            "SELECT id, email, password_hash, profile_name FROM users WHERE email = ?",
            (email.casefold(),),
        ).fetchone()


def create_user(email: str, password_hash: str, profile_name: str = "Admin") -> None:
    with connect() as connection:
        connection.execute(
            "INSERT OR IGNORE INTO users (email, password_hash, profile_name) VALUES (?, ?, ?)",
            (email.casefold(), password_hash, profile_name),
        )
        connection.commit()
