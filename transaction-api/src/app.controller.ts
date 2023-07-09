import { Controller, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import {
  TransactionServiceControllerMethods,
  TransactionServiceController,
  TRANSACTION_SERVICE_NAME,
  CreateTransactionRequest,
  CreateTransactionResponse,
  GetTransactionRequest,
  GetTransactionResponse,
  GetAllTransactionRequest,
  GetAllTransactionResponse,
} from './stubs/transaction/v1alpha/transaction';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { GrpcAuthGuard } from 'src/auth/auth.guard';

@Controller()
@TransactionServiceControllerMethods()
export class AppController implements TransactionServiceController {
  constructor(private readonly appService: AppService) {}

  @GrpcMethod(TRANSACTION_SERVICE_NAME)
  @UseGuards(GrpcAuthGuard)
  async createTransaction(
    req: CreateTransactionRequest,
  ): Promise<CreateTransactionResponse> {
    try {
      const transaction = await this.appService.createTransaction({
        type: req.type as any,
        amount: +req.amount,
        amount_before: 0,
        amount_current: 0,
        account_id: req.accountId,
        user_id: req.userId,
      });
      return { transaction: transaction as any };
    } catch (error) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: error.message,
      });
    }
  }

  @GrpcMethod(TRANSACTION_SERVICE_NAME)
  @UseGuards(GrpcAuthGuard)
  async getTransaction(
    req: GetTransactionRequest,
  ): Promise<GetTransactionResponse> {
    const transaction = await this.appService.find({ id: req.id });
    if (transaction === null) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: 'Transaction not found',
      });
    }
    return { transaction: transaction as any };
  }

  @GrpcMethod(TRANSACTION_SERVICE_NAME)
  @UseGuards(GrpcAuthGuard)
  async getTransactionByAccount(
    req: GetTransactionRequest,
  ): Promise<GetAllTransactionResponse> {
    const transaction = await this.appService.getAllTransaction({
      where: { account_id: req.id },
    });
    if (transaction === null) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: 'Account not found',
      });
    }
    return { transaction: transaction as any };
  }

  @GrpcMethod(TRANSACTION_SERVICE_NAME)
  @UseGuards(GrpcAuthGuard)
  async getTransactionByUser(
    req: GetTransactionRequest,
  ): Promise<GetAllTransactionResponse> {
    const transaction = await this.appService.getAllTransaction({
      where: { user_id: req.id },
    });
    if (transaction === null) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: 'Account not found',
      });
    }
    return { transaction: transaction as any };
  }

  @GrpcMethod(TRANSACTION_SERVICE_NAME)
  @UseGuards(GrpcAuthGuard)
  async getAllTransaction(
    req: GetAllTransactionRequest,
  ): Promise<GetAllTransactionResponse> {
    const transaction = await this.appService.getAllTransaction(req);

    return { transaction: transaction as any };
  }
}
