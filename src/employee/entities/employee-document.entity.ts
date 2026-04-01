import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseTenantEntity } from '../../lib/entities/base.entity';
import { Employee } from '../../employee/entities/employee.entity';
import { DocumentType } from '../../lib/enums/document.enum';

@Entity('employee_documents')
export class EmployeeDocument extends BaseTenantEntity {
  @ManyToOne(() => Employee, { nullable: false })
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

  @Column()
  employeeId: string;

  @Column({ type: 'enum', enum: DocumentType })
  documentType: DocumentType;

  @Column()
  fileName: string;

  @Column()
  fileUrl: string; // Storage URL (S3/Local)

  @Column({ nullable: true })
  fileSize: number; // in KB/MB

  @Column({ nullable: true })
  mimeType: string;

  @Column({ type: 'date', nullable: true })
  expiryDate: Date; // e.g. for Passport

  @Column({ default: true })
  isActive: boolean;
}
