import { Component, inject, signal } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { RouterLink } from "@angular/router";

import { AuthService, RegisterDTO, UserService } from "src/entities/user";
import { ToFormGroup } from "src/shared/types";

@Component({
    selector: 'register-page',
    imports: [
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatIconModule,
        MatButtonModule,
        ReactiveFormsModule,
        RouterLink
    ],
    template: `
    <form class="flex flex-col p-4" [formGroup]="formGroup" (ngSubmit)="onSubmit()">
        <mat-form-field>
            <mat-label>username</mat-label>
            <input matInput type="text" formControlName="username" />
        </mat-form-field>
        <mat-form-field>
            <mat-label>password</mat-label>
            <input matInput [type]="hide() ? 'password' : 'text'" formControlName="password" />
            <button
            mat-icon-button
            matSuffix
            (click)="clickEvent($event)"
            [attr.aria-label]="'Hide password'"
            [attr.aria-pressed]="hide()"
            >
            <mat-icon class="mr-2">{{hide() ? 'visibility_off' : 'visibility'}}</mat-icon>
            </button>
        </mat-form-field>
        <mat-form-field>
            <mat-label>email</mat-label>
            <input matInput type="email" formControlName="email" />
        </mat-form-field>

        <button mat-flat-button>회원가입</button>

        <div class="flex justify-around mt-4">
            <a routerLink="/login">로그인</a>
        </div>

        <div class="flex justify-center w-full">
            <div class="w-[70%] border-gray-500 border-t my-8"></div>
        </div>

        <div class="flex justify-center gap-2">
            <a>
                <img src="kakao_login.png"/>
            </a>
            <a>
                <img src="google_login.png"/>
            </a>
        </div>
    </form>
    `
})
export class RegisterPageUI {
    private readonly fb = inject(FormBuilder);
    private readonly userService = inject(UserService);
    private readonly authService = inject(AuthService);
    readonly formGroup: FormGroup<ToFormGroup<RegisterDTO>>;
    readonly hide = signal(true);

    constructor() {
        this.formGroup = this.fb.group<ToFormGroup<RegisterDTO>>({
            username: this.fb.nonNullable.control<string>('', [Validators.required]),
            password: this.fb.nonNullable.control<string>('', [Validators.required]),
            email: this.fb.nonNullable.control<string>('', [Validators.required]),
        });
    }

    clickEvent(event: MouseEvent) {
        this.hide.set(!this.hide());
        event.stopPropagation();
    }

    onSubmit() {
        const result: RegisterDTO = this.formGroup.getRawValue();
        this.authService.register(result).subscribe();
    }
}