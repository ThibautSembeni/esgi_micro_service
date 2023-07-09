import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { Account, Prisma } from '@prisma/client';
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
  CheckPasswordResponse,
  FindRequest,
  FindResponse,
  User,
} from './stubs/user/v1alpha/message';

@Injectable()
export class AppService implements OnModuleInit {
  private userService: UserServiceClient;

  constructor(
    private prisma: PrismaService,
    @Inject(USER_V1ALPHA_PACKAGE_NAME) private client: ClientGrpc,
    private jwtService: JwtService,
  ) {}

  onModuleInit() {
    this.userService =
      this.client.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

  async createAccount(data: Prisma.AccountCreateInput): Promise<Account> {
    const currentUser = await this.findUser(
      {
        id: String(data.user_id),
      },
      { Authorization: `Bearer ${this.jwtService.sign({ internal: true })}` },
    );
    if (typeof currentUser === 'undefined') {
      return null;
    } else {
      const currentAccount = await this.prisma.account.findMany({
        where: {
          user_id: data.user_id,
          name: data.name,
        },
      });
      if (currentAccount.length > 0) {
        throw new RpcException({
          code: status.ALREADY_EXISTS,
          message: 'This account already exists',
        });
      } else {
        return this.prisma.account.create({ data });
      }
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

  async find(
    heroWhereUniqueInput?: Prisma.AccountWhereUniqueInput,
  ): Promise<Account> {
    return this.prisma.account.findUnique({
      where: heroWhereUniqueInput,
    });
  }

  async getAllAccount(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.AccountWhereUniqueInput;
    where?: Prisma.AccountWhereInput;
    orderBy?: Prisma.AccountOrderByWithRelationInput;
  }): Promise<Account[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.account.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async updateAccount(params: {
    where: Prisma.AccountWhereUniqueInput;
    data: Prisma.AccountUpdateInput;
  }): Promise<Account> {
    const { data, where } = params;
    const currentAccount = await this.prisma.account.findUnique({
      where: {
        id: +where.id,
      },
    });
    if (currentAccount === null) {
      return null;
    }
    return this.prisma.account.update({
      data,
      where,
    });
  }

  async deleteAccount(where: Prisma.AccountWhereUniqueInput): Promise<Account> {
    const currentAccount = await this.prisma.account.findUnique({
      where: {
        id: +where.id,
      },
    });
    if (currentAccount === null) {
      return null;
    }
    return this.prisma.account.delete({
      where,
    });
  }
}
