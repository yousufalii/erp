import { Module } from '@nestjs/common';
import { ExportProvider } from './export.provider';
import { ExportController } from './export.controller';
import { EmployeeModule } from '../employee/employee.module';
import { AttendanceModule } from '../attendance/attendance.module';
import { PayrollModule } from '../payroll/payroll.module';

@Module({
  imports: [
    EmployeeModule,
    AttendanceModule,
    PayrollModule,
  ],
  controllers: [ExportController],
  providers: [ExportProvider],
})
export class ExportModule {}
