import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient, Type } from '@prisma/client';
import { Timestamp } from './stubs/google/protobuf/timestamp';
import { TransactionType } from './stubs/transaction/v1alpha/transaction';
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super();
    this.$use(async (params, next) => {
      const result = await next(params);
      if (params.model !== 'Transaction') return result;

      const mapToProto = (result) => {
        result.id = result.id + '';
        if (result.hasOwnProperty('user_id')) {
          result.userId = result.user_id + '';
        }
        if (result.hasOwnProperty('account_id')) {
          result.accountId = result.account_id + '';
        }
        if (result.hasOwnProperty('amount_before')) {
          result.amountBefore = result.amount_before + '';
        }
        if (result.hasOwnProperty('amount_current')) {
          result.amountCurrent = result.amount_current + '';
        }
        result.createdAt = this.toTimestamp(result.createdAt);
        result.updatedAt = this.toTimestamp(result.updatedAt);

        switch (result.type) {
          case Type.CREDIT:
            result.type = TransactionType.CREDIT;
            break;
          case Type.DEBIT:
            result.type = TransactionType.DEBIT;
            break;
        }
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
