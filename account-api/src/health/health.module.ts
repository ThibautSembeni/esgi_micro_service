import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { PrismaService } from './../prisma.service';
import { HealthController } from './health.controller';
import { PrismaHealthIndicator } from './health.prisma';

@Module({
  imports: [
    TerminusModule.forRoot({
      logger: false,
    }),
  ],
  controllers: [HealthController],
  providers: [PrismaService, PrismaHealthIndicator],
})
export class HealthModule {}
