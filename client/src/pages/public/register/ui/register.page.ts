import { Component, inject } from "@angular/core";

import { RegisterDTO } from 'domain-shared/user';
import { AuthService } from "src/entities/user";
import { RegisterForm } from "src/features/user/register";

@Component({
    selector: 'register-page',
    imports: [
        RegisterForm,
    ],
    template: `
    <div class="p-4">
        <register-form (submit)="register($event)" />
    </div>
    `
})
export class RegisterPage {
    private readonly authService = inject(AuthService);

    register(dto: RegisterDTO) {
        console.log(dto);
    }
}