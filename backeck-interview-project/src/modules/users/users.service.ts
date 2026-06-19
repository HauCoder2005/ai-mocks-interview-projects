import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { AppRole } from '../auth/enums/app-role.enum';

export interface UserRecordWithRole {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_verified: boolean;
  roles?: {
    name?: string | null;
  } | null;
}

export interface UserCredentialsRecordWithRole extends UserRecordWithRole {
  password_hash: string;
}

export interface CreateUserInput {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  roleName: AppRole;
  phoneNumber?: string;
  avatarUrl?: string;
  headline?: string;
  currentPosition?: string;
  isVerified?: boolean;
}

/**
 * Service quản lý dữ liệu người dùng và vai trò thông qua Prisma.
 *
 * Service này là biên truy cập dữ liệu cho user, giúp các module nghiệp vụ như
 * AuthModule không thao tác trực tiếp với Prisma hoặc schema database.
 */
@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Tìm người dùng theo email mà không trả về hash mật khẩu.
   *
   * @param email Email đã được chuẩn hóa.
   * @returns User an toàn kèm vai trò hoặc null nếu không tồn tại.
   * @throws InternalServerErrorException Khi truy vấn database thất bại.
   */
  async findByEmail(email: string): Promise<UserRecordWithRole | null> {
    return this.executeDatabaseOperation('tìm người dùng theo email', () =>
      this.prisma.users.findUnique({
        where: {
          email,
        },
        select: this.safeUserSelect,
      }),
    );
  }

  /**
   * Tìm người dùng theo id mà không trả về hash mật khẩu.
   *
   * @param id Id nội bộ của người dùng.
   * @returns User an toàn kèm vai trò hoặc null nếu không tồn tại.
   * @throws InternalServerErrorException Khi truy vấn database thất bại.
   */
  async findById(id: number): Promise<UserRecordWithRole | null> {
    return this.executeDatabaseOperation('tìm người dùng theo id', () =>
      this.prisma.users.findUnique({
        where: {
          id,
        },
        select: this.safeUserSelect,
      }),
    );
  }

  /**
   * Tìm người dùng kèm hash mật khẩu để phục vụ bước xác thực local.
   *
   * @param email Email đã được chuẩn hóa.
   * @returns User kèm hash mật khẩu hoặc null nếu không tồn tại.
   * @throws InternalServerErrorException Khi truy vấn database thất bại.
   */
  async findCredentialsByEmail(
    email: string,
  ): Promise<UserCredentialsRecordWithRole | null> {
    return this.executeDatabaseOperation(
      'tìm thông tin đăng nhập theo email',
      () =>
        this.prisma.users.findUnique({
          where: {
            email,
          },
          select: {
            ...this.safeUserSelect,
            password_hash: true,
          },
        }),
    );
  }

  /**
   * Tạo người dùng mới và tự bảo đảm vai trò mặc định tồn tại.
   *
   * @param input Dữ liệu người dùng đã được xử lý bởi tầng nghiệp vụ.
   * @returns User vừa tạo dưới dạng an toàn, không bao gồm hash mật khẩu.
   * @throws InternalServerErrorException Khi tạo user hoặc role thất bại.
   */
  async create(input: CreateUserInput): Promise<UserRecordWithRole> {
    const userRole = await this.ensureRole(input.roleName);

    return this.executeDatabaseOperation('tạo người dùng', () =>
      this.prisma.users.create({
        data: {
          email: input.email,
          password_hash: input.passwordHash,
          first_name: input.firstName,
          last_name: input.lastName,
          phone_number: input.phoneNumber ?? '',
          avatar_url: input.avatarUrl,
          headline: input.headline ?? '',
          current_position: input.currentPosition ?? '',
          is_verified: input.isVerified ?? false,
          roles: {
            connect: {
              id: userRole.id,
            },
          },
        },
        select: this.safeUserSelect,
      }),
    );
  }

  /**
   * Cập nhật trạng thái xác minh email của người dùng.
   *
   * @param userId Id người dùng cần cập nhật.
   * @param isVerified Trạng thái xác minh mới.
   * @returns User sau khi cập nhật dưới dạng an toàn.
   * @throws InternalServerErrorException Khi cập nhật database thất bại.
   */
  async updateVerificationStatus(
    userId: number,
    isVerified: boolean,
  ): Promise<UserRecordWithRole> {
    return this.executeDatabaseOperation('cập nhật trạng thái xác minh', () =>
      this.prisma.users.update({
        where: {
          id: userId,
        },
        data: {
          is_verified: isVerified,
          updated_at: new Date(),
        },
        select: this.safeUserSelect,
      }),
    );
  }

  /**
   * Xác minh user đã đăng ký trước đó khi họ đăng nhập bằng Google.
   *
   * @param id Id user local cần đồng bộ với Google.
   * @returns User sau khi được xác minh dưới dạng an toàn.
   * @throws InternalServerErrorException Khi cập nhật database thất bại.
   */
  async verifyGoogleUser(id: number): Promise<UserRecordWithRole> {
    const passwordHash = await bcrypt.hash(randomUUID(), this.bcryptSaltRounds);

    return this.executeDatabaseOperation('xác minh người dùng Google', () =>
      this.prisma.users.update({
        where: {
          id,
        },
        data: {
          password_hash: passwordHash,
          is_verified: true,
          updated_at: new Date(),
        },
        select: this.safeUserSelect,
      }),
    );
  }

  /**
   * Ghi nhận thời điểm đăng nhập gần nhất của người dùng.
   *
   * @param userId Id người dùng vừa đăng nhập thành công.
   * @throws InternalServerErrorException Khi cập nhật database thất bại.
   */
  async touchLastLogin(userId: number): Promise<void> {
    await this.executeDatabaseOperation('cập nhật thời điểm đăng nhập', () =>
      this.prisma.users.update({
        where: {
          id: userId,
        },
        data: {
          last_login_at: new Date(),
          updated_at: new Date(),
        },
      }),
    );
  }

  /**
   * Bảo đảm vai trò tồn tại trước khi gán cho user.
   *
   * @param role Vai trò ứng dụng cần tạo hoặc đọc.
   * @returns Id vai trò trong database.
   * @throws InternalServerErrorException Khi thao tác role thất bại.
   */
  async ensureRole(role: AppRole): Promise<{ id: number }> {
    return this.executeDatabaseOperation('bảo đảm vai trò người dùng', () =>
      this.prisma.roles.upsert({
        where: {
          name: role,
        },
        update: {},
        create: {
          name: role,
        },
        select: {
          id: true,
        },
      }),
    );
  }

  private get safeUserSelect() {
    return {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      is_verified: true,
      roles: {
        select: {
          name: true,
        },
      },
    } as const;
  }

  private get bcryptSaltRounds(): number {
    return this.configService.getOrThrow<number>('auth.bcryptSaltRounds');
  }

  private async executeDatabaseOperation<T>(
    action: string,
    operation: () => Promise<T>,
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      this.logger.error(
        `Không thể ${action}.`,
        error instanceof Error ? error.stack : String(error),
      );
      throw new InternalServerErrorException(
        `Không thể ${action}. Vui lòng thử lại sau.`,
      );
    }
  }
}
