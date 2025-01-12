import { DatePipe } from "@angular/common";
import { Component, computed, effect, inject, Signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { DeviceResultDTO } from "domain-shared/user";
import { Notyf } from "notyf";

import { ProfileState } from "src/entities/user";
import { CustomError, DynamicDialogControl } from "src/shared/foundations";
import { PendingScreen } from "src/shared/ui";

import { DevicesState } from "../states/devices.state";
import { DeviceRemoveDialog } from "./device-remove-dialog/device-remove.dialog";

@Component({
    selector: 'devices-page',
    templateUrl: 'devices.page.html',
    imports: [
        DatePipe,
        RouterLink,
        PendingScreen
    ]
})
export class DevicesPage {

    private readonly dynamicDialogControl: DynamicDialogControl = inject(DynamicDialogControl);
    private readonly devicesState: DevicesState = inject(DevicesState);
    private readonly profileState: ProfileState = inject(ProfileState);

    protected readonly devices: Signal<DeviceResultDTO[]> = this.devicesState.data;

    // 프로필 상태와 디바이스 상태가 모두 완료되어야 렌더링 되도록 합니다.
    protected readonly isPending: Signal<boolean> = computed(() => {
        return this.devicesState.isPending() || this.profileState.isPending();
    });

    constructor() {
        this.devicesState.initialize().subscribe();

        effect(() => this.handleDevicesInitializeError());
    }

    protected onLogoutDevice(deviceId: string): void {
        this.dynamicDialogControl.open(DeviceRemoveDialog, {
            data: {
                deviceId,
                email: this.profileState.data()?.email,
            }
        });
    }

    private handleDevicesInitializeError(): void {
        const error: CustomError | null = this.devicesState.error();
        if (!error) return;

        const notyf: Notyf = new Notyf();
        notyf.error({
            message: error.message,
            dismissible: true,
        });
    }
}