import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { RoleController } from './role.controller';

@Module({
  imports: [UserModule], // Need UserProvider for Role management
  controllers: [RoleController],
  providers: [],
})
export class SettingModule {}
