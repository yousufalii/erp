import { Injectable } from '@nestjs/common';
import { EmployeeRepository } from './employee.repository';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { BadRequestHandler, NotFoundHandler } from '../lib/helpers/responseHandlers';
import { Employee } from './entities/employee.entity';

@Injectable()
export class EmployeeProvider {
  constructor(private readonly repository: EmployeeRepository) {}

  async create(payload: CreateEmployeeDto, tenantId: string): Promise<Employee> {
    const existing = await this.repository.findByCode(payload.employeeCode, tenantId);
    BadRequestHandler({
      condition: !!existing,
      message: 'Employee with this code already exists in your organization.',
    });

    return this.repository.create({
      ...payload,
      tenantId,
      joinDate: new Date(payload.joinDate),
      dateOfBirth: payload.dateOfBirth ? new Date(payload.dateOfBirth) : undefined,
    });
  }

  async findAll(tenantId: string): Promise<Employee[]> {
    return this.repository.findAll(tenantId);
  }

  async findOne(id: string, tenantId: string): Promise<Employee> {
    const employee = await this.repository.findById(id, tenantId);
    NotFoundHandler({
      condition: !employee,
      message: 'Employee profile not found.',
    });
    return employee!;
  }

  async findOneByUserId(userId: string, tenantId: string): Promise<Employee | null> {
    return this.repository.findByUserId(userId, tenantId);
  }

  async update(id: string, payload: Partial<CreateEmployeeDto>, tenantId: string): Promise<Employee> {
    const employee = await this.repository.findById(id, tenantId);
    NotFoundHandler({ condition: !employee, message: 'Employee not found.' });

    const updated = await this.repository.update(id, {
      ...payload,
      joinDate: payload.joinDate ? new Date(payload.joinDate) : undefined,
      dateOfBirth: payload.dateOfBirth ? new Date(payload.dateOfBirth) : undefined,
    });
    return updated!;
  }

  async delete(id: string, tenantId: string): Promise<void> {
    const employee = await this.repository.findById(id, tenantId);
    NotFoundHandler({ condition: !employee, message: 'Employee not found.' });
    return this.repository.softDelete(id, tenantId);
  }
}
