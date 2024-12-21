import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { catchError, EMPTY, tap } from 'rxjs';
import { HealthCheckService } from 'src/entities/health-check';
import { AuthService } from 'src/entities/user';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = '2fa-seed-client';
  private readonly authService: AuthService = inject(AuthService); 
  private readonly healthCheckService: HealthCheckService = inject(HealthCheckService);

  constructor() {
    this.healthCheckService.healthCheck().pipe(
      tap(console.log),
      catchError((res: HttpErrorResponse) => {
        console.log(res.error);
        return EMPTY;
      })
    ).subscribe();
  }
}
