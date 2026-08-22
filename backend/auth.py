from __future__ import annotations

import base64
import hashlib
import hmac
import json
import os
import secrets
import time

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from .database import find_user

SECRET = os.getenv("SKILLFOLIO_AUTH_SECRET", "dev-only-change-this-secret")
TOKEN_TTL_SECONDS = 60 * 60 * 8
bearer = HTTPBearer(auto_error=False)


def hash_password(password: str, salt: bytes | None = None) -> str:
    actual_salt = salt or secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), actual_salt, 210_000)
    return f"{actual_salt.hex()}${digest.hex()}"


def verify_password(password: str, stored_hash: str) -> bool:
    salt_hex, digest_hex = stored_hash.split("$", maxsplit=1)
    expected = bytes.fromhex(digest_hex)
    actual = hashlib.pbkdf2_hmac("sha256", password.encode(), bytes.fromhex(salt_hex), 210_000)
    return hmac.compare_digest(actual, expected)


def issue_token(email: str) -> str:
    payload = {"sub": email.casefold(), "exp": int(time.time()) + TOKEN_TTL_SECONDS}
    encoded = base64.urlsafe_b64encode(json.dumps(payload, separators=(",", ":")).encode()).decode().rstrip("=")
    signature = hmac.new(SECRET.encode(), encoded.encode(), hashlib.sha256).hexdigest()
    return f"{encoded}.{signature}"


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer),
) -> dict[str, str]:
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")
    try:
        encoded, signature = credentials.credentials.split(".", maxsplit=1)
        expected_signature = hmac.new(SECRET.encode(), encoded.encode(), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(signature, expected_signature):
            raise ValueError
        padded = encoded + "=" * (-len(encoded) % 4)
        payload = json.loads(base64.urlsafe_b64decode(padded))
        if int(payload["exp"]) < int(time.time()):
            raise ValueError
        user = find_user(str(payload["sub"]))
        if user is None:
            raise ValueError
        return {"email": user["email"], "profile_name": user["profile_name"]}
    except (ValueError, KeyError, TypeError, json.JSONDecodeError):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token") from None
