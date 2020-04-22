import { estabelecimento } from './../../_models/estabelecimento';
import { Component, OnDestroy, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { navItems } from '../../_nav';
import { usuario } from '../../_models/usuario';
import { AuthenticationService } from '../../_services/authentication.service';
import { modulo } from '../../_models/modulo';
import { ModulosService } from '../../_services/modulos.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  providers: [ModulosService]
})
export class DefaultLayoutComponent implements OnDestroy {
  currentUser: usuario;
  // public navItems = navItems;
  // public navItems: Array<modulo>;
  private changes: MutationObserver;
  public element: HTMLElement;

  public sidebarMinimized = false;
  public navItems = navItems;

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private modulosService: ModulosService,
    @Inject(DOCUMENT) _document?: any) {
    /*this.modulosService.listarModulos()
        .subscribe(mod => {
          // this.navItems = mod;
          console.log(mod);
        });*/

    /*this.authenticationService.currentUser$.subscribe(x => this.currentUser = x);
    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = _document.body.classList.contains('sidebar-minimized');
    });
    this.element = _document.body;
    this.changes.observe(<Element>this.element, {
      attributes: true,
      attributeFilter: ['class']
    });*/
        // Recupera o json do localStorage
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    // this.changes.disconnect();
  }
}
