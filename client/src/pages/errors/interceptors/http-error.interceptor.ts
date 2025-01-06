import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, EMPTY, Observable, throwError } from "rxjs";
import { CustomError } from "src/shared/services";

export function httpErrorInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const router: Router = inject(Router);
    return next(req).pipe(
        catchError((res: HttpErrorResponse) => {
            console.log(res);
            if (res.status === 0) {
                router.navigateByUrl('/errors', {
                    state: {
                        error: {
                            message: `앗! 서버와 연결이 끊어졌어요.`,
                            signature: '0000',
                            statusCode: 0
                        } as CustomError
                    }
                });
                return EMPTY;
            }

            if (res.status > 500) {
                router.navigateByUrl('/errors', {
                    state: {
                        error: {
                            message: '무언가 잘못됐어요.',
                            signature: '0000',
                            statusCode: 500
                        } as CustomError
                    }
                });
                return EMPTY;
            }

            return throwError(() => res);
        })
    );
}