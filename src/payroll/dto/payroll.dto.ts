import { IsNotEmpty, IsNumber, IsUUID, IsOptional, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSalaryStructureDto {
  @ApiProperty({ example: 'uuid-of-employee' })
  @IsUUID()
  @IsNotEmpty()
  employeeId: string;

  @ApiProperty({ example: 50000 })
  @IsNumber()
  @Min(0)
  basicSalary: number;

  @ApiProperty({ example: 15000 })
  @IsNumber()
  @IsOptional()
  houseAllowance?: number;

  @ApiProperty({ example: 5000 })
  @IsNumber()
  @IsOptional()
  transportAllowance?: number;

  @ApiProperty({ example: 2000 })
  @IsNumber()
  @IsOptional()
  taxDeduction?: number;

  @ApiProperty({ example: 1000 })
  @IsNumber()
  @IsOptional()
  providentFund?: number;
}

export class GeneratePayrollDto {
  @ApiProperty({ example: 4 })
  @IsNumber()
  @Min(1)
  @Max(12)
  month: number;

  @ApiProperty({ example: 2026 })
  @IsNumber()
  @Min(2020)
  year: number;
}
