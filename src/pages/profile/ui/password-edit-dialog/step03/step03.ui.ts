import { Component, effect, inject, Signal } from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    ValidationErrors,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { Notyf } from 'notyf';

import { UpdatePasswordDTO, USER_RULES } from 'src/entities/user';
import { PasswordEditState } from 'src/features/edit-password';
import { CustomError, DynamicDialogControl } from 'src/shared/foundations';
import { BaseForm } from 'src/shared/foundations/form';
import { StepControl } from 'src/shared/foundations/stepper';

@Component({
    selector: 'step-03',
    templateUrl: './step03.ui.html',
    imports: [
        ReactiveFormsModule,
    ],
})
export class Step03UI extends BaseForm {

    override readonly formGroup: FormGroup<any>;
    readonly userRules = USER_RULES;
    readonly isPending: Signal<boolean>;

    private readonly fb = inject(FormBuilder);
    private readonly stepControl = inject(StepControl);
    private readonly ddc = inject(DynamicDialogControl);
    private readonly passwordEditState = inject(PasswordEditState);

    constructor() {
        super();
        this.isPending = this.passwordEditState.isPending;

        this.formGroup = this.fb.group({
            password: this.fb.nonNullable.control('', [
                Validators.required,
                Validators.minLength(USER_RULES.password.min),
                Validators.maxLength(USER_RULES.password.max),
                Validators.pattern(USER_RULES.password.regex),
            ]),
            confirmPassword: this.fb.nonNullable.control('', [
                Validators.required,
                this.confirmPasswordValidator(),
            ]),
        });

        effect(() => this.handlePasswordEditSuccess());
        effect(() => this.handlePasswordEditError());
    }

    override onSubmit() {
        if (!this.formGroup.valid) {
            this.formGroup.markAllAsTouched();
            return;
        }

        const formData: any = this.formGroup.value;
        const data: any = this.stepControl.data();
        const dto: UpdatePasswordDTO = {
            email: data?.email,
            otp: data?.otp,
            password: formData.password,
        };

        this.passwordEditState.editPassword(dto).subscribe();
    }

    private handlePasswordEditSuccess() {
        const isCompleted = this.passwordEditState.isCompleted();
        if (!isCompleted) return;

        new Notyf().success({
            message: '비밀번호가 변경되었어요.',
            dismissible: true,
        });
        this.ddc.close();
    }

    private handlePasswordEditError() {
        const error = this.passwordEditState.error();
        if (!error) return;

        new Notyf().error({
            message: error.message,
            dismissible: true,
        });
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
