/**
 * ===========
 * Request DTO
 * ===========
 */
export type RegisterDTO = {
  email: string;
  password: string;
}

export type LoginDTO = RegisterDTO;

export type VerifyOtpDTO = {
  email: string;
  otp: string;
}

/**
 * ===========
 * Response DTO
 * ===========
 */
export type AuthResultDTO = {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
}
