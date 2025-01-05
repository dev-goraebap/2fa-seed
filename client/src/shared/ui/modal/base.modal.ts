import { Component, input, InputSignal } from "@angular/core";

@Component({
    template: ''
})
export abstract class BaseModal<T = any> {
    readonly data?: InputSignal<T> = input.required();

    beforeClose?: () => boolean | Promise<boolean>;
    afterClosed?: (result?: any) => void;
    close!: (result?: any) => void;
}