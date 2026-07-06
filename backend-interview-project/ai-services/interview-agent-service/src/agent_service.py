"""Gọi Ollama và chuẩn hóa response đánh giá phỏng vấn."""

import json
import logging
import time
from typing import Any

import httpx

from config import (
    INTERVIEW_AGENT_MODEL,
    INTERVIEW_AGENT_NUM_CTX,
    INTERVIEW_AGENT_NUM_PREDICT,
    INTERVIEW_AGENT_TEMPERATURE,
    INTERVIEW_AGENT_TIMEOUT_MS,
    OLLAMA_BASE_URL,
    SERVICE_NAME,
)
from prompt_builder import build_system_prompt, build_user_prompt
from schemas import EvaluateAnswerRequest, EvaluateAnswerResponse

logger = logging.getLogger(SERVICE_NAME)

REQUIRED_FIELDS = {
    "overallScore",
    "technicalScore",
    "communicationScore",
    "relevanceScore",
    "strengths",
    "weaknesses",
    "feedback",
    "improvedAnswerSuggestion",
    "nextQuestion",
    "shouldContinue",
    "topicFocus",
}


class InterviewAgentProviderUnavailable(Exception):
    pass


class InterviewAgentProviderTimeout(Exception):
    pass


class InvalidInterviewAIResponse(Exception):
    pass


class InterviewAgentService:
    """Service gọi Ollama để đánh giá câu trả lời."""

    def evaluate_answer(
        self,
        input: EvaluateAnswerRequest,
    ) -> EvaluateAnswerResponse:
        system_prompt = build_system_prompt()
        user_prompt = build_user_prompt(input)

        logger.info(
            "Evaluating interview answer: sessionId=%s, turnId=%s, model=%s, baseUrl=%s, timeoutMs=%s, numCtx=%s, numPredict=%s",
            input.sessionId,
            input.turnId,
            INTERVIEW_AGENT_MODEL,
            OLLAMA_BASE_URL,
            INTERVIEW_AGENT_TIMEOUT_MS,
            INTERVIEW_AGENT_NUM_CTX,
            INTERVIEW_AGENT_NUM_PREDICT,
        )

        started_at = time.perf_counter()

        content = self._call_ollama(system_prompt, user_prompt)
        parsed = self._parse_model_json(content)
        normalized = self._normalize_response(parsed)
        normalized["model"] = INTERVIEW_AGENT_MODEL

        elapsed_ms = int((time.perf_counter() - started_at) * 1000)

        logger.info(
            "Interview answer evaluated successfully: sessionId=%s, turnId=%s, elapsedMs=%s",
            input.sessionId,
            input.turnId,
            elapsed_ms,
        )

        return EvaluateAnswerResponse(**normalized)

    def _call_ollama(self, system_prompt: str, user_prompt: str) -> str:
        payload = {
            "model": INTERVIEW_AGENT_MODEL,
            "stream": False,
            "format": "json",
            "messages": [
                {
                    "role": "system",
                    "content": system_prompt,
                },
                {
                    "role": "user",
                    "content": user_prompt,
                },
            ],
            "options": {
                "temperature": INTERVIEW_AGENT_TEMPERATURE,
                "num_ctx": INTERVIEW_AGENT_NUM_CTX,
                "num_predict": INTERVIEW_AGENT_NUM_PREDICT,
            },
        }

        timeout_seconds = INTERVIEW_AGENT_TIMEOUT_MS / 1000
        started_at = time.perf_counter()

        try:
            response = httpx.post(
                f"{OLLAMA_BASE_URL}/api/chat",
                json=payload,
                timeout=httpx.Timeout(
                    timeout_seconds,
                    connect=10.0,
                ),
            )

            elapsed_ms = int((time.perf_counter() - started_at) * 1000)

            logger.info(
                "Ollama response received: status=%s, elapsedMs=%s, model=%s",
                response.status_code,
                elapsed_ms,
                INTERVIEW_AGENT_MODEL,
            )

            response.raise_for_status()
        except httpx.TimeoutException as error:
            elapsed_ms = int((time.perf_counter() - started_at) * 1000)

            logger.error(
                "Ollama request timeout: elapsedMs=%s, timeoutSeconds=%s, model=%s",
                elapsed_ms,
                timeout_seconds,
                INTERVIEW_AGENT_MODEL,
            )

            raise InterviewAgentProviderTimeout() from error
        except httpx.HTTPError as error:
            elapsed_ms = int((time.perf_counter() - started_at) * 1000)

            logger.error(
                "Ollama request failed: elapsedMs=%s, error=%s, model=%s",
                elapsed_ms,
                str(error),
                INTERVIEW_AGENT_MODEL,
            )

            raise InterviewAgentProviderUnavailable() from error

        data = response.json()
        content = data.get("message", {}).get("content")

        if not isinstance(content, str) or not content.strip():
            logger.error(
                "Ollama returned empty message content: data=%s",
                str(data)[:1000],
            )

            raise InvalidInterviewAIResponse()

        return content

    def _parse_model_json(self, content: str) -> dict[str, Any]:
        cleaned = content.strip()

        if cleaned.startswith("```"):
            cleaned = cleaned.removeprefix("```json").removeprefix("```").strip()
            cleaned = cleaned.removesuffix("```").strip()

        start = cleaned.find("{")
        end = cleaned.rfind("}")

        if start == -1 or end == -1 or end < start:
            logger.error(
                "Model response does not contain JSON object: content=%s",
                cleaned[:1000],
            )

            raise InvalidInterviewAIResponse()

        try:
            parsed = json.loads(cleaned[start : end + 1])
        except json.JSONDecodeError as error:
            logger.error(
                "Failed to parse model JSON: error=%s, content=%s",
                str(error),
                cleaned[:1000],
            )

            raise InvalidInterviewAIResponse() from error

        if not isinstance(parsed, dict):
            logger.error(
                "Model JSON is not object: parsed=%s",
                str(parsed)[:1000],
            )

            raise InvalidInterviewAIResponse()

        return parsed

    def _normalize_response(self, parsed: dict[str, Any]) -> dict[str, Any]:
        response = {
            "overallScore": 0,
            "technicalScore": 0,
            "communicationScore": 0,
            "relevanceScore": 0,
            "strengths": [],
            "weaknesses": [],
            "feedback": "",
            "improvedAnswerSuggestion": "",
            "nextQuestion": "",
            "shouldContinue": True,
            "topicFocus": "",
        }

        response.update(
            {
                key: parsed[key]
                for key in REQUIRED_FIELDS
                if key in parsed and parsed[key] is not None
            },
        )

        for key in [
            "overallScore",
            "technicalScore",
            "communicationScore",
            "relevanceScore",
        ]:
            response[key] = self._clamp_score(response.get(key))

        for key in ["strengths", "weaknesses"]:
            value = response.get(key)
            response[key] = value if isinstance(value, list) else []

        for key in [
            "feedback",
            "improvedAnswerSuggestion",
            "nextQuestion",
            "topicFocus",
        ]:
            value = response.get(key)
            response[key] = value if isinstance(value, str) else ""

        response["strengths"] = response["strengths"][:2]
        response["weaknesses"] = response["weaknesses"][:2]
        response["shouldContinue"] = bool(response.get("shouldContinue", True))

        return response

    def _clamp_score(self, value: Any) -> int:
        try:
            score = int(round(float(value)))
        except (TypeError, ValueError):
            return 0

        return max(0, min(100, score))