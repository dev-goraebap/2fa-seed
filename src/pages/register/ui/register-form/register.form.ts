import { Component, inject, Signal } from '@angular/core';
import {
    AbstractControl,
    AsyncValidatorFn,
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    ValidationErrors,
    Validators,
} from '@angular/forms';
import { catchError, debounceTime, delay, distinctUntilChanged, map, Observable, of } from 'rxjs';

import { USER_RULES, UserApi } from 'src/entities/user';
import { BaseForm, CustomValidators } from 'src/shared/foundations/form';
import { ToFormGroup } from 'src/shared/types';

import { RegisterState } from '../../states/register.state';
import { RegisterFormDTO } from '../../types/register-form.dto';

@Component({
    selector: 'register-form',
    templateUrl: './register.form.html',
    imports: [ReactiveFormsModule],
})
export class RegisterForm extends BaseForm {

    override readonly formGroup: FormGroup<ToFormGroup<RegisterFormDTO>>;
    readonly isPending: Signal<boolean>;
    readonly userRules = USER_RULES;

    private readonly fb = inject(FormBuilder);
    private readonly userApi = inject(UserApi);
    private readonly registerState = inject(RegisterState);

    constructor() {
        super();

        this.isPending = this.registerState.isPending;

        this.formGroup = this.fb.group({
            email: this.fb.nonNullable.control('', {
                validators: [
                    Validators.required,
                    Validators.pattern(USER_RULES.email.regex),
                ],
                asyncValidators: [
                    this.checkDuplicateEmail(),
                ],
                updateOn: 'change',
            }),
            password: this.fb.nonNullable.control('', [
                Validators.required,
                Validators.minLength(USER_RULES.password.min),
                Validators.maxLength(USER_RULES.password.max),
                Validators.pattern(USER_RULES.password.regex),
            ]),
            confirmPassword: this.fb.nonNullable.control('', [
                Validators.required,
                CustomValidators.confirmPasswordValidator(),
            ]),
        });
    }

    onSubmit() {
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
            return this.userApi.checkDuplicateEmail(control.value).pipe(
                delay(1000),
                debounceTime(500),
                distinctUntilChanged(),
                map(res => res.isDuplicate ? { isDuplicate: true } : null),
                catchError(() => of(null)),
            );
        };
    }
}
