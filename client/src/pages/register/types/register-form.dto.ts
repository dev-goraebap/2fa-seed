import { RegisterDTO } from "domain-shared/user";

export type RegisterFormDTO = RegisterDTO & {
    readonly confirmPassword: string;
}