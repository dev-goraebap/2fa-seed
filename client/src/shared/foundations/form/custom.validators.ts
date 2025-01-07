import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

/**
 * @description
 * Reactive Form 에서 사용할 커스텀 유효성 검사기 클래스 입니다.
 * - 기존의 Validators 클래스와 유사한 인터페이스를 제공합니다.
 */
export class CustomValidators {

    /**
     * @description 
     * 비밀번호 필드와 비밀번호 확인 필드의 값을 비교하여 
     * 일치하지 않을 경우 에러를 반환합니다.
     */
    static confirmPasswordValidator(controlName: string = 'password'): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.parent) {
                return null;
            }
    
            const password = control.parent.get(controlName);
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