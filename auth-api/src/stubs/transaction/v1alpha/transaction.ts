/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { Timestamp } from "../../google/protobuf/timestamp";

export const protobufPackage = "transaction.v1alpha";

export enum TransactionType {
  DEBIT = 0,
  CREDIT = 1,
  UNRECOGNIZED = -1,
}

export interface Transaction {
  id?: number;
  type?: TransactionType;
  amount?: number;
  amountBefore?: number;
  amountCurrent?: number;
  userId?: number;
  accountId?: number;
  updatedAt?: Timestamp;
  createdAt?: Timestamp;
}

export interface GetTransactionRequest {
  id?: number;
}

export interface GetTransactionResponse {
  transaction?: Transaction;
}

export interface GetTransactionAccountRequest {
  accountId?: number;
}

export interface GetTransactionByAccountResponse {
  transaction?: Transaction;
}

export interface GetAllTransactionRequest {
}

export interface GetAllTransactionResponse {
  transaction?: Transaction[];
}

export interface CreateTransactionRequest {
  amount?: string;
  userId?: number;
  accountId?: number;
  type?: TransactionType;
}

export interface CreateTransactionResponse {
  transaction?: Transaction;
}

export const TRANSACTION_V1ALPHA_PACKAGE_NAME = "transaction.v1alpha";

export interface TransactionServiceClient {
  getTransaction(request: GetTransactionRequest, metadata?: Metadata): Observable<GetTransactionResponse>;

  getTransactionByAccount(request: GetTransactionRequest, metadata?: Metadata): Observable<GetAllTransactionResponse>;

  getTransactionByUser(request: GetTransactionRequest, metadata?: Metadata): Observable<GetAllTransactionResponse>;

  getAllTransaction(request: GetAllTransactionRequest, metadata?: Metadata): Observable<GetAllTransactionResponse>;

  createTransaction(request: CreateTransactionRequest, metadata?: Metadata): Observable<CreateTransactionResponse>;
}

export interface TransactionServiceController {
  getTransaction(
    request: GetTransactionRequest,
    metadata?: Metadata,
  ): Promise<GetTransactionResponse> | Observable<GetTransactionResponse> | GetTransactionResponse;

  getTransactionByAccount(
    request: GetTransactionRequest,
    metadata?: Metadata,
  ): Promise<GetAllTransactionResponse> | Observable<GetAllTransactionResponse> | GetAllTransactionResponse;

  getTransactionByUser(
    request: GetTransactionRequest,
    metadata?: Metadata,
  ): Promise<GetAllTransactionResponse> | Observable<GetAllTransactionResponse> | GetAllTransactionResponse;

  getAllTransaction(
    request: GetAllTransactionRequest,
    metadata?: Metadata,
  ): Promise<GetAllTransactionResponse> | Observable<GetAllTransactionResponse> | GetAllTransactionResponse;

  createTransaction(
    request: CreateTransactionRequest,
    metadata?: Metadata,
  ): Promise<CreateTransactionResponse> | Observable<CreateTransactionResponse> | CreateTransactionResponse;
}

export function TransactionServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "getTransaction",
      "getTransactionByAccount",
      "getTransactionByUser",
      "getAllTransaction",
      "createTransaction",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("TransactionService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("TransactionService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const TRANSACTION_SERVICE_NAME = "TransactionService";
