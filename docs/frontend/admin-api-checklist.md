# Admin API Checklist

Nguon xac nhan: Swagger live `http://localhost:8080/api/docs-json`, route list trong yeu cau va backend NestJS controllers/DTOs trong `backend-interview-project/src/module`.
Luu y: Da xac nhan path/response schema. Chua goi truc tiep cac protected endpoint lay data vi khong co admin JWT trong request.

## Auth and role

- Admin API dung `JwtAccessGuard` va `AdminRoleGuard` hoac `@AdminAuth()`.
- Frontend route guard doc cookie/token trong `src/proxy.ts`.
- ADMIN = role id `2`; user thuong = role id `1`.

## Interview master data

- Positions:
  - Co `GET /api/admin/interview-master-data/positions`.
  - Co `POST /api/admin/interview-master-data/positions`.
  - Co `PATCH /api/admin/interview-master-data/positions/{id}`.
  - Co `PATCH /api/admin/interview-master-data/positions/{id}/activate`.
  - Co `PATCH /api/admin/interview-master-data/positions/{id}/deactivate`.
  - Chua co endpoint `active`/`inactive` rieng; frontend filter active/inactive tu list day du.
  - Response item: `id`, `name`, `code`, `description`, `isActive`, `createdAt`, `updatedAt`.
- Levels:
  - Co `GET /api/admin/interview-master-data/levels`.
  - Co `POST /api/admin/interview-master-data/levels`.
  - Co `PATCH /api/admin/interview-master-data/levels/{id}`.
  - Co `PATCH /api/admin/interview-master-data/levels/{id}/activate`.
  - Co `PATCH /api/admin/interview-master-data/levels/{id}/deactivate`.
  - Chua co endpoint `active`/`inactive` rieng; frontend filter active/inactive tu list day du.
  - Response item: `id`, `name`, `code`, `description`, `displayOrder`, `isActive`, `createdAt`, `updatedAt`.
- Technologies:
  - Co list/all, active, inactive, create, update, activate, deactivate.
  - Response item: `id`, `name`, `slug`, `code`, `description`, `isActive`, `createdAt`, `updatedAt`.
- Topics:
  - Co list/all, active, inactive, create, update, activate, deactivate.
  - Response item: `id`, `name`, `code`, `description`, `isActive`, `createdAt`, `updatedAt`.

List response shape: `{ success, statusCode, message, data: Item[], meta: { total, itemCount, page?, limit? } }`.
Mutation response shape: `{ success, statusCode, message, data: Item }`.

## Question banks

- Co `GET /api/admin/interview-question-banks`.
- Co `GET /api/admin/interview-question-banks/{id}`.
- Co `POST /api/admin/interview-question-banks`.
- Co `PATCH /api/admin/interview-question-banks/{id}`.
- Co `DELETE /api/admin/interview-question-banks/{id}`.
- Response item: `id`, `topic`, `technology`, `title`, `content`, `questionType`, `difficulty`, `expectedAnswer`, `options`, `createdBy`, `createdAt`, `updatedAt`.
- Request create/update co `topicId`, `technologyId`, `title`, `content`, `questionType`, `difficulty`, `expectedAnswer`, `options`.
- Thieu theo yeu cau UI: backend Question Bank hien khong co `levelId` trong request va khong tra `level` trong response. Frontend khong tu doan field nay.
- Khong co endpoint active/inactive rieng cho question bank; chi co delete.

## Mock tests

- Co `GET /api/admin/mock-tests`.
- Co `GET /api/admin/mock-tests/{id}`.
- Co `POST /api/admin/mock-tests`.
- Co `PATCH /api/admin/mock-tests/{id}`.
- Co `DELETE /api/admin/mock-tests/{id}`.
- Co `PATCH /api/admin/mock-tests/{id}/publish`.
- Co `PATCH /api/admin/mock-tests/{id}/archive`.
- Co `POST /api/admin/mock-tests/{id}/questions`.
- List item response: `id`, `title`, `slug`, `description`, `coverImageUrl`, `durationMinutes`, `totalQuestions`, `status`, `createdAt`, `updatedAt`.
- Detail response them `questions`.
- Create/update request: `title`, `slug`, `description?`, `coverImageUrl?`, `durationMinutes?`.
- Attach questions request: `{ questionBankIds: number[] }`.
