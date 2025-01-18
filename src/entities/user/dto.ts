/**
 * ===========
 * Request DTO
 * ===========
 */
export type UpdatePasswordDTO = {
  email: string;
  otp: string;
  password: string;
}

/**
 * ===========
 * Response DTO
 * ===========
 */
export type EmailDuplicateCheckResultDTO = {
  isDuplicate: boolean;
}

export type ProfileResultDTO = {
  id: string;
  email: string;
  nickname: string;
  createdAt: Date;
  updatedAt: Date;
}
