import { HttpContext, HttpContextToken, HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { TokenStorage } from "./plain-functions";
import { TokenRefreshService } from "./plain-functions/token-refresh.service";

const skipJwtContextToken = new HttpContextToken(() => false);

/**
 * @description
 * `jwtInterceptor` 프로세스를 건너뜀.
 * 
 * 인증이 필요하지 않은 요청에 사용
 */
export function skipAuth(): HttpContext {
    return new HttpContext().set(skipJwtContextToken, true);
};

const tokenStorage: TokenStorage = TokenStorage.getInstance();
const refreshService: TokenRefreshService = TokenRefreshService.getInstance();

let isRefreshing: boolean = false;

/**
 * @description
 * jwt 인증이 필요한 요청에 전처리를 수행하는 인터셉터
 * 
 * - `skipAuth()` 함수를 사용하는 요청은 무시
 * 
 * - 요청 전 엑세스토큰이 만료 직전인지 검사하고
 * 갱신이 필요하면 현재 요청을 대기열에 저장해두고 토큰 재발급 요청
 * - 토큰 재발급 프로세스중 추가적인 요청이 들어오면 대기열에 저장, 이후 일괄 요청 
 */
export function jwtInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    if (req.context.get(skipJwtContextToken)) {
        return next(req);
    }

    const router: Router = inject(Router);

    if (tokenStorage.isExpiringSoon()) {
        console.debug('access token is expired');
        console.debug(`[${req.url}]`);
        if (!isRefreshing) {
            isRefreshing = true;

            refreshService.refresh()
                .catch(() => {
                    window.alert('세션이 만료되었습니다.');
                    router.navigateByUrl('/');
                })
                .finally(() => {
                    isRefreshing = false;
                });
        }

        return new Observable(observer => {
            console.log('push pending request');
            refreshService.addPendingSubscriber(((token: string | null) => {
                if (token) {
                    console.log('성공');
                    const updatedReq = req.clone({
                        headers: req.headers.set('authorization', `Bearer ${token}`)
                    });
                    next(updatedReq).subscribe(observer);
                } else {
                    console.log('실패');
                    observer.error(async (err: HttpErrorResponse) => {
                        console.error('인증이 필요한 API 재요청 실패:', err);
                        window.alert('세션이 만료되었습니다.');
                        await tokenStorage.clearTokens();
                        router.navigateByUrl('/');
                    });
                }
            }));
        });
    }

    const accessToken = tokenStorage.getAccessToken();
    const updatedReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${accessToken}`)
    });
    return next(updatedReq);
}