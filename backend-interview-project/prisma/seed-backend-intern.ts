import "dotenv/config";

import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client";

type MariaDbConfig = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  allowPublicKeyRetrieval: boolean;
};

function buildMariaDbConfig(): MariaDbConfig {
  const databaseUrl = process.env.DATABASE_URL;

  if (databaseUrl) {
    const url = new URL(databaseUrl);

    return {
      host: url.hostname || "127.0.0.1",
      port: Number(url.port || 3306),
      user: decodeURIComponent(url.username || "root"),
      password: decodeURIComponent(url.password || ""),
      database: url.pathname.replace(/^\//, "") || "ai_mock_interview",
      allowPublicKeyRetrieval: true,
    };
  }

  return {
    host: process.env.DATABASE_HOST || "127.0.0.1",
    port: Number(process.env.DATABASE_PORT || 3306),
    user: process.env.DATABASE_USER || "root",
    password: process.env.DATABASE_PASSWORD || "",
    database: process.env.DATABASE_NAME || "ai_mock_interview",
    allowPublicKeyRetrieval: true,
  };
}

const adapter = new PrismaMariaDb(buildMariaDbConfig());
const prisma = new PrismaClient({ adapter });


type ConceptSeed = {
  label: string;
  purpose: string;
};

type TestSeed = {
  title: string;
  slug: string;
  description: string;
  technologyCode: string;
  topicCode: string;
  durationMinutes: number;
  concepts: ConceptSeed[];
};

function normalizeSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const testSeeds: TestSeed[] = [

  {

    title: 'Backend Intern Foundation',

    slug: 'backend-intern-foundation',

    description: 'Kiểm tra nền tảng backend cho intern: client-server, API, request/response, database và luồng xử lý cơ bản.',

    technologyCode: 'NODEJS',

    topicCode: 'REST_API_DESIGN',

    durationMinutes: 20,

    concepts: [

      { label: 'Client-server', purpose: 'mô hình trong đó client gửi request và server xử lý rồi trả response' },

      { label: 'Backend service', purpose: 'phần xử lý nghiệp vụ, dữ liệu, xác thực và cung cấp API cho frontend hoặc service khác' },

      { label: 'API endpoint', purpose: 'địa chỉ cụ thể để client gọi một chức năng backend' },

      { label: 'Request body', purpose: 'phần dữ liệu client gửi lên server trong các method như POST hoặc PATCH' },

      { label: 'Response body', purpose: 'phần dữ liệu server trả về cho client sau khi xử lý request' },

      { label: 'HTTP status code', purpose: 'mã trạng thái giúp client biết request thành công, lỗi do client hay lỗi server' },

      { label: 'JSON', purpose: 'định dạng dữ liệu phổ biến để trao đổi giữa frontend và backend' },

      { label: 'Environment variable', purpose: 'biến cấu hình đặt ngoài source code để thay đổi theo môi trường chạy' },

      { label: 'Logging', purpose: 'việc ghi lại thông tin hoạt động và lỗi để debug, giám sát hệ thống' },

      { label: 'Pagination', purpose: 'kỹ thuật chia danh sách dữ liệu thành nhiều trang để tránh trả quá nhiều bản ghi' },

      { label: 'Filtering', purpose: 'kỹ thuật lọc dữ liệu theo điều kiện như trạng thái, từ khóa hoặc ngày tạo' },

      { label: 'Sorting', purpose: 'kỹ thuật sắp xếp dữ liệu theo trường như createdAt hoặc name' },

      { label: 'DTO', purpose: 'object định nghĩa hình dạng dữ liệu vào/ra để validate và tránh nhận field không mong muốn' },

      { label: 'Service layer', purpose: 'nơi xử lý nghiệp vụ chính, tách khỏi controller để code dễ test và bảo trì' },

      { label: 'Repository layer', purpose: 'lớp chịu trách nhiệm truy cập dữ liệu, giúp service không phụ thuộc trực tiếp vào database query' },

      { label: 'Database record', purpose: 'một dòng dữ liệu trong bảng database đại diện cho một thực thể' },

      { label: 'Primary key', purpose: 'khóa chính định danh duy nhất một bản ghi trong bảng' },

      { label: 'Foreign key', purpose: 'khóa ngoại dùng để liên kết dữ liệu giữa hai bảng' },

      { label: 'Soft delete', purpose: 'cách đánh dấu dữ liệu đã xóa bằng status/deletedAt thay vì xóa vật lý ngay' },

      { label: 'Health check', purpose: 'endpoint dùng để kiểm tra service còn sống và có thể phục vụ request' },

    ],

  },

  {

    title: 'HTTP & REST API Basics',

    slug: 'http-rest-api-basics',

    description: 'Bài kiểm tra intern về HTTP method, status code, REST resource, query string và API response.',

    technologyCode: 'NODEJS',

    topicCode: 'REST_API_DESIGN',

    durationMinutes: 20,

    concepts: [

      { label: 'GET method', purpose: 'HTTP method thường dùng để lấy dữ liệu và không nên làm thay đổi trạng thái server' },

      { label: 'POST method', purpose: 'HTTP method thường dùng để tạo mới tài nguyên hoặc thực hiện hành động không idempotent' },

      { label: 'PUT method', purpose: 'HTTP method thường dùng để thay thế toàn bộ tài nguyên theo id' },

      { label: 'PATCH method', purpose: 'HTTP method thường dùng để cập nhật một phần tài nguyên' },

      { label: 'DELETE method', purpose: 'HTTP method thường dùng để yêu cầu xóa tài nguyên' },

      { label: 'Query string', purpose: 'phần sau dấu hỏi trên URL dùng để truyền tham số như page, limit hoặc keyword' },

      { label: 'Path parameter', purpose: 'tham số nằm trong đường dẫn URL như /users/:id để xác định tài nguyên cụ thể' },

      { label: '201 Created', purpose: 'status code phù hợp khi tạo tài nguyên thành công' },

      { label: '400 Bad Request', purpose: 'status code phù hợp khi request sai dữ liệu hoặc không vượt qua validation' },

      { label: '401 Unauthorized', purpose: 'status code phù hợp khi request chưa xác thực hoặc token không hợp lệ' },

      { label: '403 Forbidden', purpose: 'status code phù hợp khi user đã xác thực nhưng không đủ quyền' },

      { label: '404 Not Found', purpose: 'status code phù hợp khi tài nguyên cần truy cập không tồn tại' },

      { label: '500 Internal Server Error', purpose: 'status code cho lỗi không mong muốn phía server' },

      { label: 'REST resource naming', purpose: 'cách đặt tên endpoint theo tài nguyên, thường dùng danh từ số nhiều như /users' },

      { label: 'Idempotent request', purpose: 'request gọi nhiều lần vẫn tạo ra cùng trạng thái cuối, ví dụ GET hoặc PUT đúng thiết kế' },

      { label: 'API versioning', purpose: 'cách quản lý thay đổi API qua phiên bản như /api/v1' },

      { label: 'Consistent response shape', purpose: 'cấu trúc response thống nhất giúp frontend dễ xử lý success, data, message và meta' },

      { label: 'Meta pagination', purpose: 'thông tin đi kèm danh sách như total, page, limit và itemCount' },

      { label: 'CORS', purpose: 'cơ chế trình duyệt kiểm soát domain nào được gọi API từ frontend' },

      { label: 'Rate limiting', purpose: 'giới hạn số request trong một khoảng thời gian để giảm spam và brute force' },

    ],

  },

  {

    title: 'TypeScript for Backend Interns',

    slug: 'typescript-backend-interns',

    description: 'Kiểm tra TypeScript căn bản dùng trong backend: type, interface, enum, async/await và error handling.',

    technologyCode: 'TYPESCRIPT',

    topicCode: 'ERROR_HANDLING_VALIDATION',

    durationMinutes: 20,

    concepts: [

      { label: 'Static typing', purpose: 'cơ chế kiểm tra kiểu dữ liệu trong quá trình phát triển giúp giảm lỗi runtime' },

      { label: 'Interface', purpose: 'cách mô tả shape của object trong TypeScript' },

      { label: 'Type alias', purpose: 'cách đặt tên cho kiểu dữ liệu, union hoặc object shape' },

      { label: 'Enum', purpose: 'cách định nghĩa tập giá trị cố định như role, status hoặc difficulty' },

      { label: 'Optional property', purpose: 'thuộc tính có thể không xuất hiện trong object, ký hiệu bằng dấu hỏi' },

      { label: 'Union type', purpose: 'kiểu cho phép một biến nhận một trong nhiều kiểu hoặc giá trị cụ thể' },

      { label: 'Generic type', purpose: 'cách viết type có thể tái sử dụng với nhiều kiểu dữ liệu khác nhau' },

      { label: 'Promise', purpose: 'đối tượng đại diện cho kết quả bất đồng bộ sẽ hoàn thành hoặc thất bại trong tương lai' },

      { label: 'async/await', purpose: 'cú pháp giúp viết code bất đồng bộ dễ đọc hơn Promise chaining' },

      { label: 'try/catch', purpose: 'cơ chế bắt lỗi khi xử lý code có thể phát sinh exception' },

      { label: 'unknown in catch', purpose: 'kiểu an toàn hơn any khi bắt lỗi vì cần kiểm tra trước khi dùng' },

      { label: 'Readonly', purpose: 'cách đánh dấu dữ liệu không nên bị thay đổi sau khi tạo' },

      { label: 'Array type', purpose: 'kiểu dữ liệu danh sách phần tử cùng kiểu hoặc theo cấu trúc xác định' },

      { label: 'Null vs undefined', purpose: 'null thường là giá trị rỗng chủ động, undefined thường là chưa được gán' },

      { label: 'Type narrowing', purpose: 'quá trình kiểm tra điều kiện để TypeScript hiểu kiểu cụ thể hơn' },

      { label: 'DTO type', purpose: 'kiểu dữ liệu mô tả request/response giữa frontend và backend' },

      { label: 'Return type', purpose: 'kiểu dữ liệu hàm trả về giúp contract rõ ràng hơn' },

      { label: 'Import/export', purpose: 'cơ chế chia sẻ class, function hoặc type giữa các file' },

      { label: 'tsconfig', purpose: 'file cấu hình compiler TypeScript cho project' },

      { label: 'No implicit any', purpose: 'cấu hình giúp tránh biến hoặc tham số bị suy luận là any không kiểm soát' },

    ],

  },

  {

    title: 'NestJS Intern Basics',

    slug: 'nestjs-intern-basics',

    description: 'Bài kiểm tra NestJS cho intern: module, controller, service, provider, pipe, guard và interceptor.',

    technologyCode: 'NESTJS',

    topicCode: 'DEPENDENCY_INJECTION',

    durationMinutes: 20,

    concepts: [

      { label: 'Module', purpose: 'khối tổ chức controller, provider và import/export dependency theo feature' },

      { label: 'Controller', purpose: 'lớp nhận HTTP request và gọi service để xử lý nghiệp vụ' },

      { label: 'Service', purpose: 'lớp chứa logic nghiệp vụ và có thể được inject vào controller' },

      { label: 'Provider', purpose: 'dependency được Nest container quản lý và có thể inject vào nơi khác' },

      { label: 'Dependency Injection', purpose: 'cơ chế để Nest tự cung cấp dependency thay vì class tự khởi tạo bằng new' },

      { label: '@Injectable', purpose: 'decorator đánh dấu class có thể được Nest quản lý như provider' },

      { label: 'Constructor injection', purpose: 'cách nhận dependency thông qua constructor của class' },

      { label: 'Pipe', purpose: 'thành phần dùng để transform hoặc validate dữ liệu trước khi vào handler' },

      { label: 'Guard', purpose: 'thành phần quyết định request có được phép đi tiếp vào handler hay không' },

      { label: 'Interceptor', purpose: 'thành phần can thiệp trước/sau handler để transform response, logging hoặc đo thời gian' },

      { label: 'Exception filter', purpose: 'thành phần chuẩn hóa cách trả lỗi cho client' },

      { label: 'DTO in NestJS', purpose: 'class mô tả request body/query và kết hợp validation decorator' },

      { label: 'ValidationPipe whitelist', purpose: 'tùy chọn loại bỏ field không khai báo trong DTO' },

      { label: 'Global prefix', purpose: 'prefix chung cho API như /api để tổ chức route rõ ràng' },

      { label: 'Middleware', purpose: 'logic chạy trước route handler, thường dùng logging hoặc parse request' },

      { label: 'Custom decorator', purpose: 'decorator tự tạo để lấy metadata hoặc dữ liệu request tiện hơn' },

      { label: 'Module export', purpose: 'cách cho module khác dùng provider của module hiện tại' },

      { label: 'Module import', purpose: 'cách khai báo module hiện tại cần provider từ module khác' },

      { label: 'Circular dependency', purpose: 'tình trạng hai module/service phụ thuộc lẫn nhau gây khó khởi tạo' },

      { label: 'Lifecycle hook', purpose: 'các hook như onModuleInit dùng để chạy logic khi module khởi tạo' },

    ],

  },

  {

    title: 'MySQL Database Fundamentals',

    slug: 'mysql-database-fundamentals',

    description: 'Kiểm tra MySQL nền tảng cho intern: table, key, relation, index, join và transaction.',

    technologyCode: 'MYSQL',

    topicCode: 'DATABASE_MODELING',

    durationMinutes: 20,

    concepts: [

      { label: 'Table', purpose: 'cấu trúc lưu dữ liệu theo hàng và cột trong database quan hệ' },

      { label: 'Column', purpose: 'trường dữ liệu trong bảng, có kiểu như INT, VARCHAR hoặc DATETIME' },

      { label: 'Row', purpose: 'một bản ghi cụ thể trong bảng database' },

      { label: 'Primary key', purpose: 'cột hoặc nhóm cột định danh duy nhất mỗi bản ghi' },

      { label: 'Foreign key', purpose: 'ràng buộc liên kết một bảng với bản ghi ở bảng khác' },

      { label: 'One-to-many relation', purpose: 'quan hệ một bản ghi cha có nhiều bản ghi con, ví dụ user có nhiều orders' },

      { label: 'Many-to-many relation', purpose: 'quan hệ nhiều-nhiều thường cần bảng trung gian' },

      { label: 'Unique constraint', purpose: 'ràng buộc đảm bảo giá trị không bị trùng trong một hoặc nhiều cột' },

      { label: 'Index', purpose: 'cấu trúc giúp tăng tốc tìm kiếm, lọc, join hoặc sort theo cột thường dùng' },

      { label: 'JOIN', purpose: 'cách kết hợp dữ liệu từ nhiều bảng dựa trên quan hệ' },

      { label: 'INNER JOIN', purpose: 'join chỉ trả các dòng có dữ liệu khớp ở cả hai bảng' },

      { label: 'LEFT JOIN', purpose: 'join trả toàn bộ dòng bên trái và dữ liệu bên phải nếu có khớp' },

      { label: 'Transaction', purpose: 'nhóm thao tác database cùng commit hoặc rollback để giữ nhất quán' },

      { label: 'Rollback', purpose: 'hủy các thay đổi trong transaction khi có lỗi' },

      { label: 'Normalization', purpose: 'thiết kế tách dữ liệu để giảm trùng lặp và tăng nhất quán' },

      { label: 'Denormalization', purpose: 'chủ động lưu trùng một phần dữ liệu để tối ưu đọc trong một số tình huống' },

      { label: 'Nullable column', purpose: 'cột cho phép giá trị NULL khi dữ liệu không bắt buộc' },

      { label: 'Timestamp column', purpose: 'cột lưu thời điểm tạo/cập nhật bản ghi như created_at, updated_at' },

      { label: 'Decimal type', purpose: 'kiểu phù hợp cho số cần độ chính xác như tiền hoặc điểm số' },

      { label: 'Cascade delete', purpose: 'hành vi tự xóa bản ghi con khi bản ghi cha bị xóa' },

    ],

  },

  {

    title: 'Prisma ORM Fundamentals',

    slug: 'prisma-orm-fundamentals',

    description: 'Bài kiểm tra Prisma cho intern: schema, model, relation, migration, client query và transaction.',

    technologyCode: 'PRISMA',

    topicCode: 'PRISMA_ORM',

    durationMinutes: 20,

    concepts: [

      { label: 'Prisma schema', purpose: 'file định nghĩa datasource, generator, model, enum và relation' },

      { label: 'Prisma model', purpose: 'định nghĩa bảng hoặc collection ở cấp schema Prisma' },

      { label: 'Prisma Client', purpose: 'client type-safe được generate để query database từ TypeScript' },

      { label: '@id', purpose: 'attribute đánh dấu field là primary key trong Prisma model' },

      { label: '@default', purpose: 'attribute đặt giá trị mặc định cho field khi tạo record' },

      { label: '@unique', purpose: 'attribute đảm bảo field có giá trị duy nhất' },

      { label: '@relation', purpose: 'attribute mô tả quan hệ giữa các model' },

      { label: '@@map', purpose: 'attribute ánh xạ tên model sang tên bảng thực tế trong database' },

      { label: 'findUnique', purpose: 'query tìm một record dựa trên unique field hoặc primary key' },

      { label: 'findMany', purpose: 'query lấy danh sách record theo filter, orderBy, skip/take' },

      { label: 'create', purpose: 'query tạo một record mới' },

      { label: 'update', purpose: 'query cập nhật record theo điều kiện unique' },

      { label: 'deleteMany', purpose: 'query xóa nhiều record theo điều kiện' },

      { label: 'upsert', purpose: 'query update nếu tồn tại, create nếu chưa tồn tại theo unique key' },

      { label: 'include', purpose: 'cách lấy kèm relation trong Prisma query' },

      { label: 'select', purpose: 'cách chỉ lấy những field cần thiết để tránh trả dư dữ liệu' },

      { label: 'Prisma migration', purpose: 'cách tạo lịch sử thay đổi schema database có thể version control' },

      { label: 'db push', purpose: 'cách đồng bộ schema nhanh với database, phù hợp prototype/dev' },

      { label: 'Prisma transaction', purpose: 'cách chạy nhiều query cùng commit hoặc rollback' },

      { label: 'Seed script', purpose: 'script tạo dữ liệu mẫu ban đầu cho database' },

    ],

  },

  {

    title: 'Authentication & Security Basics',

    slug: 'auth-security-basics',

    description: 'Kiểm tra intern về xác thực, phân quyền, password hashing, JWT và bảo vệ API.',

    technologyCode: 'NODEJS',

    topicCode: 'AUTHENTICATION_AUTHORIZATION',

    durationMinutes: 20,

    concepts: [

      { label: 'Authentication', purpose: 'quá trình xác minh user là ai, thường qua login/token' },

      { label: 'Authorization', purpose: 'quá trình kiểm tra user có quyền làm hành động hay không' },

      { label: 'Password hashing', purpose: 'việc băm mật khẩu bằng thuật toán như bcrypt trước khi lưu database' },

      { label: 'Salt', purpose: 'dữ liệu ngẫu nhiên thêm vào password hashing để giảm rủi ro rainbow table' },

      { label: 'JWT', purpose: 'token chứa claims và chữ ký để server xác minh tính hợp lệ' },

      { label: 'Access token', purpose: 'token sống ngắn dùng để gọi API protected' },

      { label: 'Refresh token', purpose: 'token sống dài hơn dùng để cấp lại access token khi cần' },

      { label: 'Role-based access control', purpose: 'phân quyền dựa trên role như ADMIN hoặc USER' },

      { label: 'Bearer token', purpose: 'cách gửi token trong header Authorization: Bearer <token>' },

      { label: 'HttpOnly cookie', purpose: 'cookie không đọc được bằng JavaScript, giúp giảm rủi ro XSS đánh cắp token' },

      { label: 'CSRF', purpose: 'tấn công lợi dụng trình duyệt gửi request kèm cookie đến website đã đăng nhập' },

      { label: 'XSS', purpose: 'tấn công chèn script độc hại vào trang để đánh cắp dữ liệu hoặc thao tác thay user' },

      { label: 'SQL injection', purpose: 'tấn công chèn SQL vào input nếu query không parameterized' },

      { label: 'Input validation', purpose: 'kiểm tra dữ liệu đầu vào để tránh dữ liệu sai hoặc nguy hiểm đi vào hệ thống' },

      { label: 'Rate limit login', purpose: 'giới hạn số lần login để giảm brute force' },

      { label: 'Least privilege', purpose: 'nguyên tắc cấp quyền tối thiểu cần thiết cho user/service' },

      { label: 'Secret management', purpose: 'quản lý secret qua env hoặc secret manager, không commit vào source' },

      { label: 'Token expiration', purpose: 'thời gian hết hạn token giúp giảm rủi ro khi token bị lộ' },

      { label: 'Logout with token', purpose: 'logout cần xóa token phía client và revoke/clear refresh token nếu có' },

      { label: 'Audit log', purpose: 'ghi lại hành động quan trọng để phục vụ kiểm tra bảo mật' },

    ],

  },

  {

    title: 'Validation, Error Handling & Clean API',

    slug: 'validation-error-clean-api',

    description: 'Bài kiểm tra intern về DTO validation, error response, exception filter và API contract sạch.',

    technologyCode: 'NESTJS',

    topicCode: 'ERROR_HANDLING_VALIDATION',

    durationMinutes: 20,

    concepts: [

      { label: 'DTO validation', purpose: 'kiểm tra request body/query theo rule trước khi xử lý nghiệp vụ' },

      { label: 'Required field', purpose: 'field bắt buộc phải có trong request' },

      { label: 'String length validation', purpose: 'rule giới hạn độ dài chuỗi để bảo vệ database và UX' },

      { label: 'Email validation', purpose: 'rule kiểm tra chuỗi có đúng định dạng email hay không' },

      { label: 'Whitelist validation', purpose: 'cơ chế bỏ field không khai báo trong DTO' },

      { label: 'Forbid non-whitelisted', purpose: 'cơ chế báo lỗi khi request gửi field không được phép' },

      { label: 'Exception', purpose: 'lỗi được ném ra khi request không thể xử lý bình thường' },

      { label: 'BadRequestException', purpose: 'exception phù hợp cho dữ liệu request không hợp lệ' },

      { label: 'NotFoundException', purpose: 'exception phù hợp khi tài nguyên không tồn tại' },

      { label: 'UnauthorizedException', purpose: 'exception phù hợp khi request chưa xác thực' },

      { label: 'ForbiddenException', purpose: 'exception phù hợp khi user không đủ quyền' },

      { label: 'ConflictException', purpose: 'exception phù hợp khi dữ liệu bị trùng unique như email đã tồn tại' },

      { label: 'Exception filter', purpose: 'nơi chuẩn hóa error response toàn hệ thống' },

      { label: 'Response interceptor', purpose: 'nơi chuẩn hóa response thành success, data, message' },

      { label: 'API contract', purpose: 'thỏa thuận request/response giữa backend và frontend' },

      { label: 'Error message field', purpose: 'field chỉ ra lỗi validation thuộc về trường nào' },

      { label: 'Safe error response', purpose: 'response lỗi không lộ stack trace hoặc secret cho client' },

      { label: 'Logging error', purpose: 'ghi log lỗi ở backend để debug mà không làm lộ thông tin ra client' },

      { label: 'Empty state response', purpose: 'response danh sách rỗng vẫn trả data là mảng và meta hợp lệ' },

      { label: 'Consistent naming', purpose: 'đặt tên field thống nhất như createdAt ở API dù DB dùng created_at' },

    ],

  },

  {

    title: 'Redis, Cache & Performance Basics',

    slug: 'redis-cache-performance-basics',

    description: 'Kiểm tra intern về cache, TTL, Redis, N+1 query, pagination và hiệu năng API cơ bản.',

    technologyCode: 'REDIS',

    topicCode: 'CACHING_PERFORMANCE',

    durationMinutes: 20,

    concepts: [

      { label: 'Cache', purpose: 'kỹ thuật lưu dữ liệu truy cập thường xuyên để giảm tải hệ thống gốc' },

      { label: 'Redis', purpose: 'in-memory data store thường dùng cho cache, session, rate limit hoặc queue' },

      { label: 'TTL', purpose: 'thời gian sống của cache key trước khi tự hết hạn' },

      { label: 'Cache invalidation', purpose: 'quy trình xóa/cập nhật cache khi dữ liệu gốc thay đổi' },

      { label: 'Cache key', purpose: 'tên key dùng để lưu và truy xuất dữ liệu cache' },

      { label: 'Stale data', purpose: 'dữ liệu cache đã cũ so với database' },

      { label: 'Cache aside', purpose: 'pattern app tự đọc cache, nếu miss thì query database rồi set cache' },

      { label: 'N+1 query', purpose: 'vấn đề query danh sách rồi query relation từng item gây nhiều query thừa' },

      { label: 'Pagination performance', purpose: 'dùng limit/take để tránh trả quá nhiều record một lần' },

      { label: 'Database index performance', purpose: 'index giúp query lọc/sắp xếp theo cột phổ biến nhanh hơn' },

      { label: 'Payload size', purpose: 'kích thước response quá lớn làm tăng thời gian truyền và parse dữ liệu' },

      { label: 'Select fields', purpose: 'chỉ lấy field cần thiết để giảm payload và query cost' },

      { label: 'Connection pooling', purpose: 'tái sử dụng kết nối database để giảm chi phí mở kết nối mới' },

      { label: 'Rate limit with Redis', purpose: 'dùng Redis đếm request trong thời gian ngắn để giới hạn traffic' },

      { label: 'Debounce request', purpose: 'giảm số lần gọi API liên tục từ client khi user nhập tìm kiếm' },

      { label: 'Background job', purpose: 'đưa việc nặng sang xử lý nền để request chính phản hồi nhanh hơn' },

      { label: 'Health monitoring', purpose: 'theo dõi tình trạng service để phát hiện lỗi hoặc chậm' },

      { label: 'Timeout', purpose: 'giới hạn thời gian chờ service khác để tránh request treo mãi' },

      { label: 'Retry policy', purpose: 'thử lại request thất bại có kiểm soát, tránh retry vô hạn' },

      { label: 'Slow query', purpose: 'query mất nhiều thời gian cần được log và tối ưu' },

    ],

  },

  {

    title: 'Docker & Deployment Basics',

    slug: 'docker-deployment-basics',

    description: 'Bài kiểm tra intern về Dockerfile, compose, env, volume, network, port mapping và triển khai backend.',

    technologyCode: 'DOCKER',

    topicCode: 'DOCKER_DEPLOYMENT',

    durationMinutes: 20,

    concepts: [

      { label: 'Docker image', purpose: 'template đóng gói application và dependency để tạo container' },

      { label: 'Docker container', purpose: 'instance đang chạy từ một image' },

      { label: 'Dockerfile', purpose: 'file mô tả các bước build image' },

      { label: 'FROM instruction', purpose: 'lệnh khai báo base image trong Dockerfile' },

      { label: 'WORKDIR instruction', purpose: 'lệnh đặt thư mục làm việc bên trong image/container' },

      { label: 'COPY instruction', purpose: 'lệnh copy file từ máy build vào image' },

      { label: 'RUN instruction', purpose: 'lệnh chạy khi build image, ví dụ npm install hoặc build' },

      { label: 'CMD instruction', purpose: 'lệnh mặc định chạy khi container start' },

      { label: 'Port mapping', purpose: 'cơ chế map port host sang port container như 3000:3000' },

      { label: 'Docker volume', purpose: 'cơ chế lưu dữ liệu bền vững ngoài lifecycle container' },

      { label: 'Docker network', purpose: 'mạng nội bộ để các container giao tiếp bằng service name' },

      { label: 'docker-compose', purpose: 'công cụ khai báo và chạy nhiều service cùng nhau' },

      { label: 'depends_on', purpose: 'cấu hình thứ tự start service trong compose, không đảm bảo app đã sẵn sàng hoàn toàn' },

      { label: 'Environment in compose', purpose: 'cách truyền env vào container qua docker-compose' },

      { label: 'Secret in Docker', purpose: 'secret không nên hardcode trong Dockerfile hoặc commit vào repository' },

      { label: 'Multi-stage build', purpose: 'tách build stage và runtime stage để giảm kích thước image' },

      { label: 'Container logs', purpose: 'log stdout/stderr của container dùng để debug khi chạy' },

      { label: 'Healthcheck', purpose: 'cấu hình kiểm tra container/service có hoạt động bình thường không' },

      { label: 'Restart policy', purpose: 'cấu hình container tự restart khi lỗi hoặc khi daemon restart' },

      { label: 'Bind mount', purpose: 'cách mount thư mục host vào container, thường dùng trong dev' },

    ],

  },

];


const technologySeeds = [
  {
    name: "Node.js",
    slug: "nodejs",
    code: "NODEJS",
    description: "Runtime JavaScript dùng để xây dựng backend service, REST API và hệ thống realtime.",
  },
  {
    name: "TypeScript",
    slug: "typescript",
    code: "TYPESCRIPT",
    description: "Ngôn ngữ mở rộng JavaScript với static typing, giúp backend codebase dễ maintain hơn.",
  },
  {
    name: "NestJS",
    slug: "nestjs",
    code: "NESTJS",
    description: "Framework Node.js theo kiến trúc module, provider, dependency injection, guard và interceptor.",
  },
  {
    name: "Prisma",
    slug: "prisma",
    code: "PRISMA",
    description: "ORM TypeScript dùng để thao tác database, migration, relation và transaction.",
  },
  {
    name: "MySQL",
    slug: "mysql",
    code: "MYSQL",
    description: "Hệ quản trị cơ sở dữ liệu quan hệ phổ biến trong các hệ thống backend.",
  },
  {
    name: "Redis",
    slug: "redis",
    code: "REDIS",
    description: "In-memory data store dùng cho cache, rate limit, session và queue.",
  },
  {
    name: "Docker",
    slug: "docker",
    code: "DOCKER",
    description: "Công cụ đóng gói và chạy ứng dụng bằng container để triển khai nhất quán.",
  },
];

const topicSeeds = [
  {
    name: "REST API Design",
    code: "REST_API_DESIGN",
    description: "Thiết kế endpoint, HTTP method, status code, pagination, filtering và error response.",
  },
  {
    name: "Dependency Injection",
    code: "DEPENDENCY_INJECTION",
    description: "Cơ chế inject provider/service giúp tách phụ thuộc và tổ chức code trong NestJS.",
  },
  {
    name: "Authentication & Authorization",
    code: "AUTHENTICATION_AUTHORIZATION",
    description: "Xác thực, phân quyền, JWT, refresh token, guard và bảo vệ endpoint.",
  },
  {
    name: "Database Modeling",
    code: "DATABASE_MODELING",
    description: "Thiết kế bảng, quan hệ, khóa ngoại, index, unique constraint và migration.",
  },
  {
    name: "Prisma ORM",
    code: "PRISMA_ORM",
    description: "Thao tác database bằng Prisma Client, relation query, transaction và migration.",
  },
  {
    name: "Caching & Performance",
    code: "CACHING_PERFORMANCE",
    description: "Cache dữ liệu, invalidation, Redis, tối ưu query và giảm tải database.",
  },
  {
    name: "Error Handling & Validation",
    code: "ERROR_HANDLING_VALIDATION",
    description: "Validation DTO, exception filter, error response và xử lý lỗi nhất quán.",
  },
  {
    name: "Docker Deployment",
    code: "DOCKER_DEPLOYMENT",
    description: "Đóng gói backend bằng Docker, compose, env, volume, network và health check.",
  },
];

const positionSeeds = [
  {
    name: "Backend Developer",
    code: "BACKEND_DEVELOPER",
    description: "Vị trí phát triển API, database, authentication, cache và triển khai backend service.",
  },
];

const levelSeeds = [
  {
    name: "Intern",
    code: "INTERN",
    description: "Dành cho ứng viên mới học backend, cần nắm nền tảng HTTP, JavaScript, database cơ bản.",
    display_order: 1,
  },
];

async function main() {
  const adminRole = await upsertAdminRole();
  const admin = await upsertSeedAdmin(adminRole.id);

  await seedPositions();
  await seedLevels();

  const technologies = await seedTechnologies();
  const topics = await seedTopics();

  for (const testSeed of testSeeds) {
    await seedMockTestWithQuestions({
      testSeed,
      createdBy: admin.id,
      technologyId: technologies[testSeed.technologyCode],
      topicId: topics[testSeed.topicCode],
    });
  }

  console.log(`Seeded ${testSeeds.length} intern mock tests.`);
  console.log(`Seeded ${testSeeds.reduce((total, test) => total + test.concepts.length, 0)} MCQ questions.`);
}

async function upsertAdminRole() {
  const role = await prisma.roles.findFirst({
    where: {
      name: {
        in: ["ADMIN", "Admin", "admin"],
      },
    },
  });

  if (role) {
    return role;
  }

  return prisma.roles.create({
    data: {
      name: "ADMIN",
      description: "Quản trị viên hệ thống.",
    },
  });
}

async function upsertSeedAdmin(roleId: number) {
  const existing = await prisma.users.findUnique({
    where: {
      email: "seed-admin@ai-mock.local",
    },
  });

  if (existing) {
    return existing;
  }

  return prisma.users.create({
    data: {
      role_id: roleId,
      email: "seed-admin@ai-mock.local",
      password_hash: "seed-admin-password-hash",
      first_name: "Seed",
      last_name: "Admin",
      phone_number: "0000000000",
      avatar_url: null,
      headline: "System seed account for backend intern mock tests.",
      current_position: "System Administrator",
      years_of_experience: 5,
      linkedin_url: null,
      github_url: null,
      portfolio_url: null,
      is_verified: true,
    },
  });
}

async function seedPositions() {
  for (const position of positionSeeds) {
    await prisma.interview_positions.upsert({
      where: {
        code: position.code,
      },
      update: {
        name: position.name,
        description: position.description,
        is_active: true,
        updated_at: new Date(),
      },
      create: {
        ...position,
        is_active: true,
      },
    });
  }
}

async function seedLevels() {
  for (const level of levelSeeds) {
    await prisma.interview_levels.upsert({
      where: {
        code: level.code,
      },
      update: {
        name: level.name,
        description: level.description,
        display_order: level.display_order,
        is_active: true,
        updated_at: new Date(),
      },
      create: {
        ...level,
        is_active: true,
      },
    });
  }
}

async function seedTechnologies() {
  const technologyMap: Record<string, number> = {};

  for (const technology of technologySeeds) {
    const saved = await prisma.interview_technologies.upsert({
      where: {
        code: technology.code,
      },
      update: {
        name: technology.name,
        slug: technology.slug,
        description: technology.description,
        is_active: true,
        updated_at: new Date(),
      },
      create: {
        ...technology,
        is_active: true,
      },
    });

    technologyMap[technology.code] = saved.id;
  }

  return technologyMap;
}

async function seedTopics() {
  const topicMap: Record<string, number> = {};

  for (const topic of topicSeeds) {
    const saved = await prisma.interview_topics.upsert({
      where: {
        code: topic.code,
      },
      update: {
        name: topic.name,
        description: topic.description,
        is_active: true,
        updated_at: new Date(),
      },
      create: {
        ...topic,
        is_active: true,
      },
    });

    topicMap[topic.code] = saved.id;
  }

  return topicMap;
}

async function seedMockTestWithQuestions(input: {
  testSeed: TestSeed;
  createdBy: number;
  technologyId: number | undefined;
  topicId: number | undefined;
}) {
  if (!input.technologyId) {
    throw new Error(`Missing technology for test: ${input.testSeed.title}`);
  }

  if (!input.topicId) {
    throw new Error(`Missing topic for test: ${input.testSeed.title}`);
  }

  const mockTest = await prisma.mockTest.upsert({
    where: {
      slug: input.testSeed.slug,
    },
    update: {
      title: input.testSeed.title,
      description: input.testSeed.description,
      cover_image_url: buildCoverImageUrl(input.testSeed.slug),
      duration_minutes: input.testSeed.durationMinutes,
      total_questions: input.testSeed.concepts.length,
      status: "PUBLISHED",
      updated_at: new Date(),
    },
    create: {
      title: input.testSeed.title,
      slug: input.testSeed.slug,
      description: input.testSeed.description,
      cover_image_url: buildCoverImageUrl(input.testSeed.slug),
      duration_minutes: input.testSeed.durationMinutes,
      total_questions: input.testSeed.concepts.length,
      status: "PUBLISHED",
      created_by: input.createdBy,
    },
  });

  const questionIds: number[] = [];

  for (const [index, concept] of input.testSeed.concepts.entries()) {
    const question = await upsertQuestion({
      testSlug: input.testSeed.slug,
      testTitle: input.testSeed.title,
      concept,
      questionNumber: index + 1,
      technologyId: input.technologyId,
      topicId: input.topicId,
      createdBy: input.createdBy,
    });

    questionIds.push(question.id);
  }

  await prisma.mockTestQuestion.deleteMany({
    where: {
      mock_test_id: mockTest.id,
    },
  });

  await prisma.mockTestQuestion.createMany({
    data: questionIds.map((questionId, index) => ({
      mock_test_id: mockTest.id,
      question_bank_id: questionId,
      display_order: index + 1,
    })),
  });

  await prisma.mockTest.update({
    where: {
      id: mockTest.id,
    },
    data: {
      total_questions: questionIds.length,
      updated_at: new Date(),
    },
  });
}

async function upsertQuestion(input: {
  testSlug: string;
  testTitle: string;
  concept: ConceptSeed;
  questionNumber: number;
  technologyId: number;
  topicId: number;
  createdBy: number;
}) {
  const title = `${input.testTitle} - Câu ${input.questionNumber}: ${input.concept.label}`;
  const content = `Trong backend dành cho Intern, "${input.concept.label}" được hiểu đúng nhất là gì?`;
  const expectedAnswer = `${input.concept.label}: ${input.concept.purpose}. Đây là kiến thức nền tảng cần nắm trước khi đi phỏng vấn backend intern.`;

  const options = buildOptions(input.concept);

  const existing = await prisma.interview_question_banks.findFirst({
    where: {
      title,
    },
  });

  if (existing) {
    await prisma.$transaction([
      prisma.interview_question_bank_options.deleteMany({
        where: {
          question_bank_id: existing.id,
        },
      }),
      prisma.interview_question_banks.update({
        where: {
          id: existing.id,
        },
        data: {
          topic_id: input.topicId,
          technology_id: input.technologyId,
          content,
          question_type: "MCQ",
          difficulty: getDifficulty(input.questionNumber),
          expected_answer: expectedAnswer,
          created_by: input.createdBy,
          updated_at: new Date(),
        },
      }),
      prisma.interview_question_bank_options.createMany({
        data: options.map((option, index) => ({
          question_bank_id: existing.id,
          content: option.content,
          is_correct: option.isCorrect,
          display_order: index + 1,
        })),
      }),
    ]);

    return prisma.interview_question_banks.findUniqueOrThrow({
      where: {
        id: existing.id,
      },
    });
  }

  return prisma.interview_question_banks.create({
    data: {
      topic_id: input.topicId,
      technology_id: input.technologyId,
      title,
      content,
      question_type: "MCQ",
      difficulty: getDifficulty(input.questionNumber),
      expected_answer: expectedAnswer,
      created_by: input.createdBy,
      interview_question_bank_options: {
        create: options.map((option, index) => ({
          content: option.content,
          is_correct: option.isCorrect,
          display_order: index + 1,
        })),
      },
    },
  });
}

function buildOptions(concept: ConceptSeed) {
  return [
    {
      content: concept.purpose.charAt(0).toUpperCase() + concept.purpose.slice(1) + ".",
      isCorrect: true,
    },
    {
      content: "Là thành phần chỉ dùng cho giao diện frontend, không liên quan đến backend.",
      isCorrect: false,
    },
    {
      content: "Là cách thay thế hoàn toàn database bằng biến lưu tạm trong bộ nhớ.",
      isCorrect: false,
    },
    {
      content: "Là cơ chế tự động sửa mọi lỗi logic mà developer không cần xử lý.",
      isCorrect: false,
    },
  ];
}

function getDifficulty(questionNumber: number) {
  if (questionNumber <= 10) {
    return "EASY";
  }

  if (questionNumber <= 17) {
    return "MEDIUM";
  }

  return "HARD";
}

function buildCoverImageUrl(slug: string) {
  return `https://source.unsplash.com/1200x720/?backend,developer,${normalizeSlug(slug)}`;
}

main()
  .catch((error) => {
    console.error("Seed backend intern mock tests failed.");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
