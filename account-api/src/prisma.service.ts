import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Timestamp } from './stubs/google/protobuf/timestamp';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super();
    this.$use(async (params, next) => {
      const result = await next(params);
      if (params.model !== 'Account') return result;

      const mapToProto = (result) => {
        result.id = result.id + '';
        if (result.hasOwnProperty('user_id')) {
          result.userId = result.user_id + '';
        }
        result.createdAt = this.toTimestamp(result.createdAt);
        result.updatedAt = this.toTimestamp(result.updatedAt);

        return result;
      };
      if (!result) {
        return result;
      }
      if (result?.length > -1) {
        return result.map(mapToProto);
      }
      return mapToProto(result);
    });
  }
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  private toTimestamp(date: Date): Timestamp {
    const timeMS = date.getTime();
    return {
      seconds: timeMS / 1000,
      nanos: (timeMS % 1000) * 1e6,
    };
  }
}
