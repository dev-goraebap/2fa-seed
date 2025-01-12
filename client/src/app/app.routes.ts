import { Routes } from '@angular/router';

import { privateGuard, publicGuard } from './guards';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: '',  // 빈 path
        canActivate: [publicGuard],
        children: [
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
            }
        ]
    },
    {
        path: 'users/me',
        canActivate: [privateGuard],
        loadComponent: () => import('../entities/user').then(m => m.ProfileLayoutUI),
        children: [
            {
                path: '',
                loadComponent: () => import('../pages/profile').then(m => m.ProfilePage)
            },
            {
                path: 'devices',
                loadComponent: () => import('../pages/devices').then(m => m.DevicesPage)
            }
        ]
    },
    {
        path: 'errors',
        loadComponent: () => import('../pages/errors').then(m => m.Error50XPage)
    },
    {
        path: '**',
        loadComponent: () => import('../pages/errors').then(m => m.Error404Page)
    },
];
