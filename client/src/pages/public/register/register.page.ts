import { Component, inject, signal } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { RouterLink } from "@angular/router";
import { tap } from "rxjs";

import { RegisterDTO, USER_RULES } from 'domain-shared/user';
import { AuthService, UserService } from "src/entities/user";
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
    templateUrl: './register.page.primary.html'
})
export class RegisterPage {
    private readonly fb = inject(FormBuilder);
    private readonly userService = inject(UserService);
    private readonly authService = inject(AuthService);
    readonly formGroup: FormGroup<ToFormGroup<RegisterDTO>>;
    readonly hide = signal(true);

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
        const result: RegisterDTO = this.formGroup.getRawValue();
        this.authService.register(result).pipe(
            tap(console.log)
        ).subscribe();
    }
}