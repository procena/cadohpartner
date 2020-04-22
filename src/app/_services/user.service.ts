import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { usuario } from '../_models/usuario';
import { Observable } from 'rxjs';
import { permissao } from '../_models/permissao';


@Injectable({ providedIn: 'root' })
export class UserService {

  url = 'https://aw-cadoh-api-kilamba.herokuapp.com/api/v1/usuario';
  urlUsers = 'https://aw-cadoh-api-kilamba.herokuapp.com/api/v1/estabelecimento';

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<usuario[]>(this.url);
  }

  getUserByUsername(username: string): Observable<usuario> {
    return this.http.get<usuario>(`${this.url}?username=` + username);
  }
  getAllPermissoes() {
    return this.http.get<permissao[]>('assets/permissoes.json');
  }

  // tslint:disable-next-line: no-shadowed-variable
  createUser(user: usuario): Observable<usuario> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<usuario>(this.url, user, httpOptions);
  }
  // tslint:disable-next-line: no-shadowed-variable
  updateUser(user: usuario): Observable<usuario> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.put<usuario>(this.url , user, httpOptions);
  }
  updateStatus(userId: string, status: string): Observable<usuario> {
   // alert(userId); alert(status);
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.put<usuario>(this.url + '/' + userId + '/changeEstadoTo' + '/' + status, httpOptions);
  }
  deleteUserById(userid: string): Observable<number> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.delete<number>(this.url + '/' + userid,
      httpOptions);
  }
  getUserById(userId: string): Observable<usuario> {
    return this.http.get<usuario>(this.url + '/' + userId);
  }
  getCliente(clienteId: number): Observable<usuario> {
    return this.http.get<usuario>(this.url + '/cliente/' + clienteId);
  }
  getUserByEstabelecimento(estabelecimentoId: string): Observable<usuario> {
    return this.http.get<usuario>(this.urlUsers + '/' + estabelecimentoId + '/getUsers');
  }
  getUserByNome(userName: string): Observable<usuario> {
    return this.http.get<usuario>(this.url + '/' + userName);
  }
}
