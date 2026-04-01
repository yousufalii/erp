import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveRequest } from './entities/leave-request.entity';
import { LeaveEntitlement } from './entities/leave-entitlement.entity';
import { LeaveRepository } from './leave.repository';
import { LeaveProvider } from './leave.provider';
import { LeaveController } from './leave.controller';
import { EmployeeModule } from '../employee/employee.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LeaveRequest, LeaveEntitlement]),
    EmployeeModule,
  ],
  controllers: [LeaveController],
  providers: [LeaveRepository, LeaveProvider],
  exports: [LeaveProvider, LeaveRepository],
})
export class LeaveModule {}
