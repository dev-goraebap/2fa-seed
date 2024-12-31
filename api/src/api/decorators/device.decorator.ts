import { applyDecorators, BadRequestException, createParamDecorator, ExecutionContext } from "@nestjs/common";
import { ApiHeader } from "@nestjs/swagger";
import { Request } from "express";
import { DeviceDTO } from "src/app/user";

export function ApiDeviceIdHeader() {
    return applyDecorators(
        ApiHeader({
            name: 'x-device-id',
            description: '디바이스ID',
            required: true,
            schema: {
                type: 'string',
                example: 'xxxx-xxxx-xxxx',
            },
        })
    );
}

export function ApiDeviceInfoHeaders() {
    return applyDecorators(
        ApiHeader({
            name: 'x-device-id',
            description: '디바이스ID',
            required: true,
            schema: {
                type: 'string',
                example: 'xxxx-xxxx-xxxx',
            },
        }),
        ApiHeader({
            name: 'x-device-model',
            description: '디바이스모델',
            required: true,
            schema: {
                type: 'string',
                example: 'Chrome',
            },
        }),
        ApiHeader({
            name: 'x-device-os',
            description: '디바이스OS',
            required: true,
            schema: {
                type: 'string',
                example: 'Windows 10',
            },
        })
    );
}

export const DeviceId = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request: Request = ctx.switchToHttp().getRequest();
        const result: string = request.headers['x-device-id'] as string;
        if (!result) {
            throw new BadRequestException('디바이스ID가 필요합니다.');
        }
        return result;
    },
);

export const DeviceHeaderDTO = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request: Request = ctx.switchToHttp().getRequest();
        const deviceId: string = request.headers['x-device-id'] as string;
        const deviceModel: string = request.headers['x-device-model'] as string;
        const deviceOs: string = request.headers['x-device-os'] as string;
        if (!deviceId || !deviceModel || !deviceOs) {
            throw new BadRequestException('디바이스 정보가 필요합니다.');
        }
        return DeviceDTO.create(deviceId, deviceModel, deviceOs);
    },
);