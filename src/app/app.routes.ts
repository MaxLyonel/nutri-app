import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { MainLayout } from './layouts/main-layout/main-layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { Clients } from './pages/clients/clients';
import { DealerPage } from './pages/delivery/dealer/dealer';
import { authGuard } from './shared/guards/auth.guard';
import { loginGuard } from './shared/guards/auth.guard';
import { ProduccionPage } from './pages/produccion/produccion';
import { PlanCreator } from './pages/plan/plan-creator';
import { RoutePage } from './pages/delivery/route/route';
import { EntregasPage } from './pages/delivery/entregas/entregas';
import { DeliveryDetailPage } from './pages/delivery/delivery-detail/delivery-detail';

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
      { path: 'delivery/route', component: RoutePage },
      { path: 'delivery/entregas', component: EntregasPage },
      { path: 'delivery/delivery-detail', component: DeliveryDetailPage },
      { path: 'planes', component: PlanCreator },
      { path: 'produccion', component: ProduccionPage },
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '/login' },
];