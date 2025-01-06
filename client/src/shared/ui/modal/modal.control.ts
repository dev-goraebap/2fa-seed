import { ComponentRef, Injectable, Type, ViewContainerRef } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class ModalControl {

    private readonly activeModals: ComponentRef<any>[] = []; // 활성화된 모달들 추적
    private viewContainerRef: ViewContainerRef | null = null;

    setViewContainerRef(vcr: ViewContainerRef) {
        this.viewContainerRef = vcr;
    }

    open<T, D = any>(
        component: Type<T>,
        config?: {
            data?: D;
            beforeClose?: () => boolean | Promise<boolean>;
        }
    ): ComponentRef<T> {
        if (!this.viewContainerRef) {
            throw new Error('ViewContainerRef is not set');
        }

        // 컴포넌트 생성
        const componentRef = this.viewContainerRef.createComponent(component);
        const modalComponent = componentRef.instance as any;

        // 데이터 주입
        if (config?.data) {
            modalComponent.data = config.data;
        }

        // beforeClose 핸들러 주입
        if (config?.beforeClose) {
            modalComponent.beforeClose = config.beforeClose;
        }

        // close 메서드 주입
        modalComponent.close = (result?: any) => {
            this.close(componentRef, result);
        };

        // 활성 모달 배열에 추가
        this.activeModals.push(componentRef);

        return componentRef;
    }

    /** @description 가장 최근 모달 닫기 */
    async closeLatest(result?: any): Promise<void> {
        if (this.activeModals.length === 0) return;

        const latestModal = this.activeModals[this.activeModals.length - 1];
        await this.close(latestModal, result);
    }

    private async close<T>(componentRef: ComponentRef<T>, result?: any) {
        const modalComponent = componentRef.instance as any;

        if (modalComponent.beforeClose) {
            const canClose = await modalComponent.beforeClose();
            if (!canClose) return;
        }

        const index = this.viewContainerRef?.indexOf(componentRef.hostView);
        if (index !== undefined && index > -1) {
            this.viewContainerRef?.remove(index);
        }

        if (modalComponent.afterClosed) {
            modalComponent.afterClosed(result);
        }
    }
}