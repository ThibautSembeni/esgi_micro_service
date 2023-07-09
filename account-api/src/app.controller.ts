import { Controller, Headers, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import {
  AccountServiceControllerMethods,
  AccountServiceController,
  ACCOUNT_SERVICE_NAME,
  CreateAccountRequest,
  CreateAccountResponse,
  GetAccountRequest,
  GetAccountResponse,
  GetAllAccountRequest,
  GetAllAccountResponse,
  UpdateAccountRequest,
  UpdateAccountResponse,
  DeleteAccountRequest,
  DeleteAccountResponse,
} from './stubs/account/v1alpha/account';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { GrpcAuthGuard } from 'src/auth/auth.guard';

@Controller()
@AccountServiceControllerMethods()
export class AppController implements AccountServiceController {
  constructor(private readonly appService: AppService) {}

  @GrpcMethod(ACCOUNT_SERVICE_NAME)
  @UseGuards(GrpcAuthGuard)
  async createAccount(
    req: CreateAccountRequest,
  ): Promise<CreateAccountResponse> {
    try {
      const account = await this.appService.createAccount({
        name: req.name,
        amount: 0,
        user_id: req.userId,
      });
      if (account === null) {
        throw new RpcException({
          code: status.NOT_FOUND,
          message: 'User not found',
        });
      }
      return { account: account as any };
    } catch (error) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: error.message,
      });
    }
  }

  @GrpcMethod(ACCOUNT_SERVICE_NAME)
  @UseGuards(GrpcAuthGuard)
  async getAccount(req: GetAccountRequest): Promise<GetAccountResponse> {
    const account = await this.appService.find({ id: req.id });
    console.log(account);
    if (account === null) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: 'Account not found',
      });
    }
    return { account: account as any };
  }

  @GrpcMethod(ACCOUNT_SERVICE_NAME)
  @UseGuards(GrpcAuthGuard)
  async getAllAccount(
    req: GetAllAccountRequest,
  ): Promise<GetAllAccountResponse> {
    const account = await this.appService.getAllAccount(req);

    return { account: account as any };
  }
  @GrpcMethod(ACCOUNT_SERVICE_NAME)
  @UseGuards(GrpcAuthGuard)
  async updateAccount(
    req: UpdateAccountRequest,
  ): Promise<UpdateAccountResponse> {
    const account = await this.appService.updateAccount({
      where: {
        id: +req.id,
      },
      data: { name: req.name, amount: req.amount },
    });
    if (account === null) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: 'Account not found',
      });
    }

    return { account: account as any };
  }
  @GrpcMethod(ACCOUNT_SERVICE_NAME)
  @UseGuards(GrpcAuthGuard)
  async deleteAccount(
    req: DeleteAccountRequest,
  ): Promise<DeleteAccountResponse> {
    const account = await this.appService.deleteAccount({ id: req.id });
    if (account === null) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: 'Account not found',
      });
    }
    return { message: 'Le compte a été supprimé !' };
  }
}
