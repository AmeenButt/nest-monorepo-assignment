import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { LoginUserDto, AUTH_PATTERNS, LoginResponseDto } from '@app/common';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(AUTH_PATTERNS.LOGIN)
  async handleLogin(@Payload() dto: LoginUserDto): Promise<LoginResponseDto> {
    return this.authService.login(dto);
  }
}
