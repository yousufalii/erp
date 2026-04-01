import { Entity, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { BaseTenantEntity } from '../../lib/entities/base.entity';
import { Employee } from '../../employee/entities/employee.entity';
import { LeaveType } from '../../lib/enums/leave.enum';

@Entity('leave_entitlements')
@Unique(['employeeId', 'leaveType', 'year', 'tenantId'])
export class LeaveEntitlement extends BaseTenantEntity {
  @ManyToOne(() => Employee, { nullable: false })
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

  @Column()
  employeeId: string;

  @Column({ type: 'enum', enum: LeaveType })
  leaveType: LeaveType;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  totalDays: number; // Allocated for the year

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  usedDays: number; // Taken leaves

  @Column()
  year: number; // e.g. 2026
}
