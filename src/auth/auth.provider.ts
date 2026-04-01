import { Injectable } from '@nestjs/common';
import { UserProvider } from '../user/user.provider';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { BadRequestHandler, NotFoundHandler } from '../lib/helpers/responseHandlers';
import { UserStatus } from '../lib/enums/user.enum';

@Injectable()
export class AuthProvider {
  constructor(
    private readonly userProvider: UserProvider,
    private readonly authService: AuthService,
  ) {}

  async signup(payload: SignupDto) {
    const { role: roleName = 'EMPLOYEE', tenantId, ...userData } = payload;

    const existingUser = await this.userProvider.findOneByEmail(userData.email);
    BadRequestHandler({
      condition: !!existingUser,
      message: 'A user with this email already exists.',
    });

    const dbRole = await this.userProvider.findRoleByName(roleName, tenantId);
    NotFoundHandler({
      condition: !dbRole,
      message: `Role '${roleName}' not found for this tenant.`,
    });

    const hashedPassword = await this.authService.hashPassword(userData.password);
    
    const user = await this.userProvider.createUser({
      ...userData,
      password: hashedPassword,
      role: dbRole!,
      tenantId: tenantId,
      status: UserStatus.ACTIVE,
    });

    const { password, ...userWithoutPassword } = user;
    return {
      message: 'Account created successfully!',
      data: userWithoutPassword,
    };
  }

  async hashPassword(password: string): Promise<string> {
    return this.authService.hashPassword(password);
  }

  async login(payload: LoginDto) {
    const user = await this.userProvider.findOneByEmail(payload.email);
    BadRequestHandler({
      condition: !user,
      message: 'Invalid email or password.',
    });

    const isPasswordValid = await this.authService.comparePassword(
      payload.password,
      user!.password,
    );
    BadRequestHandler({
      condition: !isPasswordValid,
      message: 'Invalid email or password.',
    });

    const token = await this.authService.generateToken({
      sub: user!.id,
      email: user!.email,
      tenantId: user!.tenantId,
    });

    const { password, ...userWithoutPassword } = user!;
    return {
      message: 'Login successful!',
      data: {
        user: userWithoutPassword,
        token,
      },
    };
  }
}
