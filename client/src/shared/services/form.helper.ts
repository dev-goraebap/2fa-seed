import { FormGroup } from "@angular/forms";

/**
 * @todo
 * FormFactory 서비스들이 공용으로 사용하는 기능을 제공
 * - 에러 채크 함수
 * - 요청중 상태, 상태 제어 메서드 제공
 */
export abstract class FormHelper {

    protected abstract readonly formGroup: FormGroup;

    protected hasError(formControlName: string, errorName: 'required' | 'minlength' | 'maxlength' | 'pattern' | string): boolean {
        if (!this.formGroup) {
            throw new Error('formGroup 없음');
        }
        const control = this.formGroup.get(formControlName);
        if (!control) return false;
        if (!control.invalid || !control.touched) return false;
        return control.errors![errorName];
    }

    protected hasAsyncError(formControlName: string, errorName: string): boolean {
        if (!this.formGroup) {
            throw new Error('formGroup 없음');
        }
        const control = this.formGroup.get(formControlName);
        if (!control) return false;
        if (!control.errors) return false;
        return control.errors![errorName];
    }

    protected isPendingControl(formControlName: string): boolean {
        if (!this.formGroup) {
            throw new Error('formGroup 없음');
        }
        const control = this.formGroup.get(formControlName);
        if (!control) return false;
        if (!control.pending) return false;
        return true;
    }

    abstract onSubmit(): void;
}