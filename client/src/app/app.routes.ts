import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () => import('../pages/login').then(m => m.LoginPage)
    },
    {
        path: 'register',
        loadComponent: () => import('../pages/register').then(m => m.RegisterPage)
    },
    {
        path: 'verify-otp',
        loadComponent: () => import('../pages/otp-verify').then(m => m.OtpVerifyPage)
    },
    {
        path: 'users/me',
        loadComponent: () => import('../pages/profile').then(m => m.ProfilePage)
    },
];
