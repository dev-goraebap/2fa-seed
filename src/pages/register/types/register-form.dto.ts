import { RegisterDTO } from 'src/entities/auth';

export type RegisterFormDTO = RegisterDTO & {
    readonly confirmPassword: string;
}
