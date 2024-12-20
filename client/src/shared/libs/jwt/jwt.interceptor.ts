import { HttpContext, HttpContextToken, HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { LocalTokenStorage } from "./plain-functions";

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

const state = {
    isRefreshing: false,
    requestQueue: [] as any[]
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

    const tokenStorage = LocalTokenStorage.getInstance();

    if (tokenStorage.isExpired()) {
        return new Observable(observer => {
            console.log(state.isRefreshing);
            if (state.isRefreshing) {
                state.requestQueue.push({ request: req, next, observer });
            } else {
                state.isRefreshing = true;

                doRefreshTokens()
                    .then(() => {
                        const accessToken = tokenStorage.getAccessToken();
                        console.log(accessToken);
                        const updatedReq = req.clone({
                            headers: req.headers.set('Authorization', `Bearer ${accessToken}`)
                        });
                        next(updatedReq).subscribe(observer);

                        processQueue();
                    })
                    .catch((err) => {
                        observer.error(err);
                        state.requestQueue.forEach(({ observer }) => {
                            observer.error(err);
                        });
                        state.requestQueue = [];
                    })
                    .finally(() => {
                        state.isRefreshing = false;
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

async function doRefreshTokens() {
    const tokenStorage = LocalTokenStorage.getInstance();

    try {
        const refreshToken = await tokenStorage.getRefreshToken();
        if (!refreshToken) {
            throw new Error('No Refresh Token 😢');
        }

        const res = await fetch('http://localhost:8000/api/v1/auth/refresh', {
            method: 'POST',
            headers: {
                authorization: `Bearer ${refreshToken}`
            }
        });

        if (!res.ok) throw new Error('Refresh Failed 😭');

        const result: any /**프로젝트에서 약속한 타입 사용 */ = await res.json();
        tokenStorage.setAccessToken(result.accessToken, result.expiresIn);
        await tokenStorage.setRefreshToken(result.refreshToken);
    } catch (err) {
        await tokenStorage.clearTokens();
        throw err;
    }
}

function processQueue() {
    const tokenStorage = LocalTokenStorage.getInstance();
    const accessToken = tokenStorage.getAccessToken();

    state.requestQueue.forEach(({ request, next, observer }) => {
        const updatedReq = request.clone({
            headers: request.headers.set('Authorization', `Bearer ${accessToken}`)
        });
        next(updatedReq).subscribe(observer);
    });

    state.requestQueue = [];
}