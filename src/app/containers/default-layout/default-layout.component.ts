import {Component, Input} from '@angular/core';
import {navItems} from './../../_nav';
import {AuthService} from '../../auth/auth.service';
import {Router, NavigationEnd} from '@angular/router';
import {v} from '@angular/core/src/render3';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultLayoutComponent {
  public navItems = navItems;
  public sidebarMinimized = true;
  public route = '';
  private changes: MutationObserver;
  public element: HTMLElement = document.body;

  session: boolean;
  name: string;

  constructor(private authService: AuthService, public router: Router) {
    this.route = this.router.url;
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.route = val.url;
      }
    });
    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = document.body.classList.contains('sidebar-minimized');
    });
    this.changes.observe(<Element>this.element, {
      attributes: true
    });
    this.session = authService.isAuthenticated();
    this.name = localStorage.getItem('name') ? localStorage.getItem('name') : '';
  }

  logout() {
    this.authService.logout();
  }

  login() {
    this.authService.login();
  }

}
