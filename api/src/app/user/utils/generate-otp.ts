/**
 * @description 랜덤한 6자리 숫자 생성
 */
export function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}