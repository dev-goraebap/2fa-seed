import { afterNextRender, Component, inject, Signal, viewChild, ViewContainerRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { environment } from 'src/shared/environments';
import { DynamicDialogControl } from 'src/shared/foundations';
import { TokenRefreshService } from 'src/shared/libs/jwt';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet
  ],
  templateUrl: './app.component.html'
})
export class AppComponent {

  private readonly modalContainer: Signal<ViewContainerRef> = viewChild.required('modalContainer', {
    read: ViewContainerRef
  });
  private readonly ddc: DynamicDialogControl = inject(DynamicDialogControl);

  constructor() {
    const tokenRefreshService = TokenRefreshService.getInstance();
    tokenRefreshService.initRefreshApiUrl(`${environment.apiUrl}/v1/auth/refresh`);

    afterNextRender(() => {
      this.ddc.initialize(this.modalContainer());
    });
  }
}
