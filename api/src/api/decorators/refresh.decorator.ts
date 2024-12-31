import { applyDecorators, createParamDecorator, ExecutionContext, SetMetadata, UnauthorizedException } from "@nestjs/common";
import { ApiHeader } from "@nestjs/swagger";

/**
 * @description
 * 해당 데코레이터를 사용하면 인증 검사를 건너뛰고 리프레시토큰을 파싱
 */
export function Refresh() {
    return SetMetadata('refresh', true);
}

export function ApiRefreshTokenHeader() {
    return applyDecorators(
        ApiHeader({
            name: 'x-refresh-token',
            description: '리프레시토큰',
            required: true,
            schema: {
                type: 'string',
                example: 'asdf-zxcv-qwer-fghg',
            },
        })
    );
}

export const RefreshToken = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request: Request = ctx.switchToHttp().getRequest();
        const refreshToken: string = request.headers['x-refresh-token'];
        if (!refreshToken) {
            throw new UnauthorizedException('리프레시토큰이 유효하지 않습니다.');
        }
        return refreshToken;
    },
);
