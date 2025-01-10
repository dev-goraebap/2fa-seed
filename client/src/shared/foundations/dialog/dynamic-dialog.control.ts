import { ComponentRef, Injectable, Type, ViewContainerRef, ViewRef } from "@angular/core";

import { DynamicDialogOverlay } from "./ui/dynamic-dialog.overlay";

@Injectable({
    providedIn: 'root'
})
export class DynamicDialogControl {

    private containerRef?: ViewContainerRef;
    private modalMap: Map<number, ComponentRef<DynamicDialogOverlay>> = new Map();

    initialize(containerRef: ViewContainerRef) {
        this.containerRef = containerRef;
    }

    open<T>(component: Type<T>): ComponentRef<DynamicDialogOverlay> {
        const containerRef: ViewContainerRef = this.getContainerRefOrThrow();

        const overlayRef: ComponentRef<DynamicDialogOverlay> = containerRef.createComponent(DynamicDialogOverlay);
        overlayRef.setInput('component', component);
        overlayRef.setInput('canBackdropClose', true);
        overlayRef.instance.onCloseEvent.subscribe(async () => {
            await this.close();
        });

        const index: number = containerRef.length - 1;
        this.modalMap.set(index, overlayRef);

        return overlayRef;
    }

    async close(): Promise<void> {
        const containerRef: ViewContainerRef = this.getContainerRefOrThrow();
        const index: number = containerRef.length - 1;

        const viewRef: ViewRef | null = containerRef.get(index);
        const modal: ComponentRef<DynamicDialogOverlay> | undefined = this.modalMap.get(index);

        if (!modal || !viewRef) {
            containerRef.clear();
            this.modalMap.clear();
            throw new Error('모달이 없습니다.');
        }
        await modal.instance.playCloseAnims();

        viewRef.destroy();
        this.modalMap.delete(index);

        if (index === 0) {
            containerRef.clear();
            this.modalMap.clear();
        }
    }

    private getContainerRefOrThrow() {
        if (!this.containerRef) {
            throw new Error('모달 컨테이너 레퍼런스가 없습니다.');
        }
        return this.containerRef;
    }
}