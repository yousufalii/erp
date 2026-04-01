import { IsEnum, IsOptional, IsDateString, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AttendanceStatus } from '../../lib/enums/attendance.enum';

export class UpdateAttendanceDto {
  @ApiProperty({ example: '2024-04-01T09:00:00Z', required: false })
  @IsDateString()
  @IsOptional()
  checkIn?: string;

  @ApiProperty({ example: '2024-04-01T18:00:00Z', required: false })
  @IsDateString()
  @IsOptional()
  checkOut?: string;

  @ApiProperty({ enum: AttendanceStatus, example: AttendanceStatus.PRESENT, required: false })
  @IsEnum(AttendanceStatus)
  @IsOptional()
  status?: AttendanceStatus;

  @ApiProperty({ example: 'Employee forgot to clock out.', description: 'Mandatory reason for manual override' })
  @IsString()
  @IsNotEmpty()
  remarks: string;
}
