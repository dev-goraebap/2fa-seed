import { NgClass } from "@angular/common";
import { afterNextRender, Component, ElementRef, input, InputSignal, output, OutputEmitterRef, Signal, Type, viewChild, ViewContainerRef } from "@angular/core";

@Component({
    selector: 'dynamic-dialog-overlay',
    templateUrl: './dynamic-dialog.overlay.html',
    imports: [
        NgClass
    ],
})
export class DynamicDialogOverlay {

    /** @inputs */
    readonly canBackdropClose: InputSignal<boolean> = input.required();
    readonly component: InputSignal<Type<unknown>> = input.required();

    /** @outputs */
    readonly onCloseEvent: OutputEmitterRef<void> = output();

    private readonly backdropRef: Signal<ElementRef | undefined> = viewChild.required('backdrop');
    private readonly modalRef: Signal<ElementRef | undefined> = viewChild.required('modal');
    private readonly contentContainer: Signal<ViewContainerRef> = viewChild.required('contentContainer', {
        read: ViewContainerRef
    });

    constructor() {
        afterNextRender(() => {
            const contentContainer: ViewContainerRef = this.contentContainer();
            contentContainer.createComponent(this.component());
        });
    }

    /**
     * @description 
     * 다이얼로그가 닫힐 때 실행되는 애니메이션 함수입니다.
     * - `DynamicDialogControl` 클래스에서 호출됩니다.
     */
    playCloseAnims(): Promise<void> {
        return new Promise((resolve) => {
            const overlay: HTMLDivElement = this.backdropRef()!.nativeElement;
            const modal: HTMLDivElement = this.modalRef()!.nativeElement;

            overlay.classList.add('motion-opacity-out-0');
            modal.classList.add('motion-scale-out-75');

            overlay.addEventListener('animationend', () => {
                resolve();
            });
        });
    }

    protected onBackdropClose(): void {
        if (!this.canBackdropClose()) {
            return;
        }
        this.onClose();
    }

    protected onClose(): void {
        this.onCloseEvent.emit();
    }
}