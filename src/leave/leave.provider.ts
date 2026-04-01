import { Injectable } from '@nestjs/common';
import { LeaveRepository } from './leave.repository';
import { EmployeeProvider } from '../employee/employee.provider';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { LeaveStatus, LeaveType } from '../lib/enums/leave.enum';
import { BadRequestHandler, NotFoundHandler } from '../lib/helpers/responseHandlers';
import { LeaveRequest } from './entities/leave-request.entity';

@Injectable()
export class LeaveProvider {
  constructor(
    private readonly repository: LeaveRepository,
    private readonly employeeProvider: EmployeeProvider,
  ) {}

  async applyLeave(userId: string, tenantId: string, payload: CreateLeaveRequestDto): Promise<LeaveRequest> {
    const employee = await this.employeeProvider.findOneByUserId(userId, tenantId);
    NotFoundHandler({ condition: !employee, message: 'Employee profile not linked.' });

    const start = new Date(payload.startDate);
    const end = new Date(payload.endDate);
    const today = new Date();
    today.setHours(0,0,0,0);

    BadRequestHandler({ condition: start < today, message: 'Leave start date cannot be in the past.' });
    BadRequestHandler({ condition: start > end, message: 'Start date must be before end date.' });

    // Calculate duration
    let duration = ((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    if (payload.isHalfDay) duration = 0.5;

    // Check Balance
    if (payload.leaveType !== LeaveType.UNPAID) {
      const entitlement = await this.repository.findEntitlement(employee!.id, payload.leaveType, start.getFullYear(), tenantId);
      BadRequestHandler({ condition: !entitlement, message: `No entitlement found for ${payload.leaveType} in ${start.getFullYear()}.` });
      
      const remaining = Number(entitlement!.totalDays) - Number(entitlement!.usedDays);
      BadRequestHandler({ condition: duration > remaining, message: `Insufficient balance. Available: ${remaining} days.` });
    }

    // Overlap Check
    const overlaps = await this.repository.findOverlapping(employee!.id, start, end, tenantId);
    BadRequestHandler({ condition: overlaps.length > 0, message: 'Overlapping leave request found for these dates.' });

    return this.repository.saveRequest({
      ...payload,
      employeeId: employee!.id,
      tenantId,
      startDate: start,
      endDate: end,
      totalDays: duration,
      status: LeaveStatus.PENDING,
    });
  }

  async approveLeave(requestId: string, approverUserId: string, tenantId: string): Promise<LeaveRequest> {
    const request = await this.repository.findById(requestId, tenantId);
    NotFoundHandler({ condition: !request, message: 'Request not found.' });
    BadRequestHandler({ condition: request!.status !== LeaveStatus.PENDING, message: 'Request is no longer pending.' });

    // Update Request
    const updated = await this.repository.updateRequest(requestId, {
      status: LeaveStatus.APPROVED,
      approvedById: approverUserId
    });

    // Deduct Balance
    if (request!.leaveType !== LeaveType.UNPAID) {
       const ent = await this.repository.findEntitlement(request!.employeeId, request!.leaveType, request!.startDate.getFullYear(), tenantId);
       if (ent) {
          await this.repository.updateEntitlement(ent.id, Number(ent.usedDays) + Number(request!.totalDays));
       }
    }

    return updated;
  }

  async rejectLeave(requestId: string, reason: string, approverUserId: string, tenantId: string): Promise<LeaveRequest> {
    return this.repository.updateRequest(requestId, {
      status: LeaveStatus.REJECTED,
      approvedById: approverUserId,
      rejectionReason: reason
    });
  }

  async cancelLeave(requestId: string, userId: string, tenantId: string): Promise<LeaveRequest> {
    const employee = await this.employeeProvider.findOneByUserId(userId, tenantId);
    const request = await this.repository.findById(requestId, tenantId);
    
    NotFoundHandler({ condition: !request, message: 'Request not found.' });
    BadRequestHandler({ condition: request!.employeeId !== employee!.id, message: 'Unauthorized cancellation.' });
    BadRequestHandler({ condition: request!.status !== LeaveStatus.PENDING, message: 'Only pending requests can be cancelled.' });

    return this.repository.updateRequest(requestId, { status: LeaveStatus.CANCELLED });
  }

  async getMyRequests(userId: string, tenantId: string): Promise<LeaveRequest[]> {
    const employee = await this.employeeProvider.findOneByUserId(userId, tenantId);
    return this.repository.findMyRequests(employee!.id, tenantId);
  }

  async getPendingRequestsForManager(userId: string, tenantId: string): Promise<LeaveRequest[]> {
    const employee = await this.employeeProvider.findOneByUserId(userId, tenantId);
    return this.repository.findRequestsForManager(employee!.id, tenantId);
  }
}
