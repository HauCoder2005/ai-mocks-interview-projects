import { ApiResponse, request } from "../../core";
import { ApiHttpMethod } from "../../core/enums/api-method.enum";
import {
  AuthLoginResponseDto,
  GoogleLoginRequestDto,
  LoginRequestDto,
  RegisterRequestDto,
  VerifyAccountRequestDto,
} from "./auth.dto";

const AUTH_PATH = "/auth";

export const authService = {
  register(dto: RegisterRequestDto): Promise<ApiResponse<null>> {
    return request<ApiResponse<null>>(`${AUTH_PATH}/register`, {
      method: ApiHttpMethod.POST,
      body: JSON.stringify(dto),
      auth: false,
    });
  },

  login(dto: LoginRequestDto): Promise<ApiResponse<AuthLoginResponseDto>> {
    return request<ApiResponse<AuthLoginResponseDto>>(`${AUTH_PATH}/login`, {
      method: ApiHttpMethod.POST,
      body: JSON.stringify(dto),
      auth: false,
    });
  },

  verifyAccount(dto: VerifyAccountRequestDto): Promise<ApiResponse<null>> {
    return request<ApiResponse<null>>(`${AUTH_PATH}/verify-account`, {
      method: ApiHttpMethod.POST,
      body: JSON.stringify(dto),
      auth: false,
    });
  },

  googleLogin(
    dto: GoogleLoginRequestDto,
  ): Promise<ApiResponse<AuthLoginResponseDto>> {
    return request<ApiResponse<AuthLoginResponseDto>>(`${AUTH_PATH}/google-login`, {
      method: ApiHttpMethod.POST,
      body: JSON.stringify(dto),
      auth: false,
    });
  },
  logout(): Promise<ApiResponse<null>> {
    return request<ApiResponse<null>>(`${AUTH_PATH}/logout`, {
      method: ApiHttpMethod.POST,
      auth: true,
    });
  },

};
