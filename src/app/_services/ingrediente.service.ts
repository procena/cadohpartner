import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ingrediente } from '../_models/ingrediente';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })

export class IngredienteService {

  url = 'https://aw-cadoh-api-kilamba.herokuapp.com/api/v1/ingrediente';


  constructor(private http: HttpClient) {
  }

  listarIngredientes(id) {
    return this.http.get<ingrediente[]>(this.url + '/estabelecimentoId/' + id);
  }

  // tslint:disable-next-line: no-shadowed-variable
  createIngrediente(ingrediente: ingrediente): Observable<ingrediente> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<ingrediente>(this.url, ingrediente, httpOptions);
  }
  // tslint:disable-next-line: no-shadowed-variable
  updateIngrediente(ingrediente: ingrediente): Observable<ingrediente> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.put<ingrediente>(this.url , ingrediente, httpOptions);
  }
  deleteIngredienteById(ingredienteid: string): Observable<number> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.delete<number>(this.url + '/DeleteingredienteDetails?id=' + ingredienteid,
      httpOptions);
  }
  getIngredienteById(ingredienteId: string): Observable<ingrediente> {
    return this.http.get<ingrediente>(this.url + '/' + ingredienteId);
  }
}
