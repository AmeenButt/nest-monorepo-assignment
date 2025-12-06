import { UserResponseDto } from "./userResponse.dto";

class PaginationMetaDto {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class PaginatedUsersResponseDto {
  items: UserResponseDto[];
  meta: PaginationMetaDto;
}