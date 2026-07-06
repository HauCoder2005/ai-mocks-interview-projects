"""Pydantic schemas cho API đánh giá câu trả lời phỏng vấn."""

from pydantic import BaseModel, Field


class SessionContext(BaseModel):
    currentQuestionIndex: int | None = None
    totalQuestions: int | None = None
    answeredQuestionCount: int | None = None
    remainingQuestionCount: int | None = None


class EvaluateAnswerRequest(BaseModel):
    sessionId: str
    turnId: str
    question: str = Field(..., min_length=1)
    mainTopic: str = ""
    positionName: str = ""
    levelName: str = ""
    interviewType: str = ""
    rawTranscript: str | None = None
    normalizedTranscript: str | None = None
    previousQuestions: list[str] = Field(default_factory=list)
    previousAnswers: list[str] = Field(default_factory=list)
    sessionContext: SessionContext | None = None
    evaluationLanguage: str = "vi"


class EvaluateAnswerResponse(BaseModel):
    overallScore: int = Field(default=0, ge=0, le=100)
    technicalScore: int = Field(default=0, ge=0, le=100)
    communicationScore: int = Field(default=0, ge=0, le=100)
    relevanceScore: int = Field(default=0, ge=0, le=100)
    strengths: list[str] = Field(default_factory=list)
    weaknesses: list[str] = Field(default_factory=list)
    feedback: str = ""
    improvedAnswerSuggestion: str = ""
    nextQuestion: str = ""
    shouldContinue: bool = True
    topicFocus: str = ""
    model: str = ""
