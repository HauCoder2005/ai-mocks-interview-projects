"""FastAPI routes cho interview-agent-service."""

import logging

from fastapi import Depends, FastAPI, HTTPException

from agent_service import (
    InterviewAgentProviderTimeout,
    InterviewAgentProviderUnavailable,
    InterviewAgentService,
    InvalidInterviewAIResponse,
)
from config import INTERVIEW_AGENT_MODEL, SERVICE_NAME
from schemas import EvaluateAnswerRequest, EvaluateAnswerResponse
from security import validate_internal_token

logging.basicConfig(level=logging.INFO)

app = FastAPI(title=SERVICE_NAME)
agent_service = InterviewAgentService()


@app.get("/health")
def health():
    """Trả trạng thái service và model đang dùng."""
    return {
        "service": SERVICE_NAME,
        "status": "ok",
        "model": INTERVIEW_AGENT_MODEL,
    }


@app.post(
    "/evaluate-answer",
    response_model=EvaluateAnswerResponse,
    dependencies=[Depends(validate_internal_token)],
)
def evaluate_answer(payload: EvaluateAnswerRequest) -> EvaluateAnswerResponse:
    """Đánh giá câu trả lời đã được backend chuẩn bị context."""
    if not (payload.rawTranscript or payload.normalizedTranscript):
        raise HTTPException(
            status_code=422,
            detail="rawTranscript or normalizedTranscript is required",
        )

    try:
        return agent_service.evaluate_answer(payload)
    except InterviewAgentProviderTimeout as error:
        raise HTTPException(
            status_code=504,
            detail="Interview AI provider timeout",
        ) from error
    except InterviewAgentProviderUnavailable as error:
        raise HTTPException(
            status_code=502,
            detail="Interview AI provider is unavailable",
        ) from error
    except InvalidInterviewAIResponse as error:
        raise HTTPException(
            status_code=502,
            detail="Invalid interview AI response format",
        ) from error
