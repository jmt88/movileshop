import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginGuard } from './_core/_guards/login.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./_core/_auth/auth-routing.module').then((m) => m.AuthRoutingModule),
  },
  // {
  //   path: 'error',
  //   loadChildren: () =>
  //     import('./modules/errors/errors.module').then((m) => m.ErrorsModule),
  // },
  {
    path: '',
    canActivate: [LoginGuard],
    loadChildren: () =>
      import('./_core/_layout/pages-routing.module').then((m) => m.PagesRoutingModule),
  },
  { path: '**', redirectTo: 'error/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload'})],
  exports: [RouterModule],
})
export class AppRoutingModule { }
