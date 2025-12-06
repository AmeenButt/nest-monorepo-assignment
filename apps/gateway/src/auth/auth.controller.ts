import { GetUsersQueryDto, LoginResponseDto, LoginUserDto, PaginatedUsersResponseDto, RegisterUserDto, UserResponseDto } from '@app/common';
import { Body, Controller, Get, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwtAuth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseInterceptors(FileInterceptor('profileImage'))
  async register(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: RegisterUserDto,
  ): Promise<UserResponseDto> {
    return this.authService.register({
      ...dto,
      profileImage: file ? `/uploads/profile-images/${file.filename}`:dto.profileImage
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('users')
  async getUsers(@Query() query: GetUsersQueryDto): Promise<PaginatedUsersResponseDto> {
    return this.authService.getUsers(query);
  }

  @Post('login')
  async login(
    @Body() dto: LoginUserDto,
  ): Promise<LoginResponseDto> {
    return this.authService.loginUser(dto);
  }
}
