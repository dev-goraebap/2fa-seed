import { USER_RULES, UserStatus } from "domain-shared/user";
import { Column, Entity, PrimaryColumn } from "typeorm";

import { plainToInstance } from "class-transformer";
import { hashPassword } from "src/shared/security";

@Entity({ name: 'users', comment: '사용자 정보' })
export class UserEntity {

    @PrimaryColumn()
    readonly id: string;

    @Column({ comment: '닉네임', length: USER_RULES.nickname.max })
    readonly nickname: string;

    @Column({ comment: '이메일', length: USER_RULES.email.max, unique: true })
    readonly email: string;

    @Column({ comment: '비밀번호', length: USER_RULES.password.hashMax, nullable: true })
    readonly password: string;

    @Column({ comment: '전화번호', length: USER_RULES.phoneNumber.max, unique: true, nullable: true })
    readonly phoneNumber: string;

    @Column({ comment: 'OTP코드', length: USER_RULES.otp.max, nullable: true })
    readonly otp: string;

    @Column({ comment: '상태', length: 10 })
    readonly status: UserStatus;

    static create(param: Pick<UserEntity, 'id' | 'nickname' | 'email' | 'password' | 'otp'>): UserEntity {
        return plainToInstance(UserEntity, {
            ...param,
            status: UserStatus.PENDING,
            password: hashPassword(param.password),
        } as UserEntity);
    }

    withUpdateStatus(status: UserStatus) {
        return plainToInstance(UserEntity, {
            ...this,
            status,
            otp: null
        } as UserEntity);
    }
}