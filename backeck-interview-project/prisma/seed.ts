import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../generated/prisma/client';

/**
 * Seed role mặc định để users.role_id có FK hợp lệ khi register.
 * USER phải có id = 1 vì backend gán roleId = 1 cho tài khoản thường.
 */
async function main(): Promise<void> {
  const adapter = new PrismaMariaDb({
    host: process.env.DATABASE_HOST ?? 'localhost',
    port: Number(process.env.DATABASE_PORT ?? 3306),
    user: process.env.DATABASE_USER ?? 'root',
    password: process.env.DATABASE_PASSWORD ?? '',
    database: process.env.DATABASE_NAME ?? 'ai_mock_interview',
  });
  const prisma = new PrismaClient({
    adapter,
  });

  await prisma.roles.upsert({
    where: {
      id: 1,
    },
    update: {
      name: 'USER',
      description: 'Default platform user',
      updated_at: new Date(),
    },
    create: {
      id: 1,
      name: 'USER',
      description: 'Default platform user',
    },
  });

  await prisma.roles.upsert({
    where: {
      id: 2,
    },
    update: {
      name: 'ADMIN',
      description: 'System administrator',
      updated_at: new Date(),
    },
    create: {
      id: 2,
      name: 'ADMIN',
      description: 'System administrator',
    },
  });

  await prisma.$disconnect();
}

void main();
