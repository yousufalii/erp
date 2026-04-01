import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAttendancePolicyDto {
  @ApiProperty({ example: '09:00' })
  @IsString()
  @IsNotEmpty()
  shiftStart: string;

  @ApiProperty({ example: '18:00' })
  @IsString()
  @IsNotEmpty()
  shiftEnd: string;

  @ApiProperty({ example: 15 })
  @IsNumber()
  graceMinutes: number;

  @ApiProperty({ example: 4.5 })
  @IsNumber()
  halfDayThreshold: number;

  @ApiProperty({ example: ['Saturday', 'Sunday'], required: false })
  @IsArray()
  @IsOptional()
  weeklyOffDays?: string[];
}
