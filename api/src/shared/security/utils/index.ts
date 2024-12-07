import * as bcrypt from 'bcrypt';

/**
 * @description 비밀번호 해싱
 */
export function hashPassword(password: string) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
}

/**
 * @description 비밀번호 비교
 */
export function comparePassword(password: string, hashedPassword: string) {
    return bcrypt.compareSync(password, hashedPassword);
}