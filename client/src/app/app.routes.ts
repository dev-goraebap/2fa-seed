import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () => import('../pages/public/login').then(m => m.LoginPage)
    },
    {
        path: 'register',
        loadComponent: () => import('../pages/public/register').then(m => m.RegisterPage)
    },
];
