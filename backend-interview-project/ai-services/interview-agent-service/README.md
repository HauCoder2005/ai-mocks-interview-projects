# interview-agent-service

FastAPI service gọi Ollama `qwen3:4b` để đánh giá câu trả lời phỏng vấn.

Service này chỉ nhận context đã được NestJS backend chuẩn bị, không truy cập Prisma, MySQL, Redis, MinIO, Whisper hoặc speech-transcription-service.
