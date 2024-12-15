import { SetMetadata } from "@nestjs/common";

/**
 * @description
 * 해당 데코레이터를 사용하면 인증 검사를 건너뛰고 컨트롤러에 접근할 수 있습니다.
 */
export function Public() {
    return SetMetadata('public', true);
}