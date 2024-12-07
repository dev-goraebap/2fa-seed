import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";

/**
 * @description
 * Reactive Forms Module 사용시 반복되는 로직을 최소화 하기 위한 헬퍼 클래스.
 * 
 * ### 사용방법
 * ```
 * // 컴포넌트 프로바이더에 클래스 추가 
 * provider: [FormHelper]
 * 
 * ...
 * readonly formHelper = inject(FormHelper);
 * 
 * constructor() {
 *     // 컴포넌트에서 사용하는 formGroup 등록
 *     this. formHelper.setFormGroup(this.formGroup);
 * }
 * ```
 */
@Injectable()
export class FormHelper {

    private formGroup!: FormGroup;

    setFormGroup(formGroup: FormGroup) {
        this.formGroup = formGroup;
    }

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