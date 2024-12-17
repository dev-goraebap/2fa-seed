import { ApiProperty } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { ProfileResultDTO as TProfileResultDTO } from 'domain-shared/user';
import { UserModel } from '../../models';

export class ProfileResultDTO implements TProfileResultDTO {
    @ApiProperty({ description: '사용자 ID' })
    readonly id: string;

    @ApiProperty({ description: '사용자 닉네임' })
    readonly nickname: string;

    @ApiProperty({ description: '사용자 이메일' })
    readonly email: string;

    @ApiProperty({ description: '사용자 생성일' })
    readonly createdAt: Date;

    static from(user: UserModel): ProfileResultDTO {
        return plainToInstance(ProfileResultDTO, {
            id: user.id,
            nickname: user.nickname,
            email: user.email,
            createdAt: user.createdAt,
        } as ProfileResultDTO);
    }
}