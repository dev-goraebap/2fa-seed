import { DatePipe } from "@angular/common";
import { Component, inject, Signal } from "@angular/core";

import { DeviceResultDTO } from "domain-shared/user";
import { DynamicDialogControl } from "src/shared/foundations";

import { DeviceRemoveState } from "../../states/device-remove.state";
import { DevicesState } from "../../states/devices.state";
import { DeviceRemoveContainer } from "../device-remove/device-remove.container";

@Component({
    selector: 'devices-container',
    templateUrl: 'devices.container.html',
    imports: [
        DatePipe
    ],
    providers: [
        DevicesState,
        DeviceRemoveState
    ]
})
export class DevicesContainer {

    private readonly dynamicDialogControl: DynamicDialogControl = inject(DynamicDialogControl);
    private readonly devicesState: DevicesState = inject(DevicesState);
    private readonly deviceRemoveState: DeviceRemoveState = inject(DeviceRemoveState);

    protected readonly devices: Signal<DeviceResultDTO[]> = this.devicesState.data;

    constructor() {
        this.devicesState.initialize().subscribe();
    }

    protected onLogoutDevice(deviceId: string): void {
        console.log(deviceId);
        this.dynamicDialogControl.open(DeviceRemoveContainer);
        // this.deviceRemoveState.remove(deviceId).subscribe();
    }
}