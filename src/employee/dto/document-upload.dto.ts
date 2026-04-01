import { IsEnum, IsNotEmpty, IsOptional, IsDateString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DocumentType } from '../../lib/enums/document.enum';

export class UploadDocumentDto {
  @ApiProperty({ example: 'uuid-of-employee' })
  @IsUUID()
  @IsNotEmpty()
  employeeId: string;

  @ApiProperty({ enum: DocumentType, example: DocumentType.CNIC })
  @IsEnum(DocumentType)
  @IsNotEmpty()
  documentType: DocumentType;

  @ApiProperty({ example: '2030-12-31', required: false })
  @IsDateString()
  @IsOptional()
  expiryDate?: string;
}
