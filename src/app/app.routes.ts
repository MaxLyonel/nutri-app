import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { DealerPage } from './pages/delivery/dealer/dealer';
import { authGuard } from './shared/guards/auth.guard';
import { loginGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login, canActivate: [loginGuard] },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'delivery/dealer', component: DealerPage, canActivate: [authGuard] },
  { path: '**', redirectTo: '/login' },
];
