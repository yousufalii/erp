import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseTenantEntity } from '../../lib/entities/base.entity';
import { Employee } from '../../employee/entities/employee.entity';
import { MetricType } from '../../lib/enums/performance.enum';

@Entity('performance_metrics')
export class PerformanceMetric extends BaseTenantEntity {
  @ManyToOne(() => Employee, { nullable: false })
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

  @Column()
  employeeId: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: MetricType, default: MetricType.KPI })
  type: MetricType;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  weightage: number; // Percentage contribution (e.g. 20.00)

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 100 })
  targetValue: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  currentValue: number;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'int' })
  quarter: number; // 1-4

  @Column({ default: true })
  isActive: boolean;
}
