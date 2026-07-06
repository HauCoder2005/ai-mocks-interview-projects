"""Tạo system prompt và user prompt cho AI phỏng vấn."""

from schemas import EvaluateAnswerRequest


RESPONSE_SCHEMA = """{
  "overallScore": 0,
  "technicalScore": 0,
  "communicationScore": 0,
  "relevanceScore": 0,
  "strengths": [],
  "weaknesses": [],
  "feedback": "",
  "improvedAnswerSuggestion": "",
  "nextQuestion": "",
  "shouldContinue": true,
  "topicFocus": "",
  "model": ""
}"""


def build_system_prompt() -> str:
    """Tạo system prompt ngắn, ép model trả JSON nhanh."""
    return f"""
/no_think
Bạn là AI Senpai, người phỏng vấn kỹ thuật trong hệ thống AI Mock Interview.

Nhiệm vụ:
- Đánh giá nội bộ câu trả lời hiện tại của ứng viên.
- Phản hồi tự nhiên, ngắn gọn bằng tiếng Việt như một người phỏng vấn.
- Hỏi đúng 1 câu tiếp theo phù hợp với vị trí, level và chủ đề.

Bắt buộc:
- Chỉ trả JSON hợp lệ.
- Không Markdown.
- Không code block.
- Không giải thích ngoài JSON.
- Không in quá trình suy nghĩ.
- Không thêm field ngoài schema.
- Không bịa kinh nghiệm ứng viên chưa nói.
- Điểm số là số nguyên từ 0 đến 100.
- Không được nhắc điểm số trong feedback.
- Không được nhắc điểm số trong improvedAnswerSuggestion.
- Không được nhắc điểm số trong nextQuestion.
- Các field điểm số chỉ dùng nội bộ để tổng kết sau phiên, không công bố trong hội thoại.

Cách phản hồi trong feedback:
- Viết như người phỏng vấn đang trò chuyện.
- Không dùng kiểu chấm bài công khai.
- Không viết "Điểm của bạn là...".
- Không viết "Bạn đạt .../100".
- Không viết "overallScore", "technicalScore", "communicationScore", "relevanceScore".
- Nếu câu trả lời còn thiếu, góp ý nhẹ nhàng rồi hỏi tiếp.

Giới hạn:
- strengths tối đa 2 ý.
- weaknesses tối đa 2 ý.
- feedback tối đa 2 câu.
- improvedAnswerSuggestion tối đa 3 câu.
- nextQuestion đúng 1 câu.

Schema JSON bắt buộc:
{RESPONSE_SCHEMA}
""".strip()


def build_user_prompt(input: EvaluateAnswerRequest) -> str:
    """Tạo prompt người dùng từ context backend đã chuẩn bị."""
    answer = input.normalizedTranscript or input.rawTranscript or ""
    previous_questions = format_recent_list(input.previousQuestions)
    previous_answers = format_recent_list(input.previousAnswers)

    return f"""
/no_think
Hãy đánh giá nội bộ câu trả lời phỏng vấn sau và tạo phản hồi hội thoại tự nhiên.

Thông tin phiên:
- sessionId: {input.sessionId}
- turnId: {input.turnId}
- mainTopic: {input.mainTopic or "Interview"}
- positionName: {input.positionName or "Candidate"}
- levelName: {input.levelName or "Candidate"}
- interviewType: {input.interviewType or "TECHNICAL"}

Câu hỏi hiện tại:
{input.question}

Câu trả lời của ứng viên:
{answer}

Câu hỏi gần nhất trước đó:
{previous_questions}

Câu trả lời gần nhất trước đó:
{previous_answers}

Quy tắc đánh giá:
- Vẫn chấm điểm đầy đủ trong các field score của JSON.
- Không được công bố điểm trong feedback hoặc nextQuestion.
- feedback chỉ là nhận xét tự nhiên, ngắn gọn, giống người phỏng vấn đang phản hồi.
- Nếu ứng viên trả lời đúng trọng tâm, hỏi sâu hơn vào nội dung họ vừa nói.
- Nếu câu trả lời quá chung chung, hỏi tiếp để yêu cầu ví dụ cụ thể.
- Nếu câu trả lời lệch chủ đề, kéo ứng viên quay lại chủ đề chính.
- Không lặp lại câu hỏi cũ.
- Trả JSON đúng schema.
""".strip()


def format_recent_list(items: list[str], limit: int = 3) -> str:
    """Chỉ lấy vài item gần nhất để prompt không phình to."""
    if not items:
        return "- Không có"
    recent_items = items[-limit:]
    return "\n".join(f"- {item}" for item in recent_items)