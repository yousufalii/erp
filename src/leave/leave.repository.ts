import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { LeaveRequest } from './entities/leave-request.entity';
import { LeaveEntitlement } from './entities/leave-entitlement.entity';
import { LeaveType, LeaveStatus } from '../lib/enums/leave.enum';

@Injectable()
export class LeaveRepository {
  constructor(
    @InjectRepository(LeaveRequest)
    private readonly requestRepo: Repository<LeaveRequest>,
    @InjectRepository(LeaveEntitlement)
    private readonly entitlementRepo: Repository<LeaveEntitlement>,
  ) {}

  async findEntitlement(employeeId: string, leaveType: LeaveType, year: number, tenantId: string): Promise<LeaveEntitlement | null> {
    return this.entitlementRepo.findOne({
      where: { employeeId, leaveType, year, tenantId }
    });
  }

  async findOverlapping(employeeId: string, start: Date, end: Date, tenantId: string): Promise<LeaveRequest[]> {
    return this.requestRepo.find({
      where: [
        { employeeId, tenantId, status: LeaveStatus.APPROVED, startDate: Between(start, end) },
        { employeeId, tenantId, status: LeaveStatus.APPROVED, endDate: Between(start, end) },
      ]
    });
  }

  async saveRequest(data: Partial<LeaveRequest>): Promise<LeaveRequest> {
    const request = this.requestRepo.create(data);
    return this.requestRepo.save(request);
  }

  async updateEntitlement(id: string, usedDays: number): Promise<void> {
    await this.entitlementRepo.update(id, { usedDays });
  }

  async findById(id: string, tenantId: string): Promise<LeaveRequest | null> {
    return this.requestRepo.findOne({
      where: { id, tenantId },
      relations: ['employee']
    });
  }

  async updateRequest(id: string, update: Partial<LeaveRequest>): Promise<LeaveRequest> {
    await this.requestRepo.update(id, update);
    return this.requestRepo.findOneBy({ id }) as Promise<LeaveRequest>;
  }

  async findRequestsForManager(managerId: string, tenantId: string): Promise<LeaveRequest[]> {
    return this.requestRepo.find({
      where: { 
        employee: { managerId }, 
        tenantId,
        status: LeaveStatus.PENDING 
      },
      relations: ['employee']
    });
  }

  async findMyRequests(employeeId: string, tenantId: string): Promise<LeaveRequest[]> {
    return this.requestRepo.find({
      where: { employeeId, tenantId },
      order: { createdAt: 'DESC' }
    });
  }

  async countPending(tenantId: string): Promise<number> {
    return this.requestRepo.count({ where: { tenantId, status: LeaveStatus.PENDING } });
  }

  async sumUnpaidLeaves(employeeId: string, month: number, year: number, tenantId: string): Promise<number> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const result = await this.requestRepo.createQueryBuilder('lr')
      .select('SUM(lr.totalDays)', 'total')
      .where('lr.employeeId = :employeeId', { employeeId })
      .andWhere('lr.tenantId = :tenantId', { tenantId })
      .andWhere('lr.leaveType = :type', { type: LeaveType.UNPAID })
      .andWhere('lr.status = :status', { status: LeaveStatus.APPROVED })
      .andWhere('lr.startDate BETWEEN :start AND :end', { start: startDate, end: endDate })
      .getRawOne();

    return Number(result.total || 0);
  }
}
