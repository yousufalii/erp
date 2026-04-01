import { 
  Controller, 
  Post, 
  Get, 
  Delete, 
  Param, 
  Body, 
  UseInterceptors, 
  UploadedFile, 
  UseGuards 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentProvider } from './document.provider';
import { UploadDocumentDto } from './dto/document-upload.dto';
import { JwtAuthGuard } from '../lib/guards/jwt-auth.guard';
import { RolesGuard } from '../lib/guards/roles.guard';
import { PermissionsGuard } from '../lib/guards/permissions.guard';
import { Roles } from '../lib/decorators/roles.decorator';
import { UserRoles } from '../lib/enums/user.enum';
import { CurrentUser } from '../lib/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';
import { ResponseDto } from '../lib/dto/response.dto';
import { Activity } from '../lib/decorators/activity.decorator';

@ApiTags('Document Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@Controller('documents')
export class DocumentController {
  constructor(private readonly provider: DocumentProvider) {}

  @Post('upload')
  @Roles(UserRoles.ADMIN, UserRoles.HR_MANAGER)
  @Activity({ action: 'UPLOAD_DOCUMENT', module: 'HRM' })
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload an employee document (CNIC, Degree, Contract)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        employeeId: { type: 'string' },
        documentType: { type: 'string', enum: ['CNIC', 'PASSPORT', 'OFFER_LETTER', 'CONTRACT', 'CERTIFICATE', 'DEGREE', 'PHOTO', 'OTHER'] },
        expiryDate: { type: 'string', format: 'date', nullable: true },
      },
    }
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({ status: 201, type: ResponseDto, description: 'Document uploaded and linked successfully.' })
  async upload(
    @UploadedFile() file: any,
    @Body() payload: UploadDocumentDto,
    @CurrentUser() user: User
  ) {
    // In a real S3 scenario, here we call S3 service to get the URL
    // For now, simulating with a local-like path or mock URL for premium feel
    const fileMeta = {
      url: `https://storage.hr-erp.com/uploads/${Date.now()}-${file.originalname}`,
      originalName: file.originalname,
      size: file.size,
      mime: file.mimetype,
    };

    return this.provider.saveDocument(payload, fileMeta, user.tenantId);
  }

  @Get('employee/:id')
  @Roles(UserRoles.ADMIN, UserRoles.HR_MANAGER)
  @ApiOperation({ summary: 'Fetch all digital records for a specific employee' })
  @ApiResponse({ status: 200, type: ResponseDto, isArray: true })
  async findByEmployee(@Param('id') employeeId: string, @CurrentUser() user: User) {
    return this.provider.getEmployeeDocuments(employeeId, user.tenantId);
  }

  @Delete(':id')
  @Roles(UserRoles.ADMIN, UserRoles.HR_MANAGER)
  @Activity({ action: 'DELETE_DOCUMENT', module: 'HRM' })
  @ApiOperation({ summary: 'Archive a digital record' })
  @ApiResponse({ status: 200, type: ResponseDto })
  async remove(@Param('id') id: string, @CurrentUser() user: User) {
    await this.provider.deleteDocument(id, user.tenantId);
    return { success: true, message: 'Document archived successfully.' };
  }
}
