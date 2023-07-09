/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { Timestamp } from "../../google/protobuf/timestamp";

export const protobufPackage = "account.v1alpha";

export interface Account {
  id?: number;
  name?: string;
  amount?: number;
  userId?: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface GetAccountRequest {
  name?: string;
  id?: number;
}

export interface GetAccountResponse {
  account?: Account;
}

export interface GetAllAccountRequest {
}

export interface GetAllAccountResponse {
  account?: Account[];
}

export interface CreateAccountRequest {
  name?: string;
  userId?: number;
}

export interface CreateAccountResponse {
  account?: Account;
}

export interface UpdateAccountRequest {
  id?: number;
  name?: string;
  amount?: number;
}

export interface UpdateAccountResponse {
  account?: Account;
}

export interface DeleteAccountRequest {
  name?: string;
  id?: number;
}

export interface DeleteAccountResponse {
  message?: string;
}

export const ACCOUNT_V1ALPHA_PACKAGE_NAME = "account.v1alpha";

export interface AccountServiceClient {
  getAccount(request: GetAccountRequest, metadata?: Metadata): Observable<GetAccountResponse>;

  getAllAccount(request: GetAllAccountRequest, metadata?: Metadata): Observable<GetAllAccountResponse>;

  createAccount(request: CreateAccountRequest, metadata?: Metadata): Observable<CreateAccountResponse>;

  updateAccount(request: UpdateAccountRequest, metadata?: Metadata): Observable<UpdateAccountResponse>;

  deleteAccount(request: DeleteAccountRequest, metadata?: Metadata): Observable<DeleteAccountResponse>;
}

export interface AccountServiceController {
  getAccount(
    request: GetAccountRequest,
    metadata?: Metadata,
  ): Promise<GetAccountResponse> | Observable<GetAccountResponse> | GetAccountResponse;

  getAllAccount(
    request: GetAllAccountRequest,
    metadata?: Metadata,
  ): Promise<GetAllAccountResponse> | Observable<GetAllAccountResponse> | GetAllAccountResponse;

  createAccount(
    request: CreateAccountRequest,
    metadata?: Metadata,
  ): Promise<CreateAccountResponse> | Observable<CreateAccountResponse> | CreateAccountResponse;

  updateAccount(
    request: UpdateAccountRequest,
    metadata?: Metadata,
  ): Promise<UpdateAccountResponse> | Observable<UpdateAccountResponse> | UpdateAccountResponse;

  deleteAccount(
    request: DeleteAccountRequest,
    metadata?: Metadata,
  ): Promise<DeleteAccountResponse> | Observable<DeleteAccountResponse> | DeleteAccountResponse;
}

export function AccountServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["getAccount", "getAllAccount", "createAccount", "updateAccount", "deleteAccount"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("AccountService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("AccountService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const ACCOUNT_SERVICE_NAME = "AccountService";
