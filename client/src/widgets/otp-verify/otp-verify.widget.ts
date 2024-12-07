import { Component, inject } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { RouterLink } from "@angular/router";
import { USER_RULES } from "domain-shared/user";

@Component({
    selector: 'otp-verify-widget',
    imports: [
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        ReactiveFormsModule,
        RouterLink
    ],
    templateUrl: './otp-verify.widget.primary.html',
})
export class OtpVerifyWidget {

    private readonly fb = inject(FormBuilder);

    readonly fromGroup: FormGroup;

    constructor() {
        this.fromGroup = this.fb.group({
            otp: this.fb.control('', [
                Validators.required,
                Validators.minLength(USER_RULES.otpCode.min),
                Validators.maxLength(USER_RULES.otpCode.max),
            ]),
        });
    }
}