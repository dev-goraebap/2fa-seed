import { ArgumentsHost, Catch, ExceptionFilter, GatewayTimeoutException, HttpException, InternalServerErrorException, Logger } from '@nestjs/common';

@Catch(HttpException)
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();
        const status = exception.getStatus();
        const signature = exception.name;

        console.log(signature);

        // 요청자 IP 주소 추출
        const clientIp = request.headers['x-forwarded-for'] || request.connection.remoteAddress;

        let errorMessage: string;
        if (status >= 400 && status < 500) {
            errorMessage = exception.message;
            Logger.warn(`[${status}] ${errorMessage} - Request IP: ${clientIp}`, exception.stack);
        } else if (status >= 500 && status < 600) {
            errorMessage = this.getErrorMessage(exception);
            Logger.error(`[${status}] ${errorMessage} - Request IP: ${clientIp}`, exception.stack);
        } else {
            errorMessage = exception.message;
            Logger.error(`[${status}] ${errorMessage} - Request IP: ${clientIp}`, exception.stack);
        }

        response
            .status(status)
            .json({
                signature: signature,
                statusCode: status,
                message: errorMessage,
            });
    }

    private getErrorMessage(exception: HttpException): string {
        if (exception instanceof InternalServerErrorException) {
            return '서버 내부 오류가 발생했습니다.';
        } else if (exception instanceof GatewayTimeoutException) {
            return '게이트웨이 시간 초과 오류가 발생했습니다.';
        } else {
            return '서버에서 오류가 발생했습니다.';
        }
    }
}
