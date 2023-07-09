import { ChannelCredentials, ServerCredentials } from '@grpc/grpc-js';
import {
  ClientProviderOptions,
  GrpcOptions,
  Transport,
} from '@nestjs/microservices';
import { readFileSync } from 'fs';
import { addReflectionToGrpcConfig } from 'nestjs-grpc-reflection';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { AUTH_V1ALPHA_PACKAGE_NAME } from 'src/stubs/auth/v1alpha/service';
import { USER_V1ALPHA_PACKAGE_NAME } from 'src/stubs/user/v1alpha/service';
import { ACCOUNT_V1ALPHA_PACKAGE_NAME } from 'src/stubs/account/v1alpha/account';

export default (cs: ConfigService) =>
  addReflectionToGrpcConfig({
    transport: Transport.GRPC,
    options: {
      package: ACCOUNT_V1ALPHA_PACKAGE_NAME,
      url: `0.0.0.0:${cs.get('PORT') || 4002}`,
      credentials: !cs.get<boolean>('insecure')
        ? ServerCredentials.createSsl(null, [
            {
              private_key: readFileSync(cs.get('ACCOUNT_KEY')),
              cert_chain: readFileSync(cs.get('ACCOUNT_CERT')),
            },
          ])
        : ServerCredentials.createInsecure(),
      loader: {
        includeDirs: [join(__dirname, '../proto')],
      },
      protoPath: [join(__dirname, '../proto/account/v1alpha/account.proto')],
    },
  } as GrpcOptions);

export const userGrpcOptions = (cs: ConfigService): ClientProviderOptions => {
  return {
    name: USER_V1ALPHA_PACKAGE_NAME,
    transport: Transport.GRPC,
    options: {
      url: cs.get('USER_API_URL'),
      package: USER_V1ALPHA_PACKAGE_NAME,
      loader: {
        includeDirs: [join(__dirname, '../proto')],
      },
      protoPath: [join(__dirname, '../proto/user/v1alpha/service.proto')],
      keepalive: {
        // Send keepalive pings every 10 seconds, default is 2 hours.
        keepaliveTimeMs: 10 * 1000,
        // Keepalive ping timeout after 5 seconds, default is 20 seconds.
        keepaliveTimeoutMs: 5 * 1000,
        // Allow keepalive pings when there are no gRPC calls.
        keepalivePermitWithoutCalls: 1,
      },
      credentials: !cs.get<boolean>('insecure')
        ? ChannelCredentials.createSsl(
            readFileSync(cs.get('ROOT_CA')),
            readFileSync(cs.get('USER_KEY')),
            readFileSync(cs.get('USER_CERT')),
          )
        : ChannelCredentials.createInsecure(),
    },
  };
};

export const authGrpcOptions = (cs: ConfigService): ClientProviderOptions => {
  return {
    name: AUTH_V1ALPHA_PACKAGE_NAME,
    transport: Transport.GRPC,
    options: {
      url: cs.get('AUTH_API_URL'),
      package: AUTH_V1ALPHA_PACKAGE_NAME,
      loader: {
        includeDirs: [join(__dirname, '../proto')],
      },
      protoPath: [join(__dirname, '../proto/auth/v1alpha/service.proto')],
      keepalive: {
        // Send keepalive pings every 10 seconds, default is 2 hours.
        keepaliveTimeMs: 10 * 1000,
        // Keepalive ping timeout after 5 seconds, default is 20 seconds.
        keepaliveTimeoutMs: 5 * 1000,
        // Allow keepalive pings when there are no gRPC calls.
        keepalivePermitWithoutCalls: 1,
      },
      credentials: !cs.get<boolean>('insecure')
        ? ChannelCredentials.createSsl(
            readFileSync(cs.get('ROOT_CA')),
            readFileSync(cs.get('AUTH_KEY')),
            readFileSync(cs.get('AUTH_CERT')),
          )
        : ChannelCredentials.createInsecure(),
    },
  };
};
