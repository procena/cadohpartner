import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import { usuario } from '../_models/usuario';


@Injectable({
  providedIn: 'root',
})
export class PermissionRoles {
  public CurrentUSerData: usuario;
  private baseUrl = 'https://aw-cadoh-api-kilamba.herokuapp.com/api/v1/usuario/searchByLogin';
  public ctrlNivelAcesso: boolean = false;

  constructor(private  http: HttpClient, private router: Router) {
    this.CurrentUSerData = JSON.parse(localStorage.getItem('currentUser'));
    this.loadCtrlNivelAcesso().subscribe((submoduloIndiceAcesso: any) => {
      this.ctrlNivelAcesso = this.CurrentUSerData.authority < submoduloIndiceAcesso;
    });
  }

  public teste(): boolean {
    return this.ctrlNivelAcesso;
  }

  public verificarNivelAcesso(callback) {
    this.loadCtrlNivelAcesso().subscribe((submoduloIndiceAcesso: any) => {
      callback(submoduloIndiceAcesso);
    });
  }

  private loadCtrlNivelAcesso() {
    return this.http.get(`${this.baseUrl}/obterNivelAcesso?routeLink=${this.router.url}`);
  }
}
