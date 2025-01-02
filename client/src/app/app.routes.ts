import { Routes } from '@angular/router';
import { jwtGuard } from 'src/shared/libs/jwt';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () => import('../pages/login').then(m => m.LoginPage)
    }
];
