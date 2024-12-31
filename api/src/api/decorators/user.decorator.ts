import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const Credential = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request['user'] || null;
    },
);

export const CurrentSession = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request['userSession'] || null;
    },
);