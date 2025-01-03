import { Component, inject, output, OutputEmitterRef } from "@angular/core";
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from "@angular/forms";
import { catchError, debounceTime, delay, distinctUntilChanged, map, Observable, of } from "rxjs";

import { RegisterDTO, USER_RULES } from "domain-shared/user";
import { UserService } from "src/entities/user";
import { FormHelper } from "src/shared/services";
import { ToFormGroup } from "src/shared/types";

import { RegisterFormDTO } from "../types/register-form.dto";

@Component({
    selector: 'register-form',
    templateUrl: './register.form.html',
    imports: [ReactiveFormsModule]
})
export class RegisterForm extends FormHelper {

    readonly registerEvent: OutputEmitterRef<RegisterDTO> = output();

    protected override formGroup: FormGroup<ToFormGroup<RegisterFormDTO>>;
    protected readonly userRules = USER_RULES;

    private readonly fb: FormBuilder = inject(FormBuilder);
    private readonly userService: UserService = inject(UserService);

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

    protected onRegister(): void {
        if (!this.formGroup.valid) {
            this.formGroup.markAllAsTouched();
            return;
        }
        this.changeToFetching();
        const formData: RegisterFormDTO = this.formGroup.getRawValue();
        const { confirmPassword, ...registerDTO } = formData;
        setTimeout(() => {
            this.registerEvent.emit(registerDTO);
        }, 2000);
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
}