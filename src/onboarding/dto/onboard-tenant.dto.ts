import { IsString, IsNotEmpty, IsOptional, IsEmail, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class AdminUserDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'admin@company.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'SecurePassword123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class OnboardTenantDto {
  @ApiProperty({ example: 'Acme Corp' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'acme' })
  @IsString()
  @IsNotEmpty()
  subdomain: string;

  @ApiProperty({ example: 'Technology', required: false })
  @IsString()
  @IsOptional()
  industry?: string;

  @ApiProperty({ example: '123 Business St', required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ example: 'USD', required: false })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({ type: AdminUserDto })
  @IsObject()
  @ValidateNested()
  @Type(() => AdminUserDto)
  admin: AdminUserDto;
}
