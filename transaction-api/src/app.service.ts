import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { Transaction, Prisma, Type } from '@prisma/client';
import { PrismaService } from './prisma.service';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Metadata, status } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';

import {
  USER_SERVICE_NAME,
  USER_V1ALPHA_PACKAGE_NAME,
  UserServiceClient,
} from './stubs/user/v1alpha/service';
import {
  ACCOUNT_SERVICE_NAME,
  ACCOUNT_V1ALPHA_PACKAGE_NAME,
  AccountServiceClient,
  GetAccountRequest,
  UpdateAccountRequest,
  Account,
} from './stubs/account/v1alpha/account';
import { FindRequest, FindResponse, User } from './stubs/user/v1alpha/message';

@Injectable()
export class AppService implements OnModuleInit {
  private userService: UserServiceClient;
  private accountService: AccountServiceClient;

  constructor(
    private prisma: PrismaService,
    @Inject(USER_V1ALPHA_PACKAGE_NAME) private client: ClientGrpc,
    @Inject(ACCOUNT_V1ALPHA_PACKAGE_NAME) private account: ClientGrpc,
    private jwtService: JwtService,
  ) {}

  onModuleInit() {
    this.userService =
      this.client.getService<UserServiceClient>(USER_SERVICE_NAME);
    this.accountService =
      this.account.getService<AccountServiceClient>(ACCOUNT_SERVICE_NAME);
  }

  async createTransaction(
    data: Prisma.TransactionCreateInput,
  ): Promise<Transaction> {
    const currentUser = await this.findUser(
      {
        id: String(data.user_id),
      },
      { Authorization: `Bearer ${this.jwtService.sign({ internal: true })}` },
    );
    if (typeof currentUser === 'undefined') {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: 'User not found',
      });
    } else {
      const token = {
        Authorization: `Bearer ${this.jwtService.sign({ internal: true })}`,
      };
      const currentAccount = (await this.findAccount(
        {
          id: +data.account_id,
        },
        token,
      )) as any;
      data.type = Number(data.type) === 0 ? Type.DEBIT : Type.CREDIT;
      // ajouter de l'argent
      if (data.type === Type.CREDIT) {
        const newAmount = currentAccount?.account.amount + data.amount;
        await this.updateAccount(
          { amount: Number(newAmount), id: +data.account_id },
          token,
        );
        data.amount_current = newAmount;
        data.amount_before = currentAccount?.account.amount;
      } else if (data.type === Type.DEBIT) {
        const newAmount = currentAccount?.account.amount - data.amount;
        await this.updateAccount(
          { amount: Number(newAmount), id: +data.account_id },
          token,
        );
        data.amount_current = newAmount;
        data.amount_before = currentAccount?.account.amount;
      }
      return this.prisma.transaction.create({ data });
    }
  }

  async findUser(req: FindRequest, md: Record<string, any>): Promise<User> {
    const meta = new Metadata();
    Object.entries(md).map(([k, v]) => meta.add(k, v));
    const res: FindResponse = await firstValueFrom(
      this.userService.find(req, meta) as any,
    );

    return res.user?.[0];
  }

  async findAccount(
    req: GetAccountRequest,
    md: Record<string, any>,
  ): Promise<Account> {
    const meta = new Metadata();
    Object.entries(md).map(([k, v]) => meta.add(k, v));
    const res: GetAccountRequest = await firstValueFrom(
      this.accountService.getAccount(req, meta) as any,
    );

    return res;
  }

  async updateAccount(
    req: UpdateAccountRequest,
    md: Record<string, any>,
  ): Promise<Account> {
    const meta = new Metadata();
    Object.entries(md).map(([k, v]) => meta.add(k, v));
    const res: GetAccountRequest = await firstValueFrom(
      this.accountService.updateAccount(req, meta) as any,
    );

    return res;
  }

  async find(
    heroWhereUniqueInput?: Prisma.TransactionWhereUniqueInput,
  ): Promise<Transaction> {
    return this.prisma.transaction.findUnique({
      where: heroWhereUniqueInput,
    });
  }

  async getAllTransaction(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.TransactionWhereUniqueInput;
    where?: Prisma.TransactionWhereInput;
    orderBy?: Prisma.TransactionOrderByWithRelationInput;
  }): Promise<Transaction[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.transaction.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }
}
