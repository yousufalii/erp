import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseTenantEntity } from '../../lib/entities/base.entity';
import { Employee } from '../../employee/entities/employee.entity';
import { AppraisalStatus, PerformanceRating } from '../../lib/enums/performance.enum';

@Entity('performance_appraisals')
export class PerformanceAppraisal extends BaseTenantEntity {
  @ManyToOne(() => Employee, { nullable: false })
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

  @Column()
  employeeId: string;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'int' })
  cycle: number; // 1 (Mid-year) vs 2 (Annual)

  @Column({ type: 'enum', enum: AppraisalStatus, default: AppraisalStatus.DRAFT })
  status: AppraisalStatus;

  @Column({ type: 'enum', enum: PerformanceRating, nullable: true })
  selfRating: PerformanceRating;

  @Column({ type: 'text', nullable: true })
  selfAssessment: string;

  @Column({ type: 'enum', enum: PerformanceRating, nullable: true })
  managerRating: PerformanceRating;

  @Column({ type: 'text', nullable: true })
  managerAssessment: string;

  @Column({ nullable: true })
  managerId: string; // The specific manager who appraised

  @Column({ type: 'text', nullable: true })
  finalComment: string;

  @Column({ default: false })
  isPromotionRecommended: boolean;
}
