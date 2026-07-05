import os

SERVICE_NAME = os.getenv("SERVICE_NAME", "speech-transcription-service")
TRANSCRIPTION_MODEL_NAME = os.getenv("TRANSCRIPTION_MODEL_NAME", "small")
TRANSCRIPTION_LANGUAGE = os.getenv("TRANSCRIPTION_LANGUAGE", "vi")
TRANSCRIPTION_MAX_CONCURRENCY = max(
    1,
    int(os.getenv("TRANSCRIPTION_MAX_CONCURRENCY", "1")),
)
INTERNAL_SERVICE_TOKEN = (
    os.getenv("AI_INTERNAL_SERVICE_TOKEN")
    or os.getenv("INTERNAL_SERVICE_TOKEN")
    or ""
)
MAX_AUDIO_SIZE_MB = int(
    os.getenv("MAX_AUDIO_SIZE_MB")
    or os.getenv("TRANSCRIPTION_MAX_AUDIO_MB")
    or "25"
)
MAX_AUDIO_SIZE_BYTES = MAX_AUDIO_SIZE_MB * 1024 * 1024
TEMP_DIR = os.getenv("TEMP_DIR") or os.getenv("TRANSCRIPTION_TEMP_DIR") or "temp"

MINIO_ENDPOINT = os.getenv("MINIO_ENDPOINT", "localhost:9000")
MINIO_ACCESS_KEY = os.getenv("MINIO_ACCESS_KEY", "")
MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY", "")
MINIO_BUCKET = os.getenv("MINIO_BUCKET", "")
MINIO_SECURE = os.getenv("MINIO_SECURE", "false").lower() == "true"

ALLOWED_AUDIO_TYPES = {
    "audio/mpeg",
    "audio/mp3",
    "audio/wav",
    "audio/x-wav",
    "audio/webm",
    "audio/ogg",
    "video/webm",
    "application/octet-stream",
}
