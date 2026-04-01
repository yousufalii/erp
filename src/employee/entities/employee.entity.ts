import { Entity, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { BaseTenantEntity } from '../../lib/entities/base.entity';
import { User } from '../../user/entities/user.entity';
import { Gender, EmployeeStatus, EmploymentType } from '../../lib/enums/employee.enum';

@Entity('employees')
export class Employee extends BaseTenantEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  employeeCode: string; // ID assigned by organization

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'enum', enum: Gender, default: Gender.MALE })
  gender: Gender;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ nullable: true })
  cnic: string;

  @Column({ nullable: true })
  address: string;

  // --- Employment Information ---

  @Column({ type: 'date' })
  joinDate: Date;

  @Column({ type: 'enum', enum: EmploymentType, default: EmploymentType.FULL_TIME })
  employmentType: EmploymentType;

  @Column({ type: 'enum', enum: EmployeeStatus, default: EmployeeStatus.PROBATION })
  status: EmployeeStatus;

  @Column({ nullable: true })
  designation: string;

  @Column({ nullable: true })
  department: string;

  // --- Bank Details ---

  @Column({ nullable: true })
  bankName: string;

  @Column({ nullable: true })
  accountTitle: string;

  @Column({ nullable: true })
  iban: string;

  // --- Relationships ---

  @OneToOne(() => User, { nullable: true })
  @JoinColumn()
  user: User; // Optional login account link

  @ManyToOne(() => Employee, { nullable: true })
  @JoinColumn({ name: 'managerId' })
  manager: Employee; // Hierarchical reporting line

  @Column({ nullable: true })
  managerId: string;
}
