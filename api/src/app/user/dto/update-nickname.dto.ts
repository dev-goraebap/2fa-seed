import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Length, Matches } from "class-validator";
import { USER_RULES } from "domain-shared/user";

export class UpdateNicknameDTO {
    @IsNotEmpty({ message: '닉네임을 입력해주세요.' })
    @Matches(USER_RULES.nickname.regex, { message: USER_RULES.nickname.regexErrMsg })
    @Length(USER_RULES.nickname.min, USER_RULES.nickname.max, { message: USER_RULES.nickname.lengthErrMsg })
    @ApiProperty()
    readonly nickname: string;
}