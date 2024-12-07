import { applyDecorators, BadRequestException } from "@nestjs/common";
import { Transform } from "class-transformer";
import { isIn, length, matches } from "class-validator";
import { USER_RULES, UsernameTypes, VerifyOtpDTO } from "domain-shared/user";

export function CheckUsername() {
    return applyDecorators(
        Transform(({ value, obj }) => {
            console.log(value);
            const type = (obj as VerifyOtpDTO).type;
            if (!isIn(type, Object.values(UsernameTypes))) {
                throw new BadRequestException('아이디 유형이 올바르지 않습니다.');
            }

            if (type === UsernameTypes.EMAIL) {
                let result = length(value, USER_RULES.email.min, USER_RULES.email.max);
                if (!result) throw new BadRequestException(USER_RULES.email.lengthErrMsg);
                result = matches(value, USER_RULES.email.regex);
                if (!result) throw new BadRequestException(USER_RULES.email.regexErrMsg);
            } else {
                let result = length(value, USER_RULES.phoneNumber.min, USER_RULES.phoneNumber.max);
                if (!result) throw new BadRequestException(USER_RULES.phoneNumber.lengthErrMsg);
                result = matches(value, USER_RULES.phoneNumber.regex);
                if (!result) throw new BadRequestException(USER_RULES.phoneNumber.regexErrMsg);
            }

            console.log(value);
            return value;
        })
    )
}