import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { catchError, EMPTY, tap } from 'rxjs';

import { HealthCheckService } from 'src/entities/health-check';
import { environment } from 'src/shared/environments';
import { TokenRefreshService } from 'src/shared/libs/jwt/plain-functions/token-refresh.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private readonly healthCheckService: HealthCheckService = inject(HealthCheckService);

  constructor() {
    const tokenRefreshService = TokenRefreshService.getInstance();
    tokenRefreshService.initRefreshApiUrl(`${environment.apiUrl}/v1/auth/refresh`);

    this.healthCheckService.healthCheck().pipe(
      tap(console.log),
      catchError((res: HttpErrorResponse) => {
        console.log(res.error);
        return EMPTY;
      })
    ).subscribe();
  }
}
