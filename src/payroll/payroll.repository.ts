import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payroll } from './entities/payroll.entity';
import { SalaryStructure } from './entities/salary-structure.entity';

@Injectable()
export class PayrollRepository {
  constructor(
    @InjectRepository(Payroll)
    private readonly payrollRepo: Repository<Payroll>,
    @InjectRepository(SalaryStructure)
    private readonly structureRepo: Repository<SalaryStructure>,
  ) {}

  async findStructure(employeeId: string, tenantId: string): Promise<SalaryStructure | null> {
    return this.structureRepo.findOne({
      where: { employeeId, tenantId, isActive: true },
    });
  }

  async createStructure(data: Partial<SalaryStructure>): Promise<SalaryStructure> {
    const structure = this.structureRepo.create(data);
    return this.structureRepo.save(structure);
  }

  async findPayroll(employeeId: string, month: number, year: number, tenantId: string): Promise<Payroll | null> {
    return this.payrollRepo.findOne({
      where: { employeeId, month, year, tenantId },
    });
  }

  async savePayroll(payroll: Partial<Payroll>): Promise<Payroll> {
    return this.payrollRepo.save(payroll);
  }

  async findMyPayroll(employeeId: string, tenantId: string): Promise<Payroll[]> {
    return this.payrollRepo.find({
      where: { employeeId, tenantId },
      order: { year: 'DESC', month: 'DESC' },
    });
  }

  async findAllByMonth(month: number, year: number, tenantId: string): Promise<Payroll[]> {
    return this.payrollRepo.find({
      where: { month, year, tenantId },
      relations: ['employee'],
    });
  }
}
