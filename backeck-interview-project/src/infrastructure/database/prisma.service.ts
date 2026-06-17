
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from '../../../generated/prisma/client';
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name); 
  constructor() {
    const adapter = new PrismaMariaDb(process.env.DATABASE_URL as string);
    super({ adapter });
  }

  async onModuleInit(): Promise<void> {
      try {
        await this.$connect();
        this.logger.log('Database connection established successfully.');
      } catch(error) {
        const detail_error = error instanceof Error ? error.message : String(error);
        this.logger.error(`Database connection failed: ${detail_error}`);
      }
  }
}
