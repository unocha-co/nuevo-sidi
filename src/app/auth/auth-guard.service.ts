import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { AuthService } from './auth.service';
import { Service } from '../services/service.module';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(
    private auth:AuthService,
    private router:Router,
    private service: Service
    ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    return this.service.postRequest('validatePermission', {url: state.url}).then(data => {
      if(this.auth.isAuthenticated()){
        if(data['granted'])
            return true;
          else{
            this.router.navigate(['/']);
            return false;
          }
      }else
        this.auth.login();
    }).catch(() => {
        this.router.navigate(['/']);
        return false;
    });
  }
}
