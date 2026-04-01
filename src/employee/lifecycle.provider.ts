import { Injectable } from '@nestjs/common';
import { EmployeeProvider } from './employee.provider';
import { EmployeeStatus } from '../lib/enums/employee.enum';
import { ResignEmployeeDto, TerminateEmployeeDto } from './dto/lifecycle.dto';
import { BadRequestHandler, NotFoundHandler } from '../lib/helpers/responseHandlers';
import { Employee } from './entities/employee.entity';
import { UserStatus } from '../lib/enums/user.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LifecycleProvider {
  constructor(
    private readonly employeeProvider: EmployeeProvider,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async resign(userId: string, tenantId: string, payload: ResignEmployeeDto): Promise<Employee> {
    const employee = await this.employeeProvider.findOneByUserId(userId, tenantId);
    NotFoundHandler({ condition: !employee, message: 'Employee profile not associated.' });

    return this.employeeProvider.update(employee!.id, {
      status: EmployeeStatus.PENDING_RESIGNATION,
      resignationDate: new Date(),
      lastWorkingDay: new Date(payload.lastWorkingDay),
      exitReason: payload.reason,
    } as any, tenantId);
  }

  async terminate(id: string, tenantId: string, payload: TerminateEmployeeDto): Promise<Employee> {
    const employee = await this.employeeProvider.findOne(id, tenantId);
    
    // Update Employee Status
    const updated = await this.employeeProvider.update(id, {
      status: EmployeeStatus.TERMINATED,
      terminationDate: new Date(),
      lastWorkingDay: new Date(payload.lastWorkingDay),
      exitReason: payload.reason,
    } as any, tenantId);

    // Deactivate User Login if linked
    if (updated.user) {
      await this.userRepo.update(updated.user.id, { status: UserStatus.INACTIVE });
    }

    return updated;
  }

  async confirmProbation(id: string, tenantId: string): Promise<Employee> {
    const employee = await this.employeeProvider.findOne(id, tenantId);
    BadRequestHandler({ condition: employee.status !== EmployeeStatus.PROBATION, message: 'Employee is not in probation.' });

    return this.employeeProvider.update(id, {
      status: EmployeeStatus.ACTIVE,
    } as any, tenantId);
  }

  async finalizeExit(id: string, tenantId: string): Promise<Employee> {
    const employee = await this.employeeProvider.findOne(id, tenantId);
    
    // Status can only be 'RESIGNED' once exit is final
    const status = employee.status === EmployeeStatus.PENDING_RESIGNATION ? EmployeeStatus.RESIGNED : employee.status;

    return this.employeeProvider.update(id, {
       status,
    } as any, tenantId);
  }
}
