import { Component, effect, inject } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Notyf } from "notyf";

import { RemoveOtherDeviceDTO, USER_RULES } from "domain-shared/user";
import { CustomError, DynamicDialogControl } from "src/shared/foundations";
import { BaseForm } from "src/shared/foundations/form";
import { StepControl } from "src/shared/foundations/stepper";
import { ToFormGroup } from "src/shared/types";

import { DeviceRemoveState } from "../../../states/device-remove.state";

/**
 * @description
 * OTP Verify Form 과 동일하지만, 요구사항이 다르기 때문에 임시로 분리된 폼.
 * 이후에 더 나은 방법으로 리팩토링 필요.
 */
@Component({
    selector: 'otp-form',
    templateUrl: './step02.ui.html',
    imports: [
        ReactiveFormsModule
    ]
})
export class Step02UI extends BaseForm {

    protected readonly userRules = USER_RULES;
    protected override formGroup: FormGroup<ToFormGroup<{ otp: string }>>;
    protected readonly deviceId: string;

    private readonly fb: FormBuilder = inject(FormBuilder);
    private readonly ddc: DynamicDialogControl = inject(DynamicDialogControl);
    private readonly stepControl: StepControl = inject(StepControl);
    private readonly deviceRemoveState: DeviceRemoveState = inject(DeviceRemoveState);

    constructor() {
        super();
        effect(() => this.handleRemoveSuccess());
        effect(() => this.handleRemoveError());

        this.deviceId = this.ddc.getData<{ deviceId: string }>().deviceId;

        this.formGroup = this.fb.group({
            otp: this.fb.nonNullable.control('', [
                Validators.required,
                Validators.minLength(6),
                Validators.maxLength(6),
                Validators.pattern(USER_RULES.otp.regex)
            ])
        });
    }

    onSubmit(): void {
        if (!this.formGroup.valid) {
            this.formGroup.markAllAsTouched();
            return;
        }

        const { otp } = this.formGroup.getRawValue();
        console.log(this.stepControl.data);
        const dto: RemoveOtherDeviceDTO = {
            deviceId: this.deviceId,
            otp
        };

        this.deviceRemoveState.remove(dto).subscribe();
    }

    private handleRemoveSuccess(): void {
        const isComplete: boolean = this.deviceRemoveState.isCompleted();
        if (!isComplete) return;

        new Notyf().success('디바이스 삭제가 완료되었습니다.');
        this.ddc.close();
    }

    private handleRemoveError(): void {
        const error: CustomError | null = this.deviceRemoveState.error();
        if (!error) return;
        new Notyf().error(error.message);
    }
}