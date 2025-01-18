/**
 * @description 회원 데이터 생성, 수정 규칙
 */
export const USER_RULES = {
    // 최소 8자 이상 20자 이하, 영문 대소문자, 숫자, 특수문자로 이루어진 문자열(모두 포함해야 함)
    password: {
        min: 8,
        max: 20,
        hashMax: 200,
        regex: /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>])[a-zA-Z\d!@#$%^&*()\-_=+{};:,<.>]{8,20}$/, // 영문 소문자, 숫자, 특수문자는 필수, 대문자는 선택
        get lengthErrMsg() {
            return `비밀번호는 ${this.min}자 이상 ${this.max}자 이하여야 합니다.`;
        },
        get regexErrMsg() {
            return `비밀번호는 영문, 숫자, 특수문자를 모두 포함해야 합니다.`;
        }
    },
    // 최소 2자 이상 10자 이하, 영문, 한글, 숫자로만 이루어진 문자열
    nickname: {
        min: 2,
        max: 10,
        regex: /^[a-zA-Z가-힣\d]+$/, // 영문, 한글, 숫자만 허용
        get lengthErrMsg() {
            return `닉네임은 ${this.min}자 이상 ${this.max}자 이하여야 합니다.`;
        },
        get regexErrMsg() {
            return `닉네임은 영문, 한글, 숫자로만 구성되어야 합니다.`;
        }
    },
    // 10자 또는 11자의 숫자 문자열 (01012345678 형식) 또는 13자의 하이픈(-) 포함 형식 (010-1234-5678)
    phoneNumber: {
        min: 10,
        max: 13,
        regex: /^(010-\d{4}-\d{4}|010\d{4}\d{4})$/, // 01012345678 또는 010-1234-5678 형식
        get lengthErrMsg() {
            return `휴대폰 번호는 ${this.min}자 이상 ${this.max}자 이하여야 합니다.`;
        },
        get regexErrMsg() {
            return `휴대폰 번호는 "01012345678" 또는 "010-1234-5678" 형식이어야 합니다.`;
        }
    },
    email: {
        min: 6,
        max: 50,
        regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        get lengthErrMsg() {
            return `이메일 주소는 ${this.min}자 이상 ${this.max}자 이하여야 합니다.`;
        },
        get regexErrMsg() {
            return `이메일 형식이 올바르지 않습니다.`;
        }
    }
};
