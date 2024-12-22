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
        loadComponent: () => import('../pages/public/login').then(m => m.LoginPage)
    },
    {
        path: 'register',
        loadComponent: () => import('../pages/public/register').then(m => m.RegisterPage)
    },
    {
        path: 'profile',
        canActivate: [jwtGuard],
        loadComponent: () => import('../pages/private/profile').then(m => m.ProfilePage)
    },
    {
        path: 'profile/edit',
        canActivate: [jwtGuard],
        loadComponent: () => import('../pages/private/edit-profile').then(m => m.EditProfilePage)
    },
    {
        path: 'error',
        loadComponent: () => import('../pages/public/error').then(m => m.ErrorPage)
    }
];
