import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { UserProvider } from './user.provider';
import { UserRepository } from './user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  providers: [UserProvider, UserRepository],
  exports: [UserProvider, TypeOrmModule],
})
export class UserModule {}
