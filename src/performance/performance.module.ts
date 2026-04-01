import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerformanceMetric } from './entities/performance-metric.entity';
import { PerformanceAppraisal } from './entities/performance-appraisal.entity';
import { PerformanceRepository } from './performance.repository';
import { PerformanceProvider } from './performance.provider';
import { PerformanceController } from './performance.controller';
import { EmployeeModule } from '../employee/employee.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PerformanceMetric, PerformanceAppraisal]),
    EmployeeModule,
    NotificationModule,
  ],
  controllers: [PerformanceController],
  providers: [PerformanceRepository, PerformanceProvider],
  exports: [PerformanceProvider],
})
export class PerformanceModule {}
