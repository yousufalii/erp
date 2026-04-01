import { Module } from '@nestjs/common';
import { DashboardProvider } from './dashboard.provider';
import { DashboardController } from './dashboard.controller';
import { EmployeeModule } from '../employee/employee.module';
import { AttendanceModule } from '../attendance/attendance.module';
import { LeaveModule } from '../leave/leave.module';

@Module({
  imports: [
    EmployeeModule,
    AttendanceModule,
    LeaveModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardProvider],
})
export class DashboardModule {}
