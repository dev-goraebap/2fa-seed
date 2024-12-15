import { createParamDecorator, ExecutionContext } from "@nestjs/common";

/**
 * @description
 * 요청 객체에서 refreshToken 값을 추출하여 반환하는 데코레이터
 */
export const AuthResultParam = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request['authResult'] || null;
    },
);