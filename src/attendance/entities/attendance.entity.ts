import { Entity, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { BaseTenantEntity } from '../../lib/entities/base.entity';
import { Employee } from '../../employee/entities/employee.entity';
import { AttendanceStatus } from '../../lib/enums/attendance.enum';

@Entity('attendance_records')
export class Attendance extends BaseTenantEntity {
  @ManyToOne(() => Employee, { nullable: false })
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

  @Column()
  employeeId: string;

  @Column({ type: 'date' })
  date: Date; // e.g. '2026-04-01'

  @Column({ type: 'timestamp', nullable: true })
  checkIn: Date;

  @Column({ type: 'timestamp', nullable: true })
  checkOut: Date;

  @Column({ type: 'decimal', precision: 4, scale: 2, default: 0 })
  totalHours: number;

  @Column({ type: 'enum', enum: AttendanceStatus, default: AttendanceStatus.ABSENT })
  status: AttendanceStatus;

  @Column({ nullable: true })
  remarks: string;

  @Column({ default: false })
  isManualOverride: boolean; // True if HR manually edited this record
}
