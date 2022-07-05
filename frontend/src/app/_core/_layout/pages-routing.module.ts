import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './_layout/layout.component';
import { LoginGuard } from '../_guards/login.guard';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [LoginGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./../../pages/dashboard/dashboard.module').then((m) => m.DashboardModule)
      },
      {
        path: 'usuarios',
        canActivate: [LoginGuard],
        loadChildren: () =>
          import('./../../pages/usuario/usuario.module').then((m) => m.UsuarioModule)
      },
      {
        path: 'perfiles',
        canActivate: [LoginGuard],
        loadChildren: () =>
          import('./../../pages/perfil/perfil.module').then((m) => m.PerfilModule)
      },
      {
        path: 'autorizaciones-ip',
        canActivate: [LoginGuard],
        loadChildren: () =>
          import('./../../pages/network/network.module').then((m) => m.NetworkModule)
      },
      {
        path: 'autorizaciones-usuarios',
        canActivate: [LoginGuard],
        loadChildren: () =>
          import('./../../pages/cuotas/cuotas.module').then((m) => m.CuotasModule)
      },
      {
        path: 'inspeccion',
        canActivate: [LoginGuard],
        loadChildren: () =>
          import('./../../pages/inspeccion/inspeccion.module').then((m) => m.InspeccionModule)
      },
      {
        path: 'sitios-denegados',
        canActivate: [LoginGuard],
        loadChildren: () =>
          import('./../../pages/denegado/denegado.module').then((m) => m.DenegadoModule)
      },
      {
        path: 'tiendas',
        canActivate: [LoginGuard],
        loadChildren: () =>
          import('./../../pages/tienda/tienda.module').then((m) => m.TiendaModule)
      }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
