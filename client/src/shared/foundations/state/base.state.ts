import { signal, Signal, WritableSignal } from "@angular/core";

export type CustomError = {
    readonly message: string;
    readonly signature: string;
    readonly statusCode: number;
}

export abstract class BaseState<T> {

    readonly data: Signal<T | null>;
    readonly isPending: Signal<boolean>;
    readonly error: Signal<CustomError | null>;

    private readonly _data: WritableSignal<T | null> = signal(null);
    private readonly _isPending: WritableSignal<boolean> = signal(false);
    private readonly _error: WritableSignal<CustomError | null> = signal(null);

    constructor() {
        this.data = this._data.asReadonly();
        this.isPending = this._isPending.asReadonly();
        this.error = this._error.asReadonly();
    }

    setData(data: T | null): void {
        this._data.set(data);
    }

    setPending(): void {
        if (this.data() !== null) {
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