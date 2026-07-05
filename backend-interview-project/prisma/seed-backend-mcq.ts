import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../generated/prisma/client';
import {
  interview_question_banks_difficulty,
  interview_question_banks_question_type,
  MockTestStatus,
} from '../generated/prisma/client';
import * as bcrypt from 'bcrypt';

type QuestionSeed = {
  key: string;
  title: string;
  content: string;
  technology: string;
  topic: string;
  difficulty: interview_question_banks_difficulty;
  expectedAnswer: string;
  options: string[];
  correctIndex: number;
};

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: Number(process.env.DATABASE_PORT ?? 3306),
  user: process.env.DATABASE_USER ?? 'root',
  password: process.env.DATABASE_PASSWORD ?? '',
  database: process.env.DATABASE_NAME ?? 'ai_mock_interview',
  allowPublicKeyRetrieval: true,
});

const prisma = new PrismaClient({ adapter });

const questions: QuestionSeed[] = [
  q('nestjs-module-exports', 'NestJS Module exports dùng khi nào?', 'Một service trong FeatureModule cần được module khác inject. Cấu hình nào đúng?', 'NestJS', 'Dependency Injection', 'EASY', 'Provider phải nằm trong providers và exports của module khai báo.', ['Chỉ thêm service vào imports', 'Thêm service vào providers và exports', 'Chỉ thêm @Global()', 'Chỉ thêm service vào controllers'], 1),
  q('injectable-provider', '@Injectable() có vai trò gì?', 'Trong NestJS, decorator @Injectable() trên service chủ yếu giúp điều gì?', 'NestJS', 'Dependency Injection', 'EASY', 'Đánh dấu class có thể tham gia DI container.', ['Biến class thành controller', 'Đăng ký route HTTP', 'Cho phép DI metadata cho provider', 'Tự tạo database table'], 2),
  q('custom-provider-token', 'Khi nào cần custom provider token?', 'Bạn muốn inject implementation qua interface-like token trong NestJS. Cách nào phù hợp?', 'NestJS', 'Dependency Injection', 'MEDIUM', 'Dùng provide/useClass hoặc useValue với token rõ ràng.', ['Dùng interface TypeScript trực tiếp runtime', 'Dùng provide với string/symbol token', 'Dùng @Controller token', 'Dùng only default export'], 1),
  q('guard-auth-order', 'Guard nên xử lý gì?', 'Endpoint cần kiểm tra JWT trước khi vào business logic. Thành phần NestJS nào phù hợp nhất?', 'NestJS', 'Authentication & Authorization', 'EASY', 'Guard quyết định request có được đi tiếp hay không.', ['Pipe', 'Guard', 'Interceptor', 'Exception filter'], 1),
  q('pipe-validation', 'ValidationPipe whitelist làm gì?', 'Global ValidationPipe bật whitelist: true có tác dụng gì với DTO?', 'NestJS', 'Error Handling & Validation', 'MEDIUM', 'Loại bỏ property không có decorator validation.', ['Tự mã hóa password', 'Loại bỏ field không khai báo validator', 'Cache response', 'Tạo Swagger schema'], 1),
  q('interceptor-use-case', 'Interceptor phù hợp use case nào?', 'Bạn cần đo thời gian xử lý request và chuẩn hóa response sau handler. Nên dùng gì?', 'NestJS', 'Error Handling & Validation', 'MEDIUM', 'Interceptor bọc trước/sau handler qua stream.', ['Guard', 'Pipe', 'Interceptor', 'Module'], 2),
  q('exception-filter', 'Exception filter dùng để làm gì?', 'Bạn muốn map lỗi domain thành HTTP response thống nhất. Thành phần nào phù hợp?', 'NestJS', 'Error Handling & Validation', 'MEDIUM', 'Exception filter bắt và format exception.', ['Exception filter', 'Provider scope', 'Dynamic module', 'DTO'], 0),
  q('jwt-expiry', 'Access token JWT nên có TTL thế nào?', 'Thiết kế auth dùng access token và refresh token. Access token nên được cấu hình ra sao?', 'Node.js', 'Authentication & Authorization', 'EASY', 'Access token nên ngắn hạn để giảm rủi ro khi lộ token.', ['Không hết hạn', 'Ngắn hạn', 'Lưu plaintext DB', 'Chỉ dùng localStorage là đủ'], 1),
  q('refresh-token-rotation', 'Refresh token rotation giải quyết gì?', 'Khi user refresh token, backend cấp refresh token mới và revoke token cũ. Mục tiêu chính là gì?', 'Node.js', 'Authentication & Authorization', 'HARD', 'Giảm replay risk và phát hiện token reuse.', ['Tăng kích thước JWT', 'Giảm replay risk', 'Bỏ cần HTTPS', 'Tự tạo role'], 1),
  q('password-hashing', 'Hash password đúng cách', 'Thuật toán/chiến lược nào phù hợp để lưu password người dùng?', 'Node.js', 'Authentication & Authorization', 'EASY', 'Dùng bcrypt/argon2 kèm salt, không lưu plaintext.', ['SHA1 một vòng', 'Plaintext trong DB', 'bcrypt hoặc argon2', 'Base64 password'], 2),
  q('rbac-source', 'RBAC nên kiểm tra từ đâu?', 'API admin cần chặn user thường. Backend nên dựa vào gì?', 'NestJS', 'Authentication & Authorization', 'MEDIUM', 'Role/permission từ token đã verify hoặc DB trusted, không từ body.', ['role trong request body', 'role từ token/DB trusted', 'query admin=true', 'header tự đặt X-Role'], 1),
  q('prisma-relation-include', 'Prisma include relation', 'Bạn cần lấy question kèm options trong một query Prisma. Cách nào đúng?', 'Prisma', 'Prisma ORM', 'EASY', 'Dùng include/select relation rõ ràng.', ['include relation options', 'JSON.parse thủ công', 'Raw query luôn bắt buộc', 'Chỉ dùng count'], 0),
  q('prisma-transaction', 'Khi nào dùng transaction?', 'Tạo attempt và nhiều answer phải đảm bảo cùng thành công hoặc rollback. Nên dùng gì?', 'Prisma', 'Prisma ORM', 'MEDIUM', 'Dùng Prisma transaction.', ['Promise.race', 'setTimeout', '$transaction', 'Middleware frontend'], 2),
  q('migration-vs-db-push', 'Migration khác db push thế nào?', 'Trong team production, vì sao ưu tiên migration thay vì db push?', 'Prisma', 'Database Modeling', 'MEDIUM', 'Migration lưu lịch sử thay đổi schema có thể review/deploy.', ['Migration có lịch sử versioned', 'db push tạo test unit', 'db push luôn an toàn production', 'Migration không đổi DB'], 0),
  q('unique-index', 'Unique index cho slug', 'Bảng mock_tests có slug dùng URL. Constraint nào nên có?', 'MySQL', 'Database Modeling', 'EASY', 'Slug nên unique để route detail không mơ hồ.', ['Không index', 'Unique index trên slug', 'Full table scan', 'Index trên description only'], 1),
  q('n-plus-one', 'N+1 query là gì?', 'Danh sách 20 bài thi, mỗi bài lại query riêng câu hỏi. Đây là vấn đề gì?', 'Prisma', 'Caching & Performance', 'MEDIUM', 'N+1 query gây nhiều round-trip, nên batch/include hợp lý.', ['N+1 query', 'Deadlock chắc chắn', 'SQL injection', 'JWT replay'], 0),
  q('pagination-total', 'Pagination API nên trả gì?', 'Frontend cần render phân trang danh sách mock test. Meta nào hữu ích?', 'Node.js', 'REST API Design', 'EASY', 'Trả total, itemCount, page, limit.', ['Chỉ trả array', 'total/page/limit', 'Password hash', 'JWT secret'], 1),
  q('error-response', 'Response lỗi validation nên thế nào?', 'DTO thiếu selectedOptionId. Backend nên phản hồi gì?', 'NestJS', 'Error Handling & Validation', 'EASY', 'HTTP 400 với message rõ ràng.', ['200 và ignore', '400 Bad Request', '500 mọi trường hợp', '301 redirect'], 1),
  q('redis-cache-ttl', 'Redis TTL dùng để làm gì?', 'Cache danh sách bài thi publish trong Redis. Vì sao cần TTL?', 'Redis', 'Caching & Performance', 'EASY', 'TTL giúp cache tự hết hạn và tránh dữ liệu cũ mãi mãi.', ['Không bao giờ expire', 'Tự xóa DB row', 'Expire cache sau thời gian định trước', 'Mã hóa token'], 2),
  q('rate-limit-login', 'Rate limit login bảo vệ gì?', 'Endpoint login bị brute force. Biện pháp backend phù hợp?', 'Redis', 'Authentication & Authorization', 'MEDIUM', 'Rate limit theo IP/user bằng store như Redis.', ['Tăng TTL JWT', 'Rate limit theo IP/user', 'Tắt HTTPS', 'Trả password hash'], 1),
  q('dockerfile-layer', 'Dockerfile layer cache', 'Vì sao thường copy package.json và npm install trước khi copy source?', 'Docker', 'Docker Deployment', 'MEDIUM', 'Tận dụng layer cache cho dependencies.', ['Để bỏ qua build', 'Tận dụng cache dependency', 'Để lộ env', 'Chạy container không cần node'], 1),
  q('docker-compose-db', 'docker-compose cho database', 'Service backend phụ thuộc MySQL healthy. Compose nên cấu hình gì?', 'Docker', 'Docker Deployment', 'MEDIUM', 'Dùng healthcheck/depends_on condition phù hợp.', ['Chỉ sleep cố định là chuẩn nhất', 'healthcheck cho DB', 'Hardcode password trong image', 'Bỏ network'], 1),
  q('env-secrets', 'Secrets trong backend nên quản lý thế nào?', 'JWT_SECRET production nên được đặt ở đâu?', 'Docker', 'Docker Deployment', 'EASY', 'Qua environment/secrets manager, không commit vào git.', ['Commit vào repo', 'Environment/secrets manager', 'Log ra console', 'Hardcode trong DTO'], 1),
  q('health-check', 'Health check endpoint nên kiểm tra gì?', 'Backend cần endpoint /health cho deployment. Nên kiểm tra tối thiểu gì?', 'Node.js', 'Docker Deployment', 'MEDIUM', 'App sống và dependencies quan trọng như DB/Redis nếu cần.', ['Chỉ trả random', 'DB/Redis connectivity quan trọng', 'Password user đầu tiên', 'Toàn bộ bảng production'], 1),
  q('rest-idempotency', 'PUT/PATCH trong REST', 'Cập nhật một mock test một phần nên dùng method nào?', 'Node.js', 'REST API Design', 'EASY', 'PATCH phù hợp partial update.', ['GET', 'PATCH', 'CONNECT', 'TRACE'], 1),
  q('mcq-no-correct-before-submit', 'Không lộ đáp án MCQ', 'API lấy đề thi cho candidate không nên trả field nào?', 'NestJS', 'REST API Design', 'EASY', 'Không trả isCorrect/correctOptionId trước submit.', ['displayOrder', 'content', 'isCorrect', 'title'], 2),
  q('attempt-owner-check', 'Owner check attempt', 'User A gọi result attempt của User B. Backend nên làm gì?', 'NestJS', 'Authentication & Authorization', 'MEDIUM', 'Chỉ cho owner xem, trả 404/403.', ['Trả kết quả nếu biết id', 'Chỉ owner được xem', 'Cho xem nếu score cao', 'Bỏ auth'], 1),
  q('prisma-cascade', 'Cascade delete dùng khi nào?', 'Xóa mock test nên tự xóa rows mock_test_questions. Relation nên cấu hình gì?', 'Prisma', 'Database Modeling', 'MEDIUM', 'onDelete Cascade ở bảng nối.', ['onDelete Cascade', 'onDelete SetDefault', 'Không foreign key', 'Client tự đoán'], 0),
  q('index-foreign-key', 'Index foreign key', 'Bảng test_attempt_answers thường query theo attempt_id. Nên thêm gì?', 'MySQL', 'Database Modeling', 'EASY', 'Index attempt_id để truy vấn nhanh hơn.', ['Index attempt_id', 'Xóa primary key', 'Lưu JSON duy nhất', 'Không cần index bao giờ'], 0),
  q('submit-score', 'Tính điểm submit', 'Bài có 10 câu, đúng 7 câu. Score phần trăm nên là bao nhiêu?', 'Node.js', 'REST API Design', 'EASY', 'Score = correct / total * 100 = 70.', ['7', '70', '700', '0.7 luôn lưu string'], 1),
];

const tests = [
  ['Backend Foundation - Junior', 'backend-foundation-junior', 0, 12],
  ['NestJS Core Concepts', 'nestjs-core-concepts', 0, 12],
  ['Prisma & Database Modeling', 'prisma-database-modeling', 11, 12],
  ['Authentication & Security Backend', 'authentication-security-backend', 7, 12],
  ['Backend Performance & Redis', 'backend-performance-redis', 15, 10],
  ['Docker for Backend Developers', 'docker-for-backend-developers', 20, 10],
] as const;

function q(
  key: string,
  title: string,
  content: string,
  technology: string,
  topic: string,
  difficulty: interview_question_banks_difficulty,
  expectedAnswer: string,
  options: string[],
  correctIndex: number,
): QuestionSeed {
  return { key, title, content, technology, topic, difficulty, expectedAnswer, options, correctIndex };
}

async function main(): Promise<void> {
  await seedRoles();
  const admin = await seedAdminUser();
  await seedMasterData();
  const questionIds = await seedQuestions(admin.id);
  await seedMockTests(admin.id, questionIds);
}

async function seedRoles(): Promise<void> {
  await prisma.roles.upsert({
    where: { id: 1 },
    update: { name: 'USER', description: 'Default platform user', updated_at: new Date() },
    create: { id: 1, name: 'USER', description: 'Default platform user' },
  });
  await prisma.roles.upsert({
    where: { id: 2 },
    update: { name: 'ADMIN', description: 'System administrator', updated_at: new Date() },
    create: { id: 2, name: 'ADMIN', description: 'System administrator' },
  });
}

