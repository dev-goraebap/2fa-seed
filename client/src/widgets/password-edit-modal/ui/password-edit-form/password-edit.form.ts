import { HttpErrorResponse } from "@angular/common/http";
import { Component, inject } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { Notyf } from "notyf";
import { catchError, finalize, tap } from "rxjs";

import { UpdatePasswordDTO, USER_RULES } from "domain-shared/user";
import { UserApi } from "src/entities/user";
import { DynamicDialogControl } from "src/shared/foundations";
import { BaseForm } from "src/shared/foundations/form";

import { StepControl } from "../../states/step.control";

@Component({
    selector: 'password-edit-form',
    templateUrl: './password-edit.form.html',
    imports: [
        ReactiveFormsModule
    ]
})
export class PasswordEditForm extends BaseForm {

    private readonly fb: FormBuilder = inject(FormBuilder);
    private readonly userService: UserApi = inject(UserApi);
    private readonly stepControl: StepControl = inject(StepControl);
    private readonly ddc: DynamicDialogControl = inject(DynamicDialogControl);

    protected override readonly formGroup: FormGroup<any>;
    protected readonly userRules = USER_RULES;
    protected isPending: boolean = false;

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
            tap(() => {
                const notyf = new Notyf();
                notyf.success({
                    message: '비밀번호가 변경되었어요.',
                    dismissible: true
                });
                this.ddc.close();
            }),
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