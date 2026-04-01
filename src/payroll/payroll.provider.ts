import { Injectable } from '@nestjs/common';
import { PayrollRepository } from './payroll.repository';
import { EmployeeProvider } from '../employee/employee.provider';
import { LeaveProvider } from '../leave/leave.provider';
import { PayrollStatus } from '../lib/enums/payroll.enum';
import { BadRequestHandler, NotFoundHandler } from '../lib/helpers/responseHandlers';
import { Payroll } from './entities/payroll.entity';
import { CreateSalaryStructureDto, GeneratePayrollDto } from './dto/payroll.dto';
import { SalaryStructure } from './entities/salary-structure.entity';

@Injectable()
export class PayrollProvider {
  constructor(
    private readonly repository: PayrollRepository,
    private readonly employeeProvider: EmployeeProvider,
    private readonly leaveProvider: LeaveProvider,
  ) {}

  async upsertSalaryStructure(payload: CreateSalaryStructureDto, tenantId: string, actorUserId: string): Promise<SalaryStructure> {
    const existingStructure = await this.repository.findStructure(payload.employeeId, tenantId);
    
    if (existingStructure && Number(existingStructure.basicSalary) !== Number(payload.basicSalary)) {
       await this.repository.saveHistory({
          employeeId: payload.employeeId,
          tenantId,
          oldBasicSalary: existingStructure.basicSalary,
          newBasicSalary: payload.basicSalary,
          effectiveDate: new Date(),
          changedById: actorUserId,
          reason: 'Manual adjustment in salary structure'
       });
    }

    return this.repository.createStructure({
      ...payload,
      tenantId,
    });
  }

  async generateMonthlyPayroll(payload: GeneratePayrollDto, tenantId: string): Promise<Payroll[]> {
    const employees = await this.employeeProvider.findAll(tenantId);
    const payrolls: Payroll[] = [];

    for (const employee of employees) {
      const structure = await this.repository.findStructure(employee.id, tenantId);
      if (!structure) continue;

      const unpaidDays = await this.leaveProvider.getMonthlyUnpaidLeaveDays(employee.id, payload.month, payload.year, tenantId);
      
      const grossSalary = Number(structure.basicSalary) + Number(structure.houseAllowance) + Number(structure.transportAllowance) + Number(structure.otherAllowances);
      const perDaySalary = grossSalary / 30;
      const lopDeduction = perDaySalary * unpaidDays;

      const totalDeductions = Number(structure.taxDeduction) + Number(structure.providentFund) + Number(structure.otherDeductions) + lopDeduction;
      const netSalary = grossSalary - totalDeductions;

      const existing = await this.repository.findPayroll(employee.id, payload.month, payload.year, tenantId);
      
      const record = await this.repository.savePayroll({
        id: existing?.id,
        employeeId: employee.id,
        tenantId,
        month: payload.month,
        year: payload.year,
        grossSalary,
        totalEarnings: grossSalary,
        totalDeductions,
        unpaidLeaves: unpaidDays,
        lopDeduction: Number(lopDeduction.toFixed(2)),
        netSalary: Number(netSalary.toFixed(2)),
        status: PayrollStatus.DRAFT
      });

      payrolls.push(record);
    }

    return payrolls;
  }

  async finalizePayroll(id: string, tenantId: string): Promise<Payroll> {
    const payroll = await this.repository.findById(id, tenantId);
    BadRequestHandler({ condition: !payroll, message: 'Payroll record not found.' });

    return this.repository.updateStatus(id, PayrollStatus.FINALIZED);
  }

  async getPayslip(id: string, tenantId: string) {
    const payroll = await this.repository.findById(id, tenantId);
    NotFoundHandler({ condition: !payroll, message: 'Payroll record not found.' });
    
    return {
      success: true,
      message: 'Payslip data generated.',
      data: {
        summary: payroll!,
        breakdown: {
          gross: payroll!.grossSalary,
          deductions: {
            unpaidLeaves: payroll!.lopDeduction,
            tax: 0,
          },
          net: payroll!.netSalary,
        }
      }
    };
  }

  async getMyPayrolls(userId: string, tenantId: string): Promise<Payroll[]> {
    const employee = await this.employeeProvider.findOneByUserId(userId, tenantId);
    NotFoundHandler({ condition: !employee, message: 'Employee profile not associated.' });
    return this.repository.findMyPayroll(employee!.id, tenantId);
  }
}
