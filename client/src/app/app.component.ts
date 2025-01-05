import { Component, inject, ViewContainerRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { environment } from 'src/shared/environments';
import { TokenRefreshService } from 'src/shared/libs/jwt';
import { ModalControl } from 'src/shared/ui';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  private readonly viewContainer: ViewContainerRef = inject(ViewContainerRef);
  private readonly modalControl: ModalControl = inject(ModalControl);

  constructor() {
    const tokenRefreshService = TokenRefreshService.getInstance();
    tokenRefreshService.initRefreshApiUrl(`${environment.apiUrl}/v1/auth/refresh`);

    this.modalControl.setViewContainerRef(this.viewContainer);
  }
}
