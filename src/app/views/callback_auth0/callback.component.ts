import { Component } from '@angular/core';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'callback.component.html'
})
export class CallBackAuth0 {

  constructor(private auth: AuthService){
    auth.handleAuthentication();
  }

}
