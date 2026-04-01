import { Controller, Post, Body } from '@nestjs/common';
import { AuthProvider } from './auth.provider';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authProvider: AuthProvider) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  async signup(@Body() payload: SignupDto) {
    return this.authProvider.signup(payload);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login and receive access token' })
  async login(@Body() payload: LoginDto) {
    return this.authProvider.login(payload);
  }
}