async function seedAdminUser() {
  return prisma.users.upsert({
    where: { email: 'seed-admin@ai-mock.local' },
    update: { role_id: 2, updated_at: new Date() },
    create: {
      role_id: 2,
      email: 'seed-admin@ai-mock.local',
      password_hash: await bcrypt.hash('Admin@123456', 10),
      first_name: 'Seed',
      last_name: 'Admin',
      phone_number: '0000000000',
      headline: 'Seed administrator',
      current_position: 'System Administrator',
      is_verified: true,
    },
  });
}

async function seedMasterData(): Promise<void> {
  for (const [name, code] of [
    ['Backend Developer', 'BACKEND_DEVELOPER'],
    ['Node.js Developer', 'NODEJS_DEVELOPER'],
    ['NestJS Developer', 'NESTJS_DEVELOPER'],
  ]) {
    await prisma.interview_positions.upsert({ where: { code }, update: { name, is_active: true, updated_at: new Date() }, create: { name, code, is_active: true } });
  }

  for (const [name, code, display_order] of [
    ['Intern', 'INTERN', 1],
    ['Fresher', 'FRESHER', 2],
    ['Junior', 'JUNIOR', 3],
    ['Middle', 'MIDDLE', 4],
    ['Senior', 'SENIOR', 5],
  ] as const) {
    await prisma.interview_levels.upsert({ where: { code }, update: { name, display_order, is_active: true, updated_at: new Date() }, create: { name, code, display_order, is_active: true } });
  }

  for (const name of ['Node.js', 'TypeScript', 'NestJS', 'Prisma', 'MySQL', 'Redis', 'Docker']) {
    const code = name.toUpperCase().replace(/[^A-Z0-9]/g, '_');
    await prisma.interview_technologies.upsert({ where: { code }, update: { name, slug: code.toLowerCase().replace(/_/g, '-'), is_active: true, updated_at: new Date() }, create: { name, code, slug: code.toLowerCase().replace(/_/g, '-'), is_active: true } });
  }

  for (const name of ['REST API Design', 'Dependency Injection', 'Authentication & Authorization', 'Database Modeling', 'Prisma ORM', 'Caching & Performance', 'Error Handling & Validation', 'Docker Deployment']) {
    const code = name.toUpperCase().replace(/[^A-Z0-9]/g, '_');
    await prisma.interview_topics.upsert({ where: { code }, update: { name, is_active: true, updated_at: new Date() }, create: { name, code, is_active: true } });
  }
}

