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

  async findById(id: number): Promise<UserModel | null> {
    const user = (await this.selectOne({
      id,
    })) as users | null;

    return user ? UserMapper.toModel(user) : null;
  }

  async findByEmail(email: string): Promise<UserModel | null> {
    const user = (await this.selectOne({
      email,
    })) as users | null;

    return user ? UserMapper.toModel(user) : null;
  }

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

  async createUser(data: Prisma.usersUncheckedCreateInput): Promise<UserModel> {
    const user = (await this.insertOne(data)) as users;

    return UserMapper.toModel(user);
  }

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
