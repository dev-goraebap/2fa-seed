import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { environment } from 'src/shared/environments';
import { TokenRefreshService } from 'src/shared/libs/jwt';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor() {
    const tokenRefreshService = TokenRefreshService.getInstance();
    tokenRefreshService.initRefreshApiUrl(`${environment.apiUrl}/v1/auth/refresh`);
  }
}
