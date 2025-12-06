export class UserResponseDto {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}