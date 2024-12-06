import { USER_RULES, UserStatus } from "domain-shared/user";
import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryColumn } from "typeorm";

import { plainToInstance } from "class-transformer";
import { } from 'domain-shared/user';

@Entity({ name: 'users', comment: '사용자 정보' })
export class UserEntity {

    @PrimaryColumn()
    readonly id: string;

    @Column({ comment: '닉네임', length: USER_RULES.nickname.max })
    readonly nickname: string;

    @Column({ comment: '이메일', length: 50, unique: true })
    readonly email: string;

    @Column({ comment: '비밀번호', length: USER_RULES.password.max, nullable: true })
    readonly password: string;

    @Column({ comment: '전화번호', length: USER_RULES.phoneNumber.max, unique: true })
    readonly phoneNumber: string;

    @Column({ comment: 'OTP코드', length: USER_RULES.otpCode.max, nullable: true })
    readonly otpCode: string;

    @Column({ comment: '상태', length: 10 })
    readonly status: UserStatus;

    static create(param: Pick<UserEntity, 'id' | 'nickname' | 'email' | 'password' | 'otpCode'>): UserEntity {
        return plainToInstance(UserEntity, {
            ...param,
            status: UserStatus.PENDING,
        } as UserEntity);
    }

    @BeforeInsert()
    @BeforeUpdate()
    private beforeCreateOrUpdate() {
        // TODO: 비밀번호 암호화 처리
    }
}