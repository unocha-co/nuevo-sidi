import { Component, Input } from '@angular/core';
import { navItems } from './../../_nav';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent {
  public navItems = navItems;
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement = document.body;

  session:boolean;
  name:string;

  constructor(private authService: AuthService) {
    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = document.body.classList.contains('sidebar-minimized');
    });
    this.changes.observe(<Element>this.element, {
      attributes: true
    });
    this.session = authService.isAuthenticated();
    this.name = localStorage.getItem("name") ? localStorage.getItem("name") : "";
  }

  logout() {
    this.authService.logout();
  }

  login(){
    this.authService.login();
  }

}
