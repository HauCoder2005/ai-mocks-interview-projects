import os

SERVICE_NAME = os.getenv("SERVICE_NAME", "interview-agent-service")

OLLAMA_BASE_URL = os.getenv(
    "OLLAMA_BASE_URL",
    "http://localhost:11434",
).rstrip("/")

INTERVIEW_AGENT_MODEL = os.getenv("INTERVIEW_AGENT_MODEL", "qwen3:4b")

INTERVIEW_AGENT_TEMPERATURE = float(
    os.getenv("INTERVIEW_AGENT_TEMPERATURE", "0.2"),
)

INTERVIEW_AGENT_TIMEOUT_MS = int(
    os.getenv("INTERVIEW_AGENT_TIMEOUT_MS", "300000"),
)

INTERVIEW_AGENT_NUM_CTX = int(
    os.getenv("INTERVIEW_AGENT_NUM_CTX", "2048"),
)

INTERVIEW_AGENT_NUM_PREDICT = int(
    os.getenv("INTERVIEW_AGENT_NUM_PREDICT", "512"),
)

INTERNAL_SERVICE_TOKEN = (
    os.getenv("AI_INTERNAL_SERVICE_TOKEN")
    or os.getenv("INTERNAL_SERVICE_TOKEN")
    or ""
)