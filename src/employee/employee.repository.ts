import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';

@Injectable()
export class EmployeeRepository {
  constructor(
    @InjectRepository(Employee)
    private readonly repository: Repository<Employee>,
  ) {}

  async create(data: Partial<Employee>): Promise<Employee> {
    const employee = this.repository.create(data);
    return this.repository.save(employee);
  }

  async findByCode(employeeCode: string, tenantId: string): Promise<Employee | null> {
    return this.repository.findOne({
      where: { employeeCode, tenantId },
      relations: ['manager', 'user'],
    });
  }

  async findById(id: string, tenantId: string): Promise<Employee | null> {
    return this.repository.findOne({
      where: { id, tenantId },
      relations: ['manager', 'user'],
    });
  }

  async findByUserId(userId: string, tenantId: string): Promise<Employee | null> {
    return this.repository.findOne({
      where: { user: { id: userId }, tenantId },
    });
  }

  async findAll(tenantId: string): Promise<Employee[]> {
    return this.repository.find({
      where: { tenantId },
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, data: Partial<Employee>): Promise<Employee | null> {
    await this.repository.update(id, data);
    return this.repository.findOne({ where: { id } });
  }

  async softDelete(id: string, tenantId: string): Promise<void> {
    await this.repository.softDelete({ id, tenantId });
  }
}
