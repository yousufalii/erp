import { Injectable } from '@nestjs/common';
import { DocumentRepository } from './document.repository';
import { EmployeeProvider } from './employee.provider';
import { UploadDocumentDto } from './dto/document-upload.dto';
import { EmployeeDocument } from './entities/employee-document.entity';
import { NotFoundHandler } from '../lib/helpers/responseHandlers';

@Injectable()
export class DocumentProvider {
  constructor(
    private readonly repository: DocumentRepository,
    private readonly employeeProvider: EmployeeProvider,
  ) {}

  async saveDocument(
    payload: UploadDocumentDto,
    fileMeta: { url: string; originalName: string; size: number; mime: string },
    tenantId: string
  ): Promise<EmployeeDocument> {
    const employee = await this.employeeProvider.findOne(payload.employeeId, tenantId);
    
    return this.repository.save({
      ...payload,
      tenantId,
      fileUrl: fileMeta.url,
      fileName: fileMeta.originalName,
      fileSize: fileMeta.size,
      mimeType: fileMeta.mime,
      expiryDate: payload.expiryDate ? new Date(payload.expiryDate) : undefined,
    });
  }

  async getEmployeeDocuments(employeeId: string, tenantId: string): Promise<EmployeeDocument[]> {
    return this.repository.findByEmployee(employeeId, tenantId);
  }

  async deleteDocument(id: string, tenantId: string): Promise<void> {
    const doc = await this.repository.findById(id, tenantId);
    NotFoundHandler({ condition: !doc, message: 'Document record not found.' });
    await this.repository.softDelete(id, tenantId);
  }
}
