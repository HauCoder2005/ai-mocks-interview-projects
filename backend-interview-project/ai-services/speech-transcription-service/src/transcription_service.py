import logging
import os
from threading import Lock

import whisper

from config import SERVICE_NAME, TRANSCRIPTION_LANGUAGE, TRANSCRIPTION_MODEL_NAME

logger = logging.getLogger(SERVICE_NAME)
_model = None
_model_lock = Lock()


def get_model():
    """Load transcription model mot lan cho toan bo service."""
    global _model
    if _model is None:
        with _model_lock:
            if _model is None:
                logger.info(
                    "Loading transcription model: %s, cachePath=%s",
                    TRANSCRIPTION_MODEL_NAME,
                    os.getenv("XDG_CACHE_HOME", "/root/.cache"),
                )
                _model = whisper.load_model(TRANSCRIPTION_MODEL_NAME)
                logger.info(
                    "Transcription model loaded successfully: model=%s",
                    TRANSCRIPTION_MODEL_NAME,
                )
    return _model


def is_model_loaded() -> bool:
    return _model is not None


def preload_transcription_model() -> None:
    get_model()


def transcribe_audio(audio_path: str) -> dict:
    """Chuyen audio file thanh transcript text bang transcription model local."""
    transcription_model = get_model()
    result = transcription_model.transcribe(
        audio_path,
        language=TRANSCRIPTION_LANGUAGE,
        task="transcribe",
        fp16=False,
        verbose=False,
    )
    transcript = result.get("text", "").strip()
    return {
        "transcript": transcript,
        "language": TRANSCRIPTION_LANGUAGE,
        "detectedLanguage": result.get("language"),
        "model": TRANSCRIPTION_MODEL_NAME,
    }
