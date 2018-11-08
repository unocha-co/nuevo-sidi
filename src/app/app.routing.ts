import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent } from './containers';
import { LoginComponent } from './views/login/login.component';
import {CallBackAuth0} from './views/callback_auth0/callback.component'
import {AuthGuardService} from './auth/auth-guard.service';


export const routes: Routes = [
   {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
    canActivate: [ AuthGuardService ] ,
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'callback_auth0',
    component: CallBackAuth0,
    data: {
      title: 'Autorization...'
    }
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'admin',
        loadChildren: './views/admin/admin.module#AdminModule',
        canActivate: [ AuthGuardService ]
      }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}

