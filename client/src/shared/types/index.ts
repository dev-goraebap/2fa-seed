import { HttpErrorResponse } from "@angular/common/http";
import { FormControl } from "@angular/forms";

export type ToFormGroup<T> = {
    [K in keyof T]: FormControl<T[K]>;
};

/**
 * @description
 * HTTP 에러 응답 타입
 */
export type HttpError = HttpErrorResponse & {
    error: {
        code: string;
        message: string;
    }
}