import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as Joi from 'joi';
import { HealthModule } from './health/health.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import winstonConfig from './config/winston.config';
import { WinstonModule } from 'nest-winston';
import { GrpcReflectionModule } from 'nestjs-grpc-reflection';
import grpcOption, { userGrpcOptions } from './config/grpc.option';
import { PrismaService } from './prisma.service';
import { ClientsModule } from '@nestjs/microservices';
import { USER_V1ALPHA_PACKAGE_NAME } from './stubs/user/v1alpha/service';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

const envSchema = Joi.object({
  MYSQL_URL: Joi.string().required(),
  PORT: Joi.number().default(4000),
  HEALTH_PORT: Joi.number().default(3000),
  insecure: Joi.boolean().required(),
  JWT_SECRET: Joi.string().required(),
  USER_CERT: Joi.string().when('insecure', {
    is: false,
    then: Joi.required(),
  }),
  USER_KEY: Joi.string().when('insecure', {
    is: false,
    then: Joi.required(),
  }),
  ROOT_CA: Joi.string().when('insecure', {
    is: false,
    then: Joi.required(),
  }),
  JAEGER_URL: Joi.string(),
  USER_API_URL: Joi.string().required(),
});
@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      validationSchema: envSchema,
      isGlobal: true,
    }),
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => winstonConfig(cs),
    }),
    GrpcReflectionModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => grpcOption(cs),
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    HealthModule,
    AuthModule,
    ClientsModule.registerAsync([
      {
        name: USER_V1ALPHA_PACKAGE_NAME,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (cs: ConfigService) => userGrpcOptions(cs),
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
