import { Signal, signal, WritableSignal } from "@angular/core";
import { CustomError } from "./base.state";

export abstract class BaseItemsState<T> {

    readonly data: Signal<T[]>;
    readonly isPending: Signal<boolean>;
    readonly error: Signal<CustomError | null>;

    private readonly _data: WritableSignal<T[]> = signal([]);
    private readonly _isPending: WritableSignal<boolean> = signal(false);
    private readonly _error: WritableSignal<CustomError | null> = signal(null);

    constructor() {
        this.data = this._data.asReadonly();
        this.isPending = this._isPending.asReadonly();
        this.error = this._error.asReadonly();
    }

    setData(data: T[]): void {
        this._data.set(data);
    }

    setPending(): void {
        if (this._data().length > 0) {
            return;
        }
        this._isPending.set(true);
    }

    clearPending(): void {
        this._isPending.set(false);
    }

    setError(error: CustomError): void {
        this._error.set(error);
    }
}