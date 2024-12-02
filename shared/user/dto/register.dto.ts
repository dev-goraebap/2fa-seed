export type RegisterDTO = {
    readonly username: string;
    readonly password: string;
    readonly nickname: string;
}

export type RegisterWithEmailDTO = RegisterDTO & {
    readonly email: string;
}

export type RegisterWithPhoneDTO = RegisterDTO & {
    readonly phone: string;
}
