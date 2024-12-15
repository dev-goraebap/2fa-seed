import { SetMetadata } from "@nestjs/common";

/**
 * @description
 * 해당 데코레이터를 사용하면 인증 검사를 건너뛰고 리프레시토큰을 파싱
 */
export function Refresh() {
    return SetMetadata('refresh', true);
}