import os
import logging
import time
from contextlib import asynccontextmanager
from pathlib import Path
from threading import BoundedSemaphore
from uuid import uuid4
from fastapi import FastAPI, File, Header, HTTPException, UploadFile
from minio.error import S3Error
from pydantic import BaseModel

from config import (
    ALLOWED_AUDIO_TYPES,
    INTERNAL_SERVICE_TOKEN,
    MAX_AUDIO_SIZE_BYTES,
    MINIO_ACCESS_KEY,
    MINIO_BUCKET,
    MINIO_ENDPOINT,
    MINIO_SECRET_KEY,
    MINIO_SECURE,
    SERVICE_NAME,
    TEMP_DIR,
    TRANSCRIPTION_MAX_CONCURRENCY,
    TRANSCRIPTION_LANGUAGE,
    TRANSCRIPTION_MODEL_NAME,
)
from minio import Minio
from transcription_service import (
    is_model_loaded,
    preload_transcription_model,
    transcribe_audio,
)

logger = logging.getLogger(SERVICE_NAME)
logging.basicConfig(level=logging.INFO)


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        preload_transcription_model()
    except Exception:
        logger.exception(
            "Failed to preload transcription model: model=%s",
            TRANSCRIPTION_MODEL_NAME,
        )
        raise

    yield


app = FastAPI(title=SERVICE_NAME, lifespan=lifespan)
minio_client = Minio(
    MINIO_ENDPOINT,
    access_key=MINIO_ACCESS_KEY,
    secret_key=MINIO_SECRET_KEY,
    secure=MINIO_SECURE,
)
transcription_semaphore = BoundedSemaphore(value=TRANSCRIPTION_MAX_CONCURRENCY)


class TranscribeFromObjectRequest(BaseModel):
    bucket: str | None = None
    objectKey: str
    userId: str | int
    sessionId: str | int
    turnId: str


@app.get("/health")
def health():
    """Tra ve trang thai service va transcription model dang cau hinh."""
    return {
        "status": "OK",
        "service": SERVICE_NAME,
        "transcription": {
            "model": TRANSCRIPTION_MODEL_NAME,
            "language": TRANSCRIPTION_LANGUAGE,
            "modelLoaded": is_model_loaded(),
        },
    }


@app.post("/transcribe")
async def transcribe(
    audio: UploadFile = File(...),
    authorization: str | None = Header(default=None),
    x_internal_service_token: str | None = Header(default=None),
):
    """Nhan audio file truc tiep va tra ve transcript text."""
    validate_internal_token(authorization, x_internal_service_token)

    mime_type = audio.content_type or "application/octet-stream"

    if mime_type not in ALLOWED_AUDIO_TYPES:
        raise HTTPException(
            status_code=415,
            detail=f"Unsupported audio type: {mime_type}",
        )

    os.makedirs(TEMP_DIR, exist_ok=True)

    original_name = audio.filename or "audio"
    extension = Path(original_name).suffix
    temp_file_path = os.path.join(TEMP_DIR, f"{uuid4().hex}{extension}")
    size = 0

    try:
        with open(temp_file_path, "wb") as temp_file:
            while True:
                chunk = await audio.read(1024 * 1024)

                if not chunk:
                    break

                size += len(chunk)

                if size > MAX_AUDIO_SIZE_BYTES:
                    raise HTTPException(
                        status_code=413,
                        detail="Audio file size exceeds the allowed limit",
                    )

                temp_file.write(chunk)

        if size == 0:
            raise HTTPException(status_code=400, detail="Audio file is empty")

        with transcription_semaphore:
            result = transcribe_audio(temp_file_path)

        return {
            "success": True,
            "audio": {
                "originalName": original_name,
                "mimeType": mime_type,
                "size": size,
            },
            "transcription": {
                "model": result["model"],
                "language": result["language"],
                "detectedLanguage": result.get("detectedLanguage"),
            },
            "transcript": result["transcript"],
        }
    finally:
        await audio.close()

        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)


@app.post("/transcribe/from-object")
def transcribe_from_object(
    payload: TranscribeFromObjectRequest,
    authorization: str | None = Header(default=None),
    x_internal_service_token: str | None = Header(default=None),
):
    """Tai audio tu MinIO va tra ve transcript text cho NestJS backend."""
    validate_internal_token(authorization, x_internal_service_token)

    bucket = payload.bucket or MINIO_BUCKET
    if not bucket:
        raise HTTPException(status_code=400, detail="MinIO bucket is required")

    os.makedirs(TEMP_DIR, exist_ok=True)

    extension = Path(payload.objectKey).suffix or ".mp3"
    temp_file_path = os.path.join(TEMP_DIR, f"{uuid4().hex}{extension}")
    total_started_at = time.perf_counter()
    download_ms = 0
    transcribe_ms = 0

    logger.info(
        "Received transcribe object request: bucket=%s, objectKey=%s, sessionId=%s, turnId=%s",
        bucket,
        payload.objectKey,
        payload.sessionId,
        payload.turnId,
    )

    try:
        try:
            stat = minio_client.stat_object(bucket, payload.objectKey)
        except S3Error as error:
            logger.error(
                "MinIO error while stat object: code=%s, bucket=%s, objectKey=%s",
                error.code,
                bucket,
                payload.objectKey,
            )
            if error.code in {"NoSuchBucket", "NoSuchKey", "NoSuchObject"}:
                raise HTTPException(
                    status_code=404,
                    detail=f"MinIO object not found: {error.code}",
                ) from error

            raise HTTPException(
                status_code=502,
                detail=f"MinIO object stat failed: {error.code}",
            ) from error

        object_size = stat.size or 0
        if object_size > MAX_AUDIO_SIZE_BYTES:
            raise HTTPException(
                status_code=413,
                detail="Audio file size exceeds the allowed limit",
            )

        logger.info("Downloading MinIO object to temp file: %s", temp_file_path)
        download_started_at = time.perf_counter()
        minio_client.fget_object(bucket, payload.objectKey, temp_file_path)
        download_ms = elapsed_ms(download_started_at)

        transcribe_started_at = time.perf_counter()
        with transcription_semaphore:
            result = transcribe_audio(temp_file_path)
        transcribe_ms = elapsed_ms(transcribe_started_at)

        logger.info(
            "Transcribe object finished: objectKey=%s, downloadMs=%s, transcribeMs=%s, totalMs=%s",
            payload.objectKey,
            download_ms,
            transcribe_ms,
            elapsed_ms(total_started_at),
        )

        return {
            "success": True,
            "userId": str(payload.userId),
            "sessionId": str(payload.sessionId),
            "turnId": payload.turnId,
            "transcription": {
                "model": result["model"],
                "language": result["language"],
                "detectedLanguage": result.get("detectedLanguage"),
            },
            "transcript": result["transcript"],
        }
    except S3Error as error:
        logger.error(
            "MinIO error while reading object: code=%s, bucket=%s, objectKey=%s",
            error.code,
            bucket,
            payload.objectKey,
        )
        if error.code in {"NoSuchBucket", "NoSuchKey", "NoSuchObject"}:
            raise HTTPException(
                status_code=404,
                detail=f"MinIO object not found: {error.code}",
            ) from error

        raise HTTPException(
            status_code=502,
            detail=f"MinIO object read failed: {error.code}",
        ) from error
    except HTTPException:
        raise
    except Exception as error:
        logger.exception(
            "Transcribe failed: errorType=%s, bucket=%s, objectKey=%s",
            type(error).__name__,
            bucket,
            payload.objectKey,
        )
        raise HTTPException(
            status_code=500,
            detail=f"Transcription failed: {type(error).__name__}",
        ) from error
    finally:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
            logger.info("Temp file deleted: %s", temp_file_path)


def validate_internal_token(
    authorization: str | None,
    x_internal_service_token: str | None,
) -> None:
    if not INTERNAL_SERVICE_TOKEN:
        logger.warning(
            "Internal service token is not configured; skipping token validation"
        )
        return

    bearer_token = None
    if authorization and authorization.startswith("Bearer "):
        bearer_token = authorization.removeprefix("Bearer ").strip()

    if (
        x_internal_service_token != INTERNAL_SERVICE_TOKEN
        and bearer_token != INTERNAL_SERVICE_TOKEN
    ):
        raise HTTPException(status_code=401, detail="Invalid internal service token")


def elapsed_ms(started_at: float) -> int:
    return round((time.perf_counter() - started_at) * 1000)
