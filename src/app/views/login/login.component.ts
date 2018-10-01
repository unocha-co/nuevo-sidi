import { Component } from '@angular/core';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent {

  constructor(private auth: AuthService){
    auth.login();
  }

}
