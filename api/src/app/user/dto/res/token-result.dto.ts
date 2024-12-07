import { ApiProperty } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { TokenResultDTO as TTokenResultDTO } from 'domain-shared/user';

export class TokenResultDTO implements TTokenResultDTO {
    @ApiProperty({ description: '액세스 토큰' })
    readonly accessToken: string;

    @ApiProperty({ description: '리프레시 토큰' })
    readonly refreshToken: string;

    @ApiProperty({ description: '엑세스토큰 토큰 만료 시간' })
    readonly expiresIn: number;

    static from(param: TTokenResultDTO) {
        return plainToInstance(TokenResultDTO, param);
    }
}