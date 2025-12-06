import { IsEmail, IsOptional, IsString, MinLength, IsBoolean, IsUrl } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsUrl()
  @IsOptional()
  profileImage?: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;
}