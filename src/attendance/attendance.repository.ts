import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { AttendancePolicy } from './entities/attendance-policy.entity';

@Injectable()
export class AttendanceRepository {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepo: Repository<Attendance>,
    @InjectRepository(AttendancePolicy)
    private readonly policyRepo: Repository<AttendancePolicy>,
  ) {}

  async findActivePolicy(tenantId: string): Promise<AttendancePolicy | null> {
    return this.policyRepo.findOne({
      where: { tenantId, isActive: true },
    });
  }

  async upsertPolicy(data: Partial<AttendancePolicy>): Promise<AttendancePolicy> {
    const policy = this.policyRepo.create(data);
    return this.policyRepo.save(policy);
  }

  async findTodayRecord(employeeId: string, tenantId: string, date: Date): Promise<Attendance | null> {
    return this.attendanceRepo.findOne({
      where: { employeeId, tenantId, date },
    });
  }

  async saveRecord(record: Partial<Attendance>): Promise<Attendance> {
    return this.attendanceRepo.save(record);
  }

  async findLogs(employeeId: string, tenantId: string, startDate: Date, endDate: Date): Promise<Attendance[]> {
    return this.attendanceRepo.find({
      where: { 
        employeeId, 
        tenantId,
        date: Between(startDate, endDate)
      },
      order: { date: 'DESC' }
    });
  }
}
