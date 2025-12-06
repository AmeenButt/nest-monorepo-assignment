import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { GetUsersQueryDto, LoginResponseDto, LoginUserDto, NetworkingService, PaginatedUsersResponseDto, RegisterUserDto, UserResponseDto } from '@app/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly networkingService: NetworkingService,
  ) {}

  register(dto: RegisterUserDto): Promise<UserResponseDto> {
    return this.networkingService.registerUser(dto);
  }

  getUsers(query: GetUsersQueryDto): Promise<PaginatedUsersResponseDto> {
    return this.networkingService.getUsers(query);
  }

  loginUser(dto: LoginUserDto): Promise<LoginResponseDto>{
    return this.networkingService.login(dto);
  }
}
