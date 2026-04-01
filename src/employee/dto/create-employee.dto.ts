import { IsString, IsNotEmpty, IsEmail, IsEnum, IsOptional, IsDateString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Gender, EmployeeStatus, EmploymentType } from '../../lib/enums/employee.enum';

export class CreateEmployeeDto {
  @ApiProperty({ example: 'Alice' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Smith' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'EMP-001' })
  @IsString()
  @IsNotEmpty()
  employeeCode: string;

  @ApiProperty({ example: 'alice@company.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: '03001234567' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ enum: Gender, example: Gender.FEMALE })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({ example: '1995-10-25' })
  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @ApiProperty({ example: '2024-04-01' })
  @IsDateString()
  @IsNotEmpty()
  joinDate: string;

  @ApiProperty({ enum: EmploymentType, example: EmploymentType.FULL_TIME })
  @IsEnum(EmploymentType)
  employmentType: EmploymentType;

  @ApiProperty({ enum: EmployeeStatus, example: EmployeeStatus.PROBATION })
  @IsEnum(EmployeeStatus)
  status: EmployeeStatus;

  @ApiProperty({ example: 'Software Engineer' })
  @IsString()
  @IsOptional()
  designation?: string;

  @ApiProperty({ example: 'Engineering' })
  @IsString()
  @IsOptional()
  department?: string;

  @ApiProperty({ example: 'IBAN1234567890' })
  @IsString()
  @IsOptional()
  iban?: string;

  @ApiProperty({ example: 'uuid-of-manager', required: false })
  @IsString()
  @IsUUID()
  @IsOptional()
  managerId?: string;
}
