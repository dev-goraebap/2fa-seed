import { Signal, signal, WritableSignal } from "@angular/core";
import { CustomError } from "./base.state";

export abstract class BaseItemsState<T> {

    private _data: WritableSignal<T[]> = signal([]);
    private _isPending: WritableSignal<boolean> = signal(false);
    private _error: WritableSignal<CustomError | null> = signal(null);

    readonly data: Signal<T[]> = this._data.asReadonly();
    readonly isPending: Signal<boolean> = this._isPending.asReadonly();
    readonly error: Signal<CustomError | null> = this._error.asReadonly();

    setData(data: T[]) {
        this._data.set(data);
    }

    setPending() {
        if (this._data().length > 0) {
            return;
        }
        this._isPending.set(true);
    }

    clearPending() {
        this._isPending.set(false);
    }

    setError(error: CustomError) {
        this._error.set(error);
    }
}