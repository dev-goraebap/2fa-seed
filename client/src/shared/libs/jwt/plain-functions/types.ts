export type JwtResource = {
    readonly accessToken: string;
    readonly expiresIn: number;
    readonly refreshToken: string;
}