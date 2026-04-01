import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseTenantEntity } from '../../lib/entities/base.entity';
import { Employee } from '../../employee/entities/employee.entity';
import { LeaveType, LeaveStatus } from '../../lib/enums/leave.enum';

@Entity('leave_requests')
export class LeaveRequest extends BaseTenantEntity {
  @ManyToOne(() => Employee, { nullable: false })
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

  @Column()
  employeeId: string;

  @Column({ type: 'enum', enum: LeaveType })
  leaveType: LeaveType;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  totalDays: number; // Duration of leave

  @Column({ nullable: true })
  reason: string;

  @Column({ type: 'enum', enum: LeaveStatus, default: LeaveStatus.PENDING })
  status: LeaveStatus;

  @Column({ nullable: true })
  approvedById: string; // The Manager or HR who approved/rejected it

  @Column({ nullable: true })
  rejectionReason: string;

  @Column({ default: false })
  isHalfDay: boolean;
}
