# Mock Test API Contract

Base path: `/api`

## Candidate Endpoints

### `GET /mock-tests`
Public. Returns published mock tests.

Query: `keyword`, `technologyId`, `topicId`, `difficulty`, `page`, `limit`.

Response `data[]`: `id`, `title`, `slug`, `description`, `coverImageUrl`, `durationMinutes`, `totalQuestions`, `status`, `createdAt`, `updatedAt`.

Response `meta`: `total`, `itemCount`, `page`, `limit`.

### `GET /mock-tests/:slug`
Public. Returns published mock test detail and questions. Candidate response never includes `isCorrect`.

Question shape: `id`, `title`, `content`, `difficulty`, `technology`, `topic`, `displayOrder`, `options[]`.

Option shape before submit: `id`, `content`, `displayOrder`.

### `POST /mock-tests/:id/attempts/start`
Auth required. Creates an `IN_PROGRESS` attempt for current user.

Response: `id`, `mockTestId`, `status`, `totalQuestions`, `correctAnswers`, `score`, `startedAt`, `completedAt`.

### `GET /mock-tests/attempts/:attemptId`
Auth required. Owner only. Returns attempt, mock test, questions, and selected answers. Does not include correct answers unless the attempt is completed.

### `POST /mock-tests/attempts/:attemptId/answers`
Auth required. Owner only. Saves or replaces an answer.

Request:
```json
{
  "questionBankId": 1,
  "selectedOptionId": 10
}
```

Response: `questionBankId`, `selectedOptionId`, `answeredAt`.

### `POST /mock-tests/attempts/:attemptId/submit`
Auth required. Owner only. Completes attempt and calculates `score = correctAnswers / totalQuestions * 100`.

Response: `attemptId`, `status`, `score`, `totalQuestions`, `correctAnswers`, `completedAt`.

### `GET /mock-tests/attempts/:attemptId/result`
Auth required. Owner only. Completed attempts only. Returns correct answers for review.

Answer review shape: `questionId`, `questionTitle`, `questionContent`, `selectedOptionId`, `correctOptionId`, `isCorrect`, `expectedAnswer`, `options[]`.

Result options include `isCorrect`.

### `GET /mock-tests/my-attempts`
Auth required. Returns current user attempt history with mock test summary.

## Admin Endpoints

All admin endpoints require bearer access token with admin role.

### `GET /admin/mock-tests`
Query: `keyword`, `technologyId`, `topicId`, `difficulty`, `page`, `limit`.

### `POST /admin/mock-tests`
Request:
```json
{
  "title": "NestJS Core Concepts",
  "slug": "nestjs-core-concepts",
  "description": "Kiểm tra kiến thức NestJS nền tảng.",
  "coverImageUrl": "https://example.com/nestjs.png",
  "durationMinutes": 30
}
```

### `GET /admin/mock-tests/:id`
Returns detail including questions and correct options.

### `PATCH /admin/mock-tests/:id`
Partial update for title, slug, description, coverImageUrl, durationMinutes.

### `DELETE /admin/mock-tests/:id`
Deletes mock test. Related `mock_test_questions` and attempts cascade by schema relation.

### `PATCH /admin/mock-tests/:id/publish`
Sets status to `PUBLISHED`.

### `PATCH /admin/mock-tests/:id/archive`
Sets status to `ARCHIVED`.

### `POST /admin/mock-tests/:id/questions`
Replaces question list and updates `totalQuestions`.

Request:
```json
{
  "questionBankIds": [1, 2, 3]
}
```

## Frontend Flow

1. Landing page and `/mock-tests` load cards from `GET /api/mock-tests`.
2. User opens `/mock-tests/[slug]` or confirmation modal using detail from `GET /api/mock-tests/:slug`.
3. Start button calls `POST /api/mock-tests/:id/attempts/start`.
4. Navigate to `/mock-tests/attempts/:attemptId`.
5. Attempt page calls `GET /api/mock-tests/attempts/:attemptId`.
6. Selecting an option calls `POST /api/mock-tests/attempts/:attemptId/answers`.
7. Submit confirmation calls `POST /api/mock-tests/attempts/:attemptId/submit`.
8. Result page calls `GET /api/mock-tests/attempts/:attemptId/result`.

## UI Pages

- `/mock-tests`
- `/mock-tests/[slug]`
- `/mock-tests/attempts/[attemptId]`
- `/mock-tests/attempts/[attemptId]/result`
- Landing section: `Bài kiểm tra trắc nghiệm`

## Frontend Rules

- Do not mock mock-test cards or questions.
- Cards come from `GET /api/mock-tests`.
- Questions come from detail/attempt APIs.
- Never show `isCorrect`, `correctOptionId`, or correct styling before submit.
