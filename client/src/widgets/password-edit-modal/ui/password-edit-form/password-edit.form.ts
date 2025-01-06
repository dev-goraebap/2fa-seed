import { Component, inject } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";

import { UpdatePasswordDTO, USER_RULES } from "domain-shared/user";
import { UserService } from "src/entities/user";
import { FormHelper } from "src/shared/services";

import { HttpErrorResponse } from "@angular/common/http";
import { Notyf } from "notyf";
import { catchError, finalize, tap } from "rxjs";
import { ModalControl } from "src/shared/ui";
import { StepControl } from "../../states/step.control";

@Component({
    selector: 'password-edit-form',
    templateUrl: './password-edit.form.html',
    imports: [
        ReactiveFormsModule
    ]
})
export class PasswordEditForm extends FormHelper {

    private readonly fb: FormBuilder = inject(FormBuilder);
    private readonly userService: UserService = inject(UserService);
    private readonly stepControl: StepControl = inject(StepControl);
    private readonly modalControl: ModalControl = inject(ModalControl);

    protected override readonly formGroup: FormGroup<any>;
    protected isPending: boolean = false;
    protected readonly userRules = USER_RULES;

    constructor() {
        super();
        this.formGroup = this.fb.group({
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

    override onSubmit(): void {
        if (!this.formGroup.valid) {
            this.formGroup.markAllAsTouched();
            return;
        }

        this.isPending = true;

        const formData: any = this.formGroup.value;
        const data: any = this.stepControl.data();
        const dto: UpdatePasswordDTO = {
            email: data?.email,
            otp: data?.otp,
            password: formData.password,
        }
        
        this.userService.updatePassword(dto).pipe(
            tap(() => this.modalControl.closeLatest()),
            catchError((res: HttpErrorResponse) => {
                const notyf = new Notyf();
                notyf.error({
                    message: res.error.message,
                    dismissible: true
                });
                throw res.error;
            }),
            finalize(() => this.isPending = false)
        ).subscribe();
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