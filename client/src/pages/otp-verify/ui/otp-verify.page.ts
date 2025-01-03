import { NgClass } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { Component, inject, Signal, viewChild } from "@angular/core";
import { Router } from "@angular/router";
import { CreateDeviceDTO } from "domain-shared/user";
import { Notyf } from "notyf";
import { catchError, EMPTY, finalize, interval, tap } from "rxjs";

import { AuthService, DeviceService } from "src/entities/user";
import { OtpVerifyForm } from "src/features/verify-otp";
import { Browser } from "src/shared/libs/browser";

@Component({
    selector: 'otp-verify-page',
    templateUrl: './otp-verify.page.html',
    imports: [
        OtpVerifyForm,
        NgClass
    ],
})
export class OtpVerifyPage {

    protected canRetryTime: number = 30;

    private readonly otpVerifyFormEl: Signal<OtpVerifyForm> = viewChild.required('otpVerifyForm');
    private readonly router: Router = inject(Router);
    private readonly authService: AuthService = inject(AuthService);
    private readonly deviceService: DeviceService = inject(DeviceService);
    private readonly email!: string;

    constructor() {
        const state = this.router.getCurrentNavigation()?.extras.state;
        if (!state || !state['email']) {
            window.alert('잘못된 접근입니다.');
            this.router.navigateByUrl('/');
            return;
        }

        this.email = state['email'];

        interval(1000).pipe(
            tap(() => {
                if (this.canRetryTime !== 0) {
                    this.canRetryTime--;
                }
            })
        ).subscribe();
    }

    onVerifyOtp(otp: string): void {
        const deviceId: string = Browser.getId();
        const deviceModel: string = Browser.getBrowserInfo();
        const deviceOs: string = Browser.getOSInfo();
        const dto: CreateDeviceDTO = {
            email: this.email,
            otp,
            deviceId,
            deviceModel,
            deviceOs
        };
        console.log(dto);
        this.deviceService.createDevice(dto).pipe(
            tap(() => {
                this.router.navigateByUrl('/users/me');
            }),
            catchError((res: HttpErrorResponse) => {
                const notify = new Notyf();
                notify.error({
                    message: res.error.message,
                    dismissible: true
                });
                return EMPTY;
            }),
            finalize(() => this.otpVerifyFormEl().changeToFetched())
        ).subscribe();
    }

    onResendOtp(): void {
        this.authService.sendOtp(this.email).pipe(
            tap(() => {
                const notify = new Notyf();
                notify.success({
                    message: '인증번호를 재전송하였습니다.',
                    dismissible: true
                });
            }),
            catchError((res: HttpErrorResponse) => {
                const notify = new Notyf();
                notify.error({
                    message: res.error.message,
                    dismissible: true
                });
                return EMPTY;
            }),
            finalize(() => this.canRetryTime = 30),
        ).subscribe();
    }
}