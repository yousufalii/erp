import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResignEmployeeDto {
  @ApiProperty({ example: '2024-05-10', description: 'Proposed last working day' })
  @IsDateString()
  @IsNotEmpty()
  lastWorkingDay: string;

  @ApiProperty({ example: 'Better career opportunities.' })
  @IsString()
  @IsOptional()
  reason?: string;
}

export class TerminateEmployeeDto {
  @ApiProperty({ example: 'Performance issues.' })
  @IsString()
  @IsNotEmpty()
  reason: string;

  @ApiProperty({ example: '2024-04-15', description: 'Final working day' })
  @IsDateString()
  @IsNotEmpty()
  lastWorkingDay: string;
}
