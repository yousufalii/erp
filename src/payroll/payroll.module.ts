import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payroll } from './entities/payroll.entity';
import { SalaryStructure } from './entities/salary-structure.entity';
import { PayrollRepository } from './payroll.repository';
import { PayrollProvider } from './payroll.provider';
import { PayrollController } from './payroll.controller';
import { EmployeeModule } from '../employee/employee.module';
import { LeaveModule } from '../leave/leave.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payroll, SalaryStructure]),
    EmployeeModule,
    LeaveModule,
  ],
  controllers: [PayrollController],
  providers: [PayrollRepository, PayrollProvider],
  exports: [PayrollProvider],
})
export class PayrollModule {}
