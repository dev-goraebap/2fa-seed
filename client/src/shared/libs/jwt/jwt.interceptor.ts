import { HttpContext, HttpContextToken, HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { LocalTokenStorage, RefreshTokenService } from "./plain-functions";

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

    const tokenStorage: LocalTokenStorage = LocalTokenStorage.getInstance();
    const refreshService: RefreshTokenService = RefreshTokenService.getInstance();

    if (tokenStorage.isExpired()) {
        console.debug('access token is expired');
        console.debug(`[${req.url}]`);

        return new Observable(observer => {
            console.log(refreshService.isRefreshing());
            if (refreshService.isRefreshing()) {
                refreshService.addPendingRequest({ request: req, next, observer });
            } else {
                refreshService.setRefreshing(true);

                refreshService.doRefreshTokens()
                    .then(() => {
                        const accessToken = tokenStorage.getAccessToken();
                        console.log(accessToken);
                        const updatedReq = req.clone({
                            headers: req.headers.set('Authorization', `Bearer ${accessToken}`)
                        });
                        next(updatedReq).subscribe(observer);

                        refreshService.getPendingRequests().forEach(({ request, next, observer }) => {
                            const updatedReq = request.clone({
                                headers: request.headers.set('Authorization', `Bearer ${accessToken}`)
                            });
                            next(updatedReq).subscribe(observer);
                        });
                        refreshService.clearPendingRequests();
                    })
                    .catch((err) => {
                        observer.error(err);
                        refreshService.getPendingRequests().forEach(({ observer }) => {
                            observer.error(err);
                        });
                        refreshService.clearPendingRequests();
                    })
                    .finally(() => {
                        refreshService.setRefreshing(false);
                    });
            }
        });
    }

    const accessToken = tokenStorage.getAccessToken();
    const updatedReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${accessToken}`)
    });
    return next(updatedReq);
}