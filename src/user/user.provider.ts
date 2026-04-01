import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { BadRequestHandler, NotFoundHandler } from '../lib/helpers/responseHandlers';

@Injectable()
export class UserProvider {
  constructor(private readonly userRepository: UserRepository) {}

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  // --- Role Management ---

  async createRole(data: Partial<Role>, tenantId: string): Promise<Role> {
    const existing = await this.userRepository.findRoleByName(data.name!, tenantId);
    BadRequestHandler({
      condition: !!existing,
      message: 'Role with this name already exists in your organization.',
    });
    return this.userRepository.createRole({ ...data, tenantId });
  }

  async updateRole(id: string, data: Partial<Role>, tenantId: string): Promise<Role> {
    const role = await this.userRepository.findRoleById(id, tenantId);
    NotFoundHandler({ condition: !role, message: 'Role not found.' });
    return this.userRepository.updateRole(id, data);
  }

  async findAllRoles(tenantId: string): Promise<Role[]> {
    return this.userRepository.findAllRoles(tenantId);
  }

  async findRoleById(id: string, tenantId: string): Promise<Role> {
    const role = await this.userRepository.findRoleById(id, tenantId);
    NotFoundHandler({ condition: !role, message: 'Role not found.' });
    return role!;
  }

  async findRoleByName(name: string, tenantId: string): Promise<Role | null> {
    return this.userRepository.findRoleByName(name, tenantId);
  }

  // --- User Management ---

  async createUser(data: Partial<User>): Promise<User> {
    // Basic exist check should be in AuthProvider but we can add one here too
    return this.userRepository.createUser(data);
  }

  async findOneById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }
}
