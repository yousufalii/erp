import { Injectable } from '@nestjs/common';
import { PerformanceRepository } from './performance.repository';
import { EmployeeProvider } from '../employee/employee.provider';
import { AppraisalStatus, PerformanceRating } from '../lib/enums/performance.enum';
import { NotFoundHandler, BadRequestHandler } from '../lib/helpers/responseHandlers';
import { NotificationProvider } from '../notification/notification.provider';
import { NotificationType, NotificationPriority } from '../lib/enums/notification.enum';

@Injectable()
export class PerformanceProvider {
  constructor(
    private readonly repository: PerformanceRepository,
    private readonly employeeProvider: EmployeeProvider,
    private readonly notificationProvider: NotificationProvider,
  ) {}

  async setMetric(payload: any, tenantId: string) {
    const employee = await this.employeeProvider.findOne(payload.employeeId, tenantId);
    return this.repository.saveMetric({ ...payload, tenantId });
  }

  async getMyPerformanceSummary(userId: string, tenantId: string, year: number) {
    const employee = await this.employeeProvider.findOneByUserId(userId, tenantId);
    NotFoundHandler({ condition: !employee, message: 'Employee profile not linked.' });

    const metrics = await this.repository.findMetricsByEmployee(employee!.id, year, tenantId);
    return { metrics };
  }

  async initiateAppraisal(employeeId: string, year: number, cycle: number, tenantId: string) {
    const employee = await this.employeeProvider.findOne(employeeId, tenantId);
    
    const record = await this.repository.saveAppraisal({
      employeeId,
      tenantId,
      year,
      cycle,
      status: AppraisalStatus.SELF_ASSESSMENT,
      managerId: employee.managerId,
    });

    if (employee.user) {
      await this.notificationProvider.notify(
        employee.user.id,
        tenantId,
        'Appraisal Cycle Initiated',
        `Your mid-year performance review for ${year} is now open for self-assessment.`,
        NotificationType.SYSTEM,
        NotificationPriority.HIGH
      );
    }

    return record;
  }

  async submitSelfAssessment(appraisalId: string, rating: PerformanceRating, comments: string, userId: string, tenantId: string) {
    const appraisal = await this.repository.findAppraisalById(appraisalId, tenantId);
    NotFoundHandler({ condition: !appraisal, message: 'Appraisal record not found.' });

    const employee = await this.employeeProvider.findOneByUserId(userId, tenantId);
    BadRequestHandler({ condition: appraisal!.employeeId !== employee?.id, message: 'Unauthorized review submission.' });

    appraisal!.selfRating = rating;
    appraisal!.selfAssessment = comments;
    appraisal!.status = AppraisalStatus.MANAGER_ASSESSMENT;

     return this.repository.saveAppraisal(appraisal!);
  }

  async managerReview(appraisalId: string, rating: PerformanceRating, comments: string, tenantId: string) {
    const appraisal = await this.repository.findAppraisalById(appraisalId, tenantId);
    NotFoundHandler({ condition: !appraisal, message: 'Appraisal record not found.' });
    
    appraisal!.managerRating = rating;
    appraisal!.managerAssessment = comments;
    appraisal!.status = AppraisalStatus.FINALIZED;

    const record = await this.repository.saveAppraisal(appraisal!);

    if (appraisal!.employee.user) {
        await this.notificationProvider.notify(
          appraisal!.employee.user.id,
          tenantId,
          'Performance Appraisal Finalized',
          `Your manager has completed your review. Final rating: ${rating}.`,
          NotificationType.SYSTEM,
          NotificationPriority.HIGH
        );
    }

    return record;
  }
}
