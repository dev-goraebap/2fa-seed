import { createParamDecorator, ExecutionContext } from "@nestjs/common";

/**
 * @description
 * 요청 객체에서 user 값을 추출하여 반환하는 데코레이터
 */
export const Credential = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request['user'] || null;
    },
);