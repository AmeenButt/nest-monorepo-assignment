import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersRepository } from './user.repository';
import { RegisterUserDto, UserResponseDto, PaginatedUsersResponseDto, GetUsersQueryDto } from '@app/common';
import { HashingService } from './hashing.service';
import { RpcException } from '@nestjs/microservices';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly hashingService: HashingService,
  ) {}

  async registerUser(dto: RegisterUserDto): Promise<UserResponseDto> {
    const existing = await this.usersRepository.findByEmail(dto.email);
    if (existing) {
      throw new RpcException({
        status: HttpStatus.CONFLICT,
        message: 'Email already registered',
      });
    }
    const hashedPassword = await this.hashingService.hashPassword(dto.password);
    const user = await this.usersRepository.createUser({
      ...dto,
      password: hashedPassword,
    });

    return {
      id: user._id.toString(),
      email: user.email,
      profileImage: user.profileImage,
      name: user.name,
      isActive: user.isActive,
      updatedAt: user.updatedAt,
      createdAt: user.createdAt,
    };
  }

  async getAllUsers(query: GetUsersQueryDto): Promise<PaginatedUsersResponseDto> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const {items, total} = await this.usersRepository.findAll(page, limit);
    const users: UserResponseDto[] = items.map((user) => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));

    const totalPages = Math.ceil(total / limit);

    return {
      items: users,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) return null;

    const isMatch = await this.hashingService.comparePassword(password, user.password)
    if (!isMatch) return null;

    return user;
  }
}
