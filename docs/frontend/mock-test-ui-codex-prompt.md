# Codex Frontend Prompt: Mock Test UX/UI

You are a Senior Frontend Engineer working on the Next.js app for AI Mock Interview.

Build the mock test/trắc nghiệm experience using the backend API in `docs/frontend/mock-test-api-contract.md`.

Requirements:

1. Add a landing section titled `Bài kiểm tra trắc nghiệm`.
2. Load cards from `GET /api/mock-tests`. Do not hardcode cards.
3. Do not mock data. All mock tests, questions, attempts, answers, and results must come from API.
4. Use white, blue, and slate colors.
5. Buttons should be square and restrained, with border radius around `4px` to `6px`.
6. Add loading, error, and empty states for every API-driven screen.
7. Add a confirmation modal before starting a test.
8. Start button calls `POST /api/mock-tests/:id/attempts/start` and navigates to `/mock-tests/attempts/:attemptId`.
9. Create `/mock-tests`, `/mock-tests/[slug]`, `/mock-tests/attempts/[attemptId]`, and `/mock-tests/attempts/[attemptId]/result`.
10. Attempt page must include header, timer when `durationMinutes` exists, question list/progress, option cards, previous/next buttons, and submit confirmation.
11. Selecting an option calls `POST /api/mock-tests/attempts/:attemptId/answers`.
12. Result page must show score, correct/total, review by question, correct/wrong state, selected answer, correct answer, and `expectedAnswer`.
13. Never display `isCorrect` or correct answer styling before the attempt is submitted.
14. Make the layout responsive for mobile and desktop.

Implementation notes:

- Reuse the existing API client/service pattern in the frontend project.
- Keep DTO types aligned with the API contract.
- Use authenticated API calls for attempt, answer, submit, result, and my-attempts endpoints.
- The landing cards and `/mock-tests` cards must use backend data only.
