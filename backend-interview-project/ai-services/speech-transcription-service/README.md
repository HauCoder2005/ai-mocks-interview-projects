# speech-transcription-service

Service tam thoi de chuyen voice/audio/mp3 thanh text transcript. Service nay chi xu ly audio -> text bang `openai-whisper`, chua tich hop LLM, Redis, database, NestJS hay interview agent.

## Setup

```bash
cd ai-services/speech-transcription-service

python3 -m venv .venv
source .venv/bin/activate

python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

## Run

```bash
python -m uvicorn main:app --app-dir src --host 0.0.0.0 --port 8001 --reload
```

Neu dat `AI_INTERNAL_SERVICE_TOKEN`, request `POST /transcribe` can gui header:

```bash
x-internal-service-token: dev-internal-token
```

## Run with Docker

```bash
docker build -t speech-transcription-service .
docker run --rm -p 8001:8001 \
  -e TRANSCRIPTION_MODEL_NAME=medium \
  -e TRANSCRIPTION_LANGUAGE=vi \
  -e AI_INTERNAL_SERVICE_TOKEN=dev-internal-token \
  speech-transcription-service
```

## Test health

```bash
curl http://localhost:8001/health
```

Expected response:

```json
{
  "status": "OK",
  "service": "speech-transcription-service",
  "transcription": {
    "model": "medium",
    "language": "vi"
  }
}
```

## Test transcribe

```bash
curl -X POST http://localhost:8001/transcribe \
  -H "x-internal-service-token: dev-internal-token" \
  -F "audio=@/path/to/test.mp3"
```
