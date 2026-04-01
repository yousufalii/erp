import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseTenantEntity } from '../../lib/entities/base.entity';
import { Employee } from '../../employee/entities/employee.entity';

@Entity('salary_history')
export class SalaryHistory extends BaseTenantEntity {
  @ManyToOne(() => Employee, { nullable: false })
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

  @Column()
  employeeId: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  oldBasicSalary: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  newBasicSalary: number;

  @Column({ type: 'date' })
  effectiveDate: Date;

  @Column()
  changedById: string;

  @Column({ nullable: true })
  reason: string;
}
