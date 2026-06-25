import { Injectable } from '@nestjs/common';
import { Prisma, users } from 'generated/prisma/client';
import { PrismaService } from 'src/infrastructure/persistence/prisma/prisma.service';
import { AbstractPrismaCrudService } from 'src/shared/abstracts/crud/abstract-prisma-crud.service';
import { UserMapper } from '../mappers/users.mapper';
import { UserModel } from '../models/users.model';

@Injectable()
export class UsersRepositories extends AbstractPrismaCrudService<any> {
  constructor(private readonly prismaService: PrismaService) {
    super(prismaService.users);
  }

  /*
   * Method bắt buộc do AbstractPrismaCrudService yêu cầu.
   * Dùng để lấy nhiều user từ Prisma model.
   */
  selectMany(query?: any): Promise<any[]> {
    return this.executeSelectMany(query);
  }

  /*
   * Method bắt buộc do AbstractPrismaCrudService yêu cầu.
   * Dùng để lấy một user theo unique field như id hoặc email.
   */
  selectOne(where: any): Promise<any | null> {
    return this.executeSelectOne(where);
  }

  /*
   * Method bắt buộc do AbstractPrismaCrudService yêu cầu.
   * Dùng để tạo mới một user.
   */
  insertOne(data: any): Promise<any> {
    return this.executeInsertOne(data);
  }

  /*
   * Method bắt buộc do AbstractPrismaCrudService yêu cầu.
   * Dùng để cập nhật user theo unique field.
   */
  updateOne(where: any, data: any): Promise<any> {
    return this.executeUpdateOne(where, data);
  }

  /*
   * Method bắt buộc do AbstractPrismaCrudService yêu cầu.
   * Dùng để xóa user theo unique field.
   */
  deleteOne(where: any): Promise<any> {
    return this.executeDeleteOne(where);
  }

  /*
   * Tìm user theo id.
   * Dùng khi cần lấy thông tin user bằng khóa chính.
   */
  async findById(id: number): Promise<UserModel | null> {
    const user = (await this.selectOne({
      id,
    })) as users | null;

    return user ? UserMapper.toModel(user) : null;
  }

  /*
   * Tìm user theo email.
   * Dùng trong login, register, forgot password hoặc kiểm tra trùng email.
   */
  async findByEmail(email: string): Promise<UserModel | null> {
    const user = (await this.selectOne({
      email,
    })) as users | null;

    return user ? UserMapper.toModel(user) : null;
  }

  /*
   * Tìm role id theo tên role.
   * Dùng khi tạo user mới để gán role mặc định.
   */
  async findRoleIdByName(name: string): Promise<number | null> {
    const role = await this.prismaService.roles.findUnique({
      where: {
        name,
      },
      select: {
        id: true,
      },
    });

    return role?.id ?? null;
  }

  /*
   * Tạo user mới.
   * Repository nhận data theo Prisma input rồi map record trả về sang UserModel.
   */
  async createUser(data: Prisma.usersUncheckedCreateInput): Promise<UserModel> {
    const user = (await this.insertOne(data)) as users;

    return UserMapper.toModel(user);
  }

  /*
   * Cập nhật thời gian đăng nhập gần nhất của user.
   * Dùng sau khi user login thành công.
   */
  async updateLastLoginAt(id: number, lastLoginAt: Date): Promise<UserModel> {
    const user = (await this.updateOne(
      {
        id,
      },
      {
        last_login_at: lastLoginAt,
        updated_at: new Date(),
      },
    )) as users;

    return UserMapper.toModel(user);
  }

  /*
   * Đánh dấu user đã xác thực.
   * Dùng sau khi user verify email hoặc OTP thành công.
   */
  async markAsVerified(id: number): Promise<UserModel> {
    const user = (await this.updateOne(
      {
        id,
      },
      {
        is_verified: true,
        updated_at: new Date(),
      },
    )) as users;

    return UserMapper.toModel(user);
  }

  /*
   * Cập nhật password hash.
   * Dùng trong chức năng đổi mật khẩu hoặc reset mật khẩu.
   */
  async updatePasswordHash(
    id: number,
    passwordHash: string,
  ): Promise<UserModel> {
    const user = (await this.updateOne(
      {
        id,
      },
      {
        password_hash: passwordHash,
        updated_at: new Date(),
      },
    )) as users;

    return UserMapper.toModel(user);
  }
}
