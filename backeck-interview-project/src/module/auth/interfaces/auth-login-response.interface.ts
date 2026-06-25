import { UsersResponseDto } from 'src/module/users/dtos/users-response.dto';

export interface AuthLoginResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
  user: UsersResponseDto;
}
