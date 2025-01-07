import { Component, inject, Signal } from "@angular/core";
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { catchError, debounceTime, delay, distinctUntilChanged, map, Observable, of } from "rxjs";

import { USER_RULES } from "domain-shared/user";
import { UserService } from "src/entities/user";
import { BaseForm } from "src/shared/libs/base-form";
import { ToFormGroup } from "src/shared/types";

import { RegisterState } from "../states/register.state";
import { RegisterFormDTO } from "../types/register-form.dto";

@Component({
    selector: 'register-form',
    templateUrl: './register.form.html',
    imports: [ReactiveFormsModule]
})
export class RegisterForm extends BaseForm {

    private readonly fb: FormBuilder = inject(FormBuilder);
    private readonly userService: UserService = inject(UserService);
    private readonly registerState: RegisterState = inject(RegisterState);

    protected override readonly formGroup: FormGroup<ToFormGroup<RegisterFormDTO>>;
    protected readonly isPending: Signal<boolean> = this.registerState.isPending;
    protected readonly userRules = USER_RULES;

    constructor() {
        super();
        this.formGroup = this.fb.group({
            email: this.fb.nonNullable.control('', {
                validators: [
                    Validators.required,
                    Validators.pattern(USER_RULES.email.regex)
                ],
                asyncValidators: [
                    this.checkDuplicateEmail()
                ],
                updateOn: 'change'
            }),
            password: this.fb.nonNullable.control('', [
                Validators.required,
                Validators.minLength(USER_RULES.password.min),
                Validators.maxLength(USER_RULES.password.max),
                Validators.pattern(USER_RULES.password.regex)
            ]),
            confirmPassword: this.fb.nonNullable.control('', [
                Validators.required,
                this.confirmPasswordValidator()
            ]),
        });
    }

    onSubmit(): void {
        if (!this.formGroup.valid) {
            this.formGroup.markAllAsTouched();
            return;
        }
        const formData: RegisterFormDTO = this.formGroup.getRawValue();
        const { confirmPassword, ...registerDTO } = formData;

        this.registerState.register(registerDTO).subscribe();
    }

    private checkDuplicateEmail(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            return this.userService.checkDuplicateEmail(control.value).pipe(
                delay(1000),
                debounceTime(500),
                distinctUntilChanged(),
                map(res => res.isDuplicate ? { isDuplicate: true } : null),
                catchError(() => of(null))
            );
        };
    }

    private confirmPasswordValidator(): ValidatorFn {
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