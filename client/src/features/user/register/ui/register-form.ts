import { Component, inject, output, OutputEmitterRef, signal, WritableSignal } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { MatFormField, MatInput, MatLabel } from "@angular/material/input";

import { RegisterDTO, USER_RULES } from "domain-shared/user";
import { ToFormGroup } from "src/shared/types";

@Component({
    selector: 'register-form',
    imports: [
        MatFormField,
        MatLabel,
        MatInput,
        MatButton,
        MatIcon,
        ReactiveFormsModule,
    ],
    template: `
    <form class="[&_*]:w-full" [formGroup]="formGroup" (ngSubmit)="onSubmit()">
        <mat-form-field>
            <mat-label>email</mat-label>
            <input matInput type="email" formControlName="email" />
        </mat-form-field>
        <mat-form-field>
            <mat-label>password</mat-label>
            <input matInput [type]="hide() ? 'password' : 'text'" formControlName="password" />
            <button mat-icon-button matSuffix (click)="clickEvent($event)" [attr.aria-label]="'Hide password'"
                [attr.aria-pressed]="hide()">
                <mat-icon class="mr-2">{{hide() ? 'visibility_off' : 'visibility'}}</mat-icon>
            </button>
        </mat-form-field>
        <div>
            <button mat-flat-button>회원가입</button>
        </div>
    </form>
    `
})
export class RegisterForm {

    readonly submit: OutputEmitterRef<RegisterDTO> = output();
    readonly hide: WritableSignal<Boolean> = signal(true);

    readonly formGroup: FormGroup<ToFormGroup<RegisterDTO>>;

    private readonly fb = inject(FormBuilder);

    constructor() {
        this.formGroup = this.fb.group<ToFormGroup<RegisterDTO>>({
            email: this.fb.nonNullable.control<string>('', [
                Validators.required,
                Validators.email,
            ]),
            password: this.fb.nonNullable.control<string>('', [
                Validators.required,
                Validators.minLength(USER_RULES.password.min),
                Validators.maxLength(USER_RULES.password.max),
                Validators.pattern(USER_RULES.password.regex),
            ]),
        });
    }

    clickEvent(event: MouseEvent) {
        this.hide.set(!this.hide());
        event.stopPropagation();
    }

    onSubmit() {
        if (!this.formGroup.valid) {
            this.formGroup.markAllAsTouched();
            return;
        }

        const formData: RegisterDTO = this.formGroup.getRawValue();
        this.submit.emit(formData);
    }
}