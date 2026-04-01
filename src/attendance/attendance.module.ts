import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { AttendancePolicy } from './entities/attendance-policy.entity';
import { AttendanceRepository } from './attendance.repository';
import { AttendanceProvider } from './attendance.provider';
import { AttendanceController } from './attendance.controller';
import { EmployeeModule } from '../employee/employee.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Attendance, AttendancePolicy]),
    EmployeeModule,
  ],
  controllers: [AttendanceController],
  providers: [AttendanceRepository, AttendanceProvider],
  exports: [AttendanceProvider, AttendanceRepository],
})
export class AttendanceModule {}
