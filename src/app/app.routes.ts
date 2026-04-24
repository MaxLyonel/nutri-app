import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { MainLayout } from './layouts/main-layout/main-layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { Clients } from './pages/clients/clients';
import { DealerPage } from './pages/delivery/dealer/dealer';
import { authGuard } from './shared/guards/auth.guard';
import { loginGuard } from './shared/guards/auth.guard';
import { PlanCreator } from './pages/plan/plan-creator';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login, canActivate: [loginGuard] },
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'clients', component: Clients },
      { path: 'delivery/dealer', component: DealerPage, canActivate: [authGuard] },
      { path: 'planes', component: PlanCreator },
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '/login' },
];