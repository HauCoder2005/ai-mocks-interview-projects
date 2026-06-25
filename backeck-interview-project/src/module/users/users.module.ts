import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/infrastructure/persistence/prisma/prisma.module';

import { UsersRepositories } from './repositories/users.repositories';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepositories],
  exports: [UsersRepositories],
})
export class UsersModule {}
