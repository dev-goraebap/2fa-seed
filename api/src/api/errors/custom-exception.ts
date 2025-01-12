import { HttpException, HttpExceptionOptions } from "@nestjs/common";

export enum CustomExceptions {
    SESSION_EXPIRES = 'SESSION_EXPIRES',
    NEED_REFRESH = 'NEED_REFRESH',
}

/**
 * @description
 * HttpException 기능을 상속받는 커스텀 익셉션
 * 
 * - 클라이언트와 별도의 코드로 소통이 필요할 경우 사용
 * - 
 */
export class CustomException extends HttpException {

    readonly name: string;

    constructor(signature: CustomExceptions, response: string | Record<string, any>, status: number, options?: HttpExceptionOptions) {
        super(response, status, options);
        this.name = signature;
    }
}