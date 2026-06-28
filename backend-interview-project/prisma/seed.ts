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

  const positions = [
    ['Backend Developer', 'BACKEND_DEVELOPER'],
    ['Frontend Developer', 'FRONTEND_DEVELOPER'],
    ['Fullstack Developer', 'FULLSTACK_DEVELOPER'],
  ];
  for (const [name, code] of positions) {
    await prisma.interview_positions.upsert({
      where: {
        code,
      },
      update: {
        name,
        is_active: true,
        updated_at: new Date(),
      },
      create: {
        name,
        code,
        is_active: true,
      },
    });
  }

  const levels = [
    ['Intern', 'INTERN', 1],
    ['Fresher', 'FRESHER', 2],
    ['Junior', 'JUNIOR', 3],
    ['Middle', 'MIDDLE', 4],
    ['Senior', 'SENIOR', 5],
  ] as const;
  for (const [name, code, displayOrder] of levels) {
    await prisma.interview_levels.upsert({
      where: {
        code,
      },
      update: {
        name,
        display_order: displayOrder,
        is_active: true,
        updated_at: new Date(),
      },
      create: {
        name,
        code,
        display_order: displayOrder,
        is_active: true,
      },
    });
  }

  const technologies = [
    ['Node.js', 'NODEJS'],
    ['NestJS', 'NESTJS'],
    ['React', 'REACT'],
    ['Next.js', 'NEXTJS'],
    ['MySQL', 'MYSQL'],
    ['Redis', 'REDIS'],
  ];
  for (const [name, code] of technologies) {
    await prisma.interview_technologies.upsert({
      where: {
        code,
      },
      update: {
        name,
        slug: code,
        is_active: true,
        updated_at: new Date(),
      },
      create: {
        name,
        code,
        slug: code,
        is_active: true,
      },
    });
  }

  const focusTopics = [
    ['REST API', 'REST_API'],
    ['Authentication', 'AUTHENTICATION'],
    ['Database Design', 'DATABASE_DESIGN'],
    ['Clean Architecture', 'CLEAN_ARCHITECTURE'],
    ['Performance', 'PERFORMANCE'],
    ['Testing', 'TESTING'],
  ];
  for (const [name, code] of focusTopics) {
    await prisma.interview_topics.upsert({
      where: {
        code,
      },
      update: {
        name,
        is_active: true,
        updated_at: new Date(),
      },
      create: {
        name,
        code,
        is_active: true,
      },
    });
  }

  await prisma.$disconnect();
}

void main();
