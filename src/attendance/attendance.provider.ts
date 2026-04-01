import { Injectable } from '@nestjs/common';
import { AttendanceRepository } from './attendance.repository';
import { EmployeeProvider } from '../employee/employee.provider';
import { AttendanceStatus } from '../lib/enums/attendance.enum';
import { BadRequestHandler, NotFoundHandler } from '../lib/helpers/responseHandlers';
import { Attendance } from './entities/attendance.entity';

import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@Injectable()
export class AttendanceProvider {
  constructor(
    private readonly repository: AttendanceRepository,
    private readonly employeeProvider: EmployeeProvider,
  ) {}

  async findOne(id: string, tenantId: string): Promise<Attendance> {
    const record = await this.repository.findById(id, tenantId);
    NotFoundHandler({ condition: !record, message: 'Attendance record not found.' });
    return record!;
  }

  async update(id: string, payload: UpdateAttendanceDto, tenantId: string): Promise<Attendance> {
    const record = await this.findOne(id, tenantId);
    
    let durationHours = record.totalHours;
    if (payload.checkIn || payload.checkOut) {
      const start = payload.checkIn ? new Date(payload.checkIn) : record.checkIn;
      const end = payload.checkOut ? new Date(payload.checkOut) : record.checkOut;
      if (start && end) {
        durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      }
    }

    return this.repository.saveRecord({
      id,
      ...payload,
      checkIn: payload.checkIn ? new Date(payload.checkIn) : undefined,
      checkOut: payload.checkOut ? new Date(payload.checkOut) : undefined,
      totalHours: Number(durationHours.toFixed(2)),
      isManualOverride: true,
    });
  }

  async checkIn(userId: string, tenantId: string): Promise<Attendance> {
    const employee = await this.employeeProvider.findOneByUserId(userId, tenantId);
    NotFoundHandler({ condition: !employee, message: 'Employee profile not associated with this account.' });

    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    const existingRecord = await this.repository.findTodayRecord(employee!.id, tenantId, todayDate);
    BadRequestHandler({ condition: !!existingRecord, message: 'You have already checked in for today.' });

    const policy = await this.repository.findActivePolicy(tenantId);
    const now = new Date();
    
    // Status Logic
    let status = AttendanceStatus.PRESENT;
    if (policy) {
      const shiftStartTime = new Date();
      const [h, m] = policy.shiftStart.split(':').map(Number);
      shiftStartTime.setHours(h, m, 0, 0);
      
      const lateThreshold = new Date(shiftStartTime.getTime() + policy.graceMinutes * 60000);
      if (now > lateThreshold) {
        status = AttendanceStatus.LATE;
      }
    }

    return this.repository.saveRecord({
      employeeId: employee!.id,
      tenantId,
      date: todayDate,
      checkIn: now,
      status,
    });
  }

  async checkOut(userId: string, tenantId: string): Promise<Attendance> {
    const employee = await this.employeeProvider.findOneByUserId(userId, tenantId);
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    const record = await this.repository.findTodayRecord(employee!.id, tenantId, todayDate);
    BadRequestHandler({ condition: !record, message: 'No check-in record found for today.' });
    BadRequestHandler({ condition: !!record!.checkOut, message: 'You have already checked out for today.' });

    const now = new Date();
    const checkInTime = record!.checkIn.getTime();
    const durationHours = (now.getTime() - checkInTime) / (1000 * 60 * 60);

    // Re-evaluate status for Half Day if threshold not met
    let currentStatus = record!.status;
    const policy = await this.repository.findActivePolicy(tenantId);
    if (policy && durationHours < policy.halfDayThreshold) {
      currentStatus = AttendanceStatus.HALF_DAY;
    }

    return this.repository.saveRecord({
      id: record!.id,
      checkOut: now,
      totalHours: Number(durationHours.toFixed(2)),
      status: currentStatus,
    });
  }

  async getMyLogs(userId: string, tenantId: string, month: number, year: number): Promise<Attendance[]> {
    const employee = await this.employeeProvider.findOneByUserId(userId, tenantId);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    return this.repository.findLogs(employee!.id, tenantId, startDate, endDate);
  }

  async getTodayStats(tenantId: string) {
    const presentCount = await this.repository.countTodayByStatus(AttendanceStatus.PRESENT, tenantId);
    const lateCount = await this.repository.countTodayByStatus(AttendanceStatus.LATE, tenantId);
    return { presentToday: presentCount, lateToday: lateCount };
  }
}
