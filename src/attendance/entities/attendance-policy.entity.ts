import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseTenantEntity } from '../../lib/entities/base.entity';

@Entity('attendance_policies')
export class AttendancePolicy extends BaseTenantEntity {
  @Column({ default: '09:00' })
  shiftStart: string; // HH:mm (24h)

  @Column({ default: '18:00' })
  shiftEnd: string; // HH:mm

  @Column({ default: 15 })
  graceMinutes: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 4.5 })
  halfDayThreshold: number; // Minimum hours for full day credit

  @Column({ type: 'int', default: 30 })
  halfDayLateThresholdMinutes: number;

  @Column({ type: 'simple-array', nullable: true })
  weeklyOffDays: string[]; // e.g. ['Saturday', 'Sunday']

  @Column({ default: true })
  isActive: boolean;
}
