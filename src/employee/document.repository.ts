import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployeeDocument } from './entities/employee-document.entity';

@Injectable()
export class DocumentRepository {
  constructor(
    @InjectRepository(EmployeeDocument)
    private readonly repository: Repository<EmployeeDocument>,
  ) {}

  async save(data: Partial<EmployeeDocument>): Promise<EmployeeDocument> {
    const doc = this.repository.create(data);
    return this.repository.save(doc);
  }

  async findByEmployee(employeeId: string, tenantId: string): Promise<EmployeeDocument[]> {
    return this.repository.find({
      where: { employeeId, tenantId, isActive: true },
    });
  }

  async softDelete(id: string, tenantId: string): Promise<void> {
    await this.repository.softDelete({ id, tenantId });
  }

  async findById(id: string, tenantId: string): Promise<EmployeeDocument | null> {
    return this.repository.findOne({
      where: { id, tenantId },
    });
  }
}
