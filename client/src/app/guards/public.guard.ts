import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { Notyf } from "notyf";
import { from, map, Observable } from "rxjs";
import { TokenStorage } from "src/shared/libs/jwt";

export const publicGuard: CanActivateFn = (): Observable<boolean> => {
    const router: Router = inject(Router);
    const storage: TokenStorage = TokenStorage.getInstance();

    return from(storage.getRefreshToken()).pipe(
        map((refreshToken: string | null) => {
            if (refreshToken) {
                const notyf: Notyf = new Notyf();
                notyf.error({
                    message: '인증 세션이 존재해요.',
                    background: '#212121',
                    dismissible: true,
                });

                router.navigateByUrl('/users/me');
                return false;
            }
            return true;
        })
    );
}