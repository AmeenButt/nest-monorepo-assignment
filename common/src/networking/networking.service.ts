import {
  AUTH_PATTERNS,
  GetUsersQueryDto,
  LoginResponseDto,
  LoginUserDto,
  PaginatedUsersResponseDto,
  RegisterUserDto,
  UserResponseDto,
} from '@app/common';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class NetworkingService {
  constructor(
    @Inject('AUTH_MICROSERVICE')
    private readonly authClient: ClientProxy,
  ) {}

  async registerUser(dto: RegisterUserDto): Promise<UserResponseDto> {
    try {
      return await firstValueFrom(
        this.authClient.send<UserResponseDto, RegisterUserDto>(
          AUTH_PATTERNS.REGISTER_USER,
          dto,
        ),
      );
    } catch (err: any) {
      this.handleRpcError(err);
    }
  }

  async getUsers(query: GetUsersQueryDto): Promise<PaginatedUsersResponseDto> {
    try {
      return await firstValueFrom(
        this.authClient.send<PaginatedUsersResponseDto>(
          AUTH_PATTERNS.GET_USERS,
          query,
        ),
      );
    } catch (err: any) {
      this.handleRpcError(err);
    }
  }
  async login(dto: LoginUserDto): Promise<LoginResponseDto> {
    try {
      return firstValueFrom(
        this.authClient.send<LoginResponseDto, LoginUserDto>(
          AUTH_PATTERNS.LOGIN,
          dto,
        ),
      );
    } catch (err: any) {
      this.handleRpcError(err);
    }
  }

  private handleRpcError(err: any): never {
    if (err instanceof HttpException) {
      throw err;
    }
    const status =
      (err?.status as number) ??
      (err?.error?.status as number) ??
      HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      (err?.message as string) ??
      (err?.error?.message as string) ??
      'Internal microservice error';

    throw new HttpException(message, status);
  }
}
