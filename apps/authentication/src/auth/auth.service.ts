import {
  ConflictException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginUserDto, LoginResponseDto, UserResponseDto } from '@app/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginUserDto): Promise<LoginResponseDto> {
    const user = await this.usersService.validateUser(dto.email, dto.password);
    if (!user) {
      throw new RpcException({
        status: HttpStatus.CONFLICT,
        message: 'Invalid Credentials',
      });
    }

    const payload = {
      sub: user._id.toString(),
      email: user.email,
    };

    const token = await this.jwtService.signAsync(payload);

    const userResponse: UserResponseDto = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return {
      accessToken: token,
      user: userResponse,
    };
  }
}
