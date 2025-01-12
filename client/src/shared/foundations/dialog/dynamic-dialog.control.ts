import { ComponentRef, Injectable, Type, ViewContainerRef, ViewRef } from "@angular/core";

import { DynamicDialogOverlay } from "./ui/dynamic-dialog.overlay";

export type ModalOption = {
    data?: any;
    canBackdropClose?: boolean;
}

export type ModalItem = {
    id: number;
    component: ComponentRef<DynamicDialogOverlay>;
    data: any;
}

@Injectable({
    providedIn: 'root'
})
export class DynamicDialogControl {

    private containerRef?: ViewContainerRef;
    // private modalMap: Map<number, ComponentRef<DynamicDialogOverlay>> = new Map();
    // private dataMap: Map<number, any> = new Map();

    private modals: ModalItem[] = [];

    initialize(containerRef: ViewContainerRef) {
        this.containerRef = containerRef;
    }

    getData<T>(): T {
        console.log(this.modals);
        return this.modals[this.modals.length - 1].data;
    }

    open<T>(component: Type<T>, option?: ModalOption): ComponentRef<DynamicDialogOverlay> {
        const containerRef: ViewContainerRef = this.getContainerRefOrThrow();

        const overlayRef: ComponentRef<DynamicDialogOverlay> = containerRef.createComponent(DynamicDialogOverlay);
        overlayRef.setInput('component', component);
        overlayRef.setInput('canBackdropClose', option?.canBackdropClose ?? true);
        overlayRef.instance.onCloseEvent.subscribe(async () => {
            await this.close();
        });

        const index: number = containerRef.length - 1;
        this.modals.push({
            id: index,
            component: overlayRef,
            data: option?.data
        });

        return overlayRef;
    }

    async close(): Promise<void> {
        const containerRef: ViewContainerRef = this.getContainerRefOrThrow();
        const index: number = containerRef.length - 1;

        const viewRef: ViewRef | null = containerRef.get(index);
        const { component }: ModalItem = this.modals.pop()!;

        if (!component || !viewRef) {
            containerRef.clear();
            throw new Error('모달이 없습니다.');
        }
        await component.instance.playCloseAnims();

        viewRef.destroy();

        if (index === 0) {
            containerRef.clear();
        }
    }

    private getContainerRefOrThrow() {
        if (!this.containerRef) {
            throw new Error('모달 컨테이너 레퍼런스가 없습니다.');
        }
        return this.containerRef;
    }
}