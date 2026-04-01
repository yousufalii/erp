import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PerformanceMetric } from './entities/performance-metric.entity';
import { PerformanceAppraisal } from './entities/performance-appraisal.entity';
import { AppraisalStatus } from '../lib/enums/performance.enum';

@Injectable()
export class PerformanceRepository {
  constructor(
    @InjectRepository(PerformanceMetric)
    private readonly metricRepo: Repository<PerformanceMetric>,
    @InjectRepository(PerformanceAppraisal)
    private readonly appraisalRepo: Repository<PerformanceAppraisal>,
  ) {}

  async saveMetric(data: Partial<PerformanceMetric>): Promise<PerformanceMetric> {
    const metric = this.metricRepo.create(data);
    return this.metricRepo.save(metric);
  }

  async findMetricsByEmployee(employeeId: string, year: number, tenantId: string): Promise<PerformanceMetric[]> {
    return this.metricRepo.find({
      where: { employeeId, year, tenantId, isActive: true },
    });
  }

  async saveAppraisal(data: Partial<PerformanceAppraisal>): Promise<PerformanceAppraisal> {
    const appraisal = this.appraisalRepo.create(data);
    return this.appraisalRepo.save(appraisal);
  }

  async findAppraisalsForManager(managerId: string, tenantId: string): Promise<PerformanceAppraisal[]> {
    return this.appraisalRepo.find({
      where: { managerId, tenantId },
      relations: ['employee'],
    });
  }

  async findAppraisalById(id: string, tenantId: string): Promise<PerformanceAppraisal | null> {
    return this.appraisalRepo.findOne({
      where: { id, tenantId },
      relations: ['employee'],
    });
  }

  async updateAppraisalStatus(id: string, status: AppraisalStatus): Promise<void> {
    await this.appraisalRepo.update(id, { status });
  }
}
