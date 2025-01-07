import { signal, Signal, WritableSignal } from "@angular/core";

export type CustomError = {
    readonly message: string;
    readonly signature: string;
    readonly statusCode: number;
}

export abstract class BaseState<T> {

    private _data: WritableSignal<T | null> = signal(null);
    private _isPending: WritableSignal<boolean> = signal(false);
    private _error: WritableSignal<CustomError | null> = signal(null);

    readonly data: Signal<T | null> = this._data.asReadonly();
    readonly isPending: Signal<boolean> = this._isPending.asReadonly();
    readonly error: Signal<CustomError | null> = this._error.asReadonly();

    setData(data: T) {
        this._data.set(data);
    }

    setPending() {
        this._isPending.set(true);
    }

    clearPending() {
        this._isPending.set(false);
    }

    setError(error: CustomError) {
        this._error.set(error);
    }
}