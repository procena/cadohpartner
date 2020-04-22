import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { estabelecimento } from '../_models/estabelecimento';


@Injectable({ providedIn: 'root' })

export class EstabelecimentoService {

  url = 'https://aw-cadoh-api-kilamba.herokuapp.com/api/v1/estabelecimento';
  token: '';
  constructor(private http: HttpClient) {
  }

  listarEstabelecimento() {
    return this.http.get<estabelecimento[]>(this.url);
  }

  // tslint:disable-next-line: no-shadowed-variable
  updateEstabelecimento(estabelecimento: estabelecimento): Observable<estabelecimento> {
    // alert('Vamos Actualizar seu estabelecimento');
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.put<estabelecimento>(this.url, estabelecimento, httpOptions);
  }

  getEstabelecimentoById(estabelecimentoId: number): Observable<estabelecimento> {
    return this.http.get<estabelecimento>(this.url + '/' + estabelecimentoId);
  }

  getTodosPedidos(estabelecimentoId: number, token: string): Observable<estabelecimento> {
    let params = new HttpParams().set('Authorization', 'Bearer' + token);

    console.log(token);
    // tslint:disable-next-line: max-line-length
    return this.http.get<estabelecimento>(this.url + '/' + estabelecimentoId + '/getTodosPedidos',
      {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });
  }
  getPedidoEmPreparo(estabelecimentoId: number , token: string): Observable<estabelecimento> {
    console.log(token);
    // tslint:disable-next-line: max-line-length
    return this.http.get<estabelecimento>(this.url + '/' + estabelecimentoId + '/getPedidoEmPreparo',
      {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });

  }
  getPedidoPronto(estabelecimentoId: number , token: string): Observable<estabelecimento> {
    console.log(token);
    // tslint:disable-next-line: max-line-length
    return this.http.get<estabelecimento>(this.url + '/' + estabelecimentoId + '/getPedidoPronto',
      {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });

  }

  protected deductHeader() {
    return { headers: this.hasToken() ? this.securityHeaders() : this.headers() };
  }

  protected headers(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  protected securityHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.getToken()
    });
  }

  protected getCurrentUser() {
    const ret = localStorage.getItem('currentUser');
    if (ret) {
      return JSON.parse(ret);
    }

    return null;
  }

  protected getToken(): string {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      return currentUser.token;
    }

    return null;
  }

  hasToken(): boolean {
    const jwt = this.getToken();

    return jwt != null && jwt !== '';
  }
}
