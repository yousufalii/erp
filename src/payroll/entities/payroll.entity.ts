import { Entity, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { BaseTenantEntity } from '../../lib/entities/base.entity';
import { Employee } from '../../employee/entities/employee.entity';
import { PayrollStatus } from '../../lib/enums/payroll.enum';

@Entity('payroll_records')
export class Payroll extends BaseTenantEntity {
  @ManyToOne(() => Employee, { nullable: false })
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

  @Column()
  employeeId: string;

  @Column()
  month: number; // 1-12

  @Column()
  year: number; // e.g. 2026

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  grossSalary: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  netSalary: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalEarnings: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalDeductions: number;

  @Column({ type: 'decimal', precision: 4, scale: 1, default: 0 })
  unpaidLeaves: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  lopDeduction: number; // Loss of Pay

  @Column({ type: 'enum', enum: PayrollStatus, default: PayrollStatus.DRAFT })
  status: PayrollStatus;

  @Column({ type: 'date', nullable: true })
  processedAt: Date;

  @Column({ nullable: true })
  notes: string;
}
