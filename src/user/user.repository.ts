import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({
      where: { email },
      relations: ['role'],
      select: ['id', 'email', 'password', 'status'],
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { id }, relations: ['role'] });
  }

  async createUser(data: Partial<User>): Promise<User> {
    const user = this.userRepo.create(data);
    return this.userRepo.save(user);
  }

  async findRoleByName(name: string, tenantId: string): Promise<Role | null> {
    return this.roleRepo.findOne({ where: { name, tenantId } });
  }

  async findRoleById(id: string, tenantId: string): Promise<Role | null> {
    return this.roleRepo.findOne({ where: { id, tenantId } });
  }

  async findAllRoles(tenantId: string): Promise<Role[]> {
    return this.roleRepo.find({ where: { tenantId }, order: { name: 'ASC' } });
  }

  async createRole(data: Partial<Role>): Promise<Role> {
    const role = this.roleRepo.create(data);
    return this.roleRepo.save(role);
  }

  async updateRole(id: string, data: Partial<Role>): Promise<Role> {
    await this.roleRepo.update(id, data);
    return this.roleRepo.findOne({ where: { id } }) as Promise<Role>;
  }
}
