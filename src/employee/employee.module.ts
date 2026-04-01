import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { User } from '../user/entities/user.entity';
import { EmployeeDocument } from './entities/employee-document.entity';
import { EmployeeRepository } from './employee.repository';
import { DocumentRepository } from './document.repository';
import { EmployeeProvider } from './employee.provider';
import { LifecycleProvider } from './lifecycle.provider';
import { DocumentProvider } from './document.provider';
import { EmployeeController } from './employee.controller';
import { LifecycleController } from './lifecycle.controller';
import { DocumentController } from './document.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Employee, User, EmployeeDocument])],
  controllers: [EmployeeController, LifecycleController, DocumentController],
  providers: [
    EmployeeRepository, 
    DocumentRepository, 
    EmployeeProvider, 
    LifecycleProvider, 
    DocumentProvider
  ],
  exports: [EmployeeProvider],
})
export class EmployeeModule {}
