import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseTenantEntity } from '../../lib/entities/base.entity';
import { Employee } from '../../employee/entities/employee.entity';

@Entity('salary_structures')
export class SalaryStructure extends BaseTenantEntity {
  @OneToOne(() => Employee, { nullable: false })
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

  @Column()
  employeeId: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  basicSalary: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  houseAllowance: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  transportAllowance: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  otherAllowances: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  taxDeduction: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  providentFund: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  otherDeductions: number;

  @Column({ default: true })
  isActive: boolean;
}
