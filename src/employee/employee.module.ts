import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { EmployeeRepository } from './employee.repository';
import { EmployeeProvider } from './employee.provider';
import { EmployeeController } from './employee.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Employee])],
  controllers: [EmployeeController],
  providers: [EmployeeRepository, EmployeeProvider],
  exports: [EmployeeProvider, EmployeeRepository],
})
export class EmployeeModule {}