async function seedQuestions(adminUserId: number): Promise<Record<string, number>> {
  const result: Record<string, number> = {};
  for (const item of questions) {
    const technology = await prisma.interview_technologies.findFirstOrThrow({ where: { name: item.technology } });
    const topic = await prisma.interview_topics.findFirstOrThrow({ where: { name: item.topic } });
    const existing = await prisma.interview_question_banks.findFirst({ where: { title: item.title } });
    const question = existing
      ? await prisma.interview_question_banks.update({
          where: { id: existing.id },
          data: {
            topic_id: topic.id,
            technology_id: technology.id,
            content: item.content,
            question_type: interview_question_banks_question_type.MCQ,
            difficulty: item.difficulty,
            expected_answer: item.expectedAnswer,
            updated_at: new Date(),
          },
        })
      : await prisma.interview_question_banks.create({
          data: {
            topic_id: topic.id,
            technology_id: technology.id,
            title: item.title,
            content: item.content,
            question_type: interview_question_banks_question_type.MCQ,
            difficulty: item.difficulty,
            expected_answer: item.expectedAnswer,
            created_by: adminUserId,
          },
        });

    await prisma.interview_question_bank_options.deleteMany({ where: { question_bank_id: question.id } });
    await prisma.interview_question_bank_options.createMany({
      data: item.options.map((content, index) => ({
        question_bank_id: question.id,
        content,
        is_correct: index === item.correctIndex,
        display_order: index + 1,
      })),
    });
    result[item.key] = question.id;
  }
  return result;
}

async function seedMockTests(adminUserId: number, questionIds: Record<string, number>): Promise<void> {
  const allQuestionIds = questions.map((item) => questionIds[item.key]);
  for (const [title, slug, start, count] of tests) {
    const selectedIds = Array.from({ length: count }, (_, index) => allQuestionIds[(start + index) % allQuestionIds.length]);
    const mockTest = await prisma.mockTest.upsert({
      where: { slug },
      update: {
        title,
        description: `${title} - bộ câu hỏi MCQ backend thực tế.`,
        duration_minutes: 30,
        status: MockTestStatus.PUBLISHED,
        total_questions: selectedIds.length,
        updated_at: new Date(),
      },
      create: {
        title,
        slug,
        description: `${title} - bộ câu hỏi MCQ backend thực tế.`,
        duration_minutes: 30,
        total_questions: selectedIds.length,
        status: MockTestStatus.PUBLISHED,
        created_by: adminUserId,
      },
    });

    await prisma.mockTestQuestion.deleteMany({ where: { mock_test_id: mockTest.id } });
    await prisma.mockTestQuestion.createMany({
      data: selectedIds.map((question_bank_id, index) => ({
        mock_test_id: mockTest.id,
        question_bank_id,
        display_order: index + 1,
      })),
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
