import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";

/**
 * @todo
 * FormFactory 서비스들이 공용으로 사용하는 기능을 제공
 * - 에러 채크 함수
 */
@Injectable()
export abstract class FormHelper {

    abstract readonly formGroup: FormGroup;

    hasError(formControlName: string, errorName: 'required' | 'minlength' | 'maxlength' | 'pattern' | string) {
        if (!this.formGroup) {
            throw new Error('formGroup 없음');
        }
        const control = this.formGroup.get(formControlName);
        if (!control) return false;
        if (!control.invalid || !control.touched) return false;
        return control.errors![errorName];
    }
}