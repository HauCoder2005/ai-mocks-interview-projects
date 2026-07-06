"""Xác thực internal token cho request từ NestJS backend."""

from fastapi import Header, HTTPException

from config import INTERNAL_SERVICE_TOKEN


def validate_internal_token(authorization: str | None = Header(default=None)) -> None:
    """Kiểm tra header Authorization: Bearer <token>."""
    if not INTERNAL_SERVICE_TOKEN:
        return

    bearer_token = None
    if authorization and authorization.startswith("Bearer "):
        bearer_token = authorization.removeprefix("Bearer ").strip()

    if bearer_token != INTERNAL_SERVICE_TOKEN:
        raise HTTPException(
            status_code=401,
            detail="Invalid internal service token",
        )
