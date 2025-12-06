import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { RegisterUserDto, AUTH_PATTERNS, GetUsersQueryDto } from '@app/common';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern(AUTH_PATTERNS.REGISTER_USER)
  async handleRegister(@Payload() dto: RegisterUserDto) {
    return this.usersService.registerUser(dto);
  }

  @MessagePattern(AUTH_PATTERNS.GET_USERS)
  async handleGetUsers(@Payload() query: GetUsersQueryDto) {
    return this.usersService.getAllUsers(query);
  }
}
