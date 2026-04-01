import { Injectable } from '@nestjs/common';
import { EmployeeProvider } from '../employee/employee.provider';
import { AttendanceProvider } from '../attendance/attendance.provider';
import { LeaveProvider } from '../leave/leave.provider';

@Injectable()
export class DashboardProvider {
  constructor(
    private readonly employeeProvider: EmployeeProvider,
    private readonly attendanceProvider: AttendanceProvider,
    private readonly leaveProvider: LeaveProvider,
  ) {}

  async getSummary(tenantId: string) {
    const headcount = await this.employeeProvider.getHeadcountStats(tenantId);
    const attendance = await this.attendanceProvider.getTodayStats(tenantId);
    const pendingLeaves = await this.leaveProvider.getPendingCount(tenantId);

    return {
      success: true,
      message: 'Dashboard summary fetched.',
      data: {
        headcount: {
          totalActive: headcount.totalActive,
          inProbation: headcount.inProbation,
        },
        todayAttendance: {
          present: attendance.presentToday,
          late: attendance.lateToday,
          absent: (headcount.totalActive + headcount.inProbation) - attendance.presentToday - attendance.lateToday,
        },
        approvals: {
          pendingLeaves,
        }
      }
    };
  }
}
