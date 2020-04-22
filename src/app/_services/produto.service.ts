import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { produto } from '../_models/produto';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })

export class ProdutoService {

  url = 'https://aw-cadoh-api-kilamba.herokuapp.com/api/v1/produto';

  constructor(private http: HttpClient) {
  }

  listarproduto() {
    return this.http.get<produto[]>(this.url);
  }

  // tslint:disable-next-line: no-shadowed-variable
  insertIngredienteProduto(idProduto: number, idIngrediente: number): Observable<produto> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<produto>(this.url + '/' + idProduto + '/addIngrediente/' + idIngrediente, httpOptions);
  }
  // tslint:disable-next-line: no-shadowed-variable
  createProduto(produto: produto): Observable<produto> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<produto>(this.url, produto, httpOptions);
  }
  // tslint:disable-next-line: no-shadowed-variable
  updateProduto(produto: produto): Observable<produto> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.put<produto>(this.url, produto, httpOptions);
  }
  updateStatusProduto(idProduto: number, status: boolean): Observable<produto> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.put<produto>(this.url + '/' + idProduto + '/changeEstadoTo/' + status, httpOptions);
  }
  updateStatusIngredienteProduto(idProduto: number, idIngrediente: number, status: boolean): Observable<produto> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.put<produto>(this.url + '/' + idProduto + '/ingrediente/' + idIngrediente + '/changeStatusTo/' + status, httpOptions);
  }
  deleteProdutoById(produtoid: string): Observable<number> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.delete<number>(this.url + '/DeleteprodutoDetails?id=' + produtoid,
      httpOptions);
  }
  getProdutoById(categoriaId: string): Observable<produto> {
    return this.http.get<produto>(this.url + '/' + categoriaId);
  }
}
