import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import * as auth0 from 'auth0-js';
import * as globals from '../globals';
import {Service} from '../services/service.module';

(window as any).global = window;

@Injectable()
export class AuthService {

  routes:any;

  auth0 = new auth0.WebAuth({
    clientID: globals.auth0_clientID,
    domain: globals.auth0_domain,
    responseType: globals.auth0_responseType,
    redirectUri: globals.auth0_redirectUrl,
    scope: globals.auth0_scope
  });

  constructor(public router: Router, private service: Service) {
  }

  public login(): void {
    this.auth0.authorize();
  }

  public handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.stop();
        this.setSession(authResult);
        this.auth0.client.userInfo(authResult.accessToken, (err, profile) => {
          if (profile) {
            let data = {
              name: profile.name,
              email: profile.email,
              user_id: profile.sub
            };
            this.service.saveOrUpdate('user', data).subscribe(data => {
              if(data.status == true){
                localStorage.setItem('name', data.data.name);
                localStorage.setItem('menu', JSON.stringify(data.data.navigation));
                this.service.routes = data.data.navigation;
                window.location.href = '/';
              }else
                this.logout();
            });
          }else
            this.logout();
        });
      }else
        if(!this.isAuthenticated() && !(typeof(authResult) === 'undefined'))
          this.router.navigate(['/login']);
    });
  }

  private setSession(authResult): void {
    // Set the time that the Access Token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
  }

  public logout(): void {
    // Remove tokens and expiry time from localStorage
    localStorage.clear();
    window.location.href = '/';
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // Access Token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at') || '{}');
    return new Date().getTime() < expiresAt;
  }

}
