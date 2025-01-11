import { ComponentRef, Injectable, Signal, signal, Type, ViewContainerRef, WritableSignal } from "@angular/core";

export interface StepComponent {
    next(): void;
    prev(): void;
}

@Injectable()
export class StepControl {

    private viewContainerRef: ViewContainerRef | null = null;
    private currentComponentRef?: ComponentRef<any>;
    private readonly _step: WritableSignal<number> = signal(1);
    private readonly _data: WritableSignal<any> = signal(null);
    private readonly components: Map<number, Type<any>> = new Map();

    readonly step: Signal<number> = this._step.asReadonly();
    readonly data: Signal<any> = this._data.asReadonly();

    /**
     * @description viewContainer 영역을 설정합니다.
     */
    setContainerRef(stepContainer: ViewContainerRef) {
        this.viewContainerRef = stepContainer;
    }

    /**
     * @description
     * 컴포넌트를 Index와 1:1로 매핑하여 저장합니다.
     * - 호출된 순서대로 컴포넌트의 단계가 정해집니다.
     */
    addComponent<T>(component: Type<T>) {
        this.components.set(this.components.size + 1, component);
    }

    create() {
        if (!this.viewContainerRef) {
            throw new Error('ViewContainerRef is not set');
        }
        this.loadComponent(this.step());
    }

    /**
     * @description 다음 단계로 이동합니다.
     */
    next(data?: any) {
        if (this.step() >= this.components.size) return;

        if (data) {
            this._data.set(data);
        }

        this._step.update(prev => prev + 1);
        this.loadComponent(this.step());
    }

    /**
     * @description 이전 단계로 이동합니다.
     */
    prev() {
        if (this.step() <= 1) return;

        this._step.update(prev => prev - 1);
        this.loadComponent(this.step());
    }

    /**
     * @description 특정 단계의 컴포넌트를 로드합니다.
     */
    private loadComponent(step: number) {
        if (!this.viewContainerRef) {
            throw new Error('ViewContainerRef is not set');
        }

        // 이전 컴포넌트 제거
        this.currentComponentRef?.destroy();
        this.viewContainerRef.clear();

        // 새 컴포넌트 생성
        const component = this.components.get(step);
        if (!component) {
            throw new Error('Component not found');
        }

        this.currentComponentRef = this.viewContainerRef.createComponent(component);
    }
}