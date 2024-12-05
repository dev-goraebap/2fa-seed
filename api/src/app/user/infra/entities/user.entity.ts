import { USER_RULES } from "domain-shared/user";
import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: 'users', comment: '사용자 정보' })
export class UserEntity {

    @PrimaryColumn()
    readonly id: string;

    @Column({ comment: '닉네임', length: USER_RULES.nickname.max })
    readonly nickname: string;

    @Column({ comment: '아이디', length: USER_RULES.username.max, unique: true, nullable: true })
    readonly username: string;

    @Column({ comment: '비밀번호', length: USER_RULES.password.max, nullable: true })
    readonly password: string;

    @Column({ comment: '전화번호', length: USER_RULES.phoneNumber.max, unique: true })
    readonly phoneNumber: string;

    @Column({ comment: '전화번호', length: USER_RULES.otpCode.max, nullable: true })
    readonly otpCode: string;
}