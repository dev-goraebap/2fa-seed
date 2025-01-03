import { Signal, signal, WritableSignal } from "@angular/core";
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";

/**
 * @todo
 * FormFactory 서비스들이 공용으로 사용하는 기능을 제공
 * - 에러 채크 함수
 * - 요청중 상태, 상태 제어 메서드 제공
 */
export abstract class FormHelper {

    protected abstract readonly formGroup: FormGroup;
    protected readonly isFetching: Signal<boolean>;

    private readonly _isFetching: WritableSignal<boolean> = signal(false);

    constructor() {
        this.isFetching = this._isFetching.asReadonly();
    }

    /** 
     * @todo isFetching 상태값을 완료상태로 변경
     * - 부모 컴포넌트에서 viewChild를 통해 호출 가능.
     * 요청이 끝난 이후 fetching 상태를 완료상태로 변경
     */
    changeToFetched() {
        this._isFetching.set(false);
    }

    /** 
     * @todo isFetching 상태값을 실행상태로 변경
     * - 상속 받는 컴포넌트에서 이벤트 핸들러 정의 시 사용 
     */
    protected changeToFetching() {
        this._isFetching.set(true);
    }

    protected hasError(formControlName: string, errorName: 'required' | 'minlength' | 'maxlength' | 'pattern' | string) {
        if (!this.formGroup) {
            throw new Error('formGroup 없음');
        }
        const control = this.formGroup.get(formControlName);
        if (!control) return false;
        if (!control.invalid || !control.touched) return false;
        return control.errors![errorName];
    }

    protected hasAsyncError(formControlName: string, errorName: string) {
        if (!this.formGroup) {
            throw new Error('formGroup 없음');
        }
        const control = this.formGroup.get(formControlName);
        if (!control) return false;
        if (!control.errors) return false;
        return control.errors![errorName];
    }

    protected isPending(formControlName: string) {
        if (!this.formGroup) {
            throw new Error('formGroup 없음');
        }
        const control = this.formGroup.get(formControlName);
        if (!control) return false;
        if (!control.pending) return false;
        return true;
    }

    /**
     * 
     * @description 패스워드 확인 유효성 검사 함수
     * - html에서 `passwordMismatch` 키 사용
     */
    confirmPasswordValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.parent) {
                return null;
            }

            const password = control.parent.get('password');
            if (!password) {
                return null;
            }

            if (control.value !== password.value) {
                return { passwordMismatch: true };
            }

            return null;
        };
    }
}