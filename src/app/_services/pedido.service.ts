import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {produto} from '../_models/produto';
import {Observable} from 'rxjs';
import {pedido} from '../_models/pedido';


@Injectable({providedIn: 'root'})

export class PedidoService {

  url = 'https://aw-cadoh-api-kilamba.herokuapp.com/api/v1/pedido';

  constructor(private http: HttpClient) {
  }


  // tslint:disable-next-line: no-shadowed-variable
  updatePedido(produto: produto): Observable<produto> {
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.put<produto>(this.url, produto, httpOptions);
  }

  updateStatusPedido(idProduto: number, status: boolean): Observable<produto> {
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.put<produto>(this.url + '/' + idProduto + '/changeEstadoTo/' + status, httpOptions);
  }

  updateStatusIngredienteProduto(idProduto: number, idIngrediente: number, status: boolean): Observable<produto> {
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.put<produto>(this.url + '/' + idProduto + '/ingrediente/' + idIngrediente + '/changeStatusTo' + status, httpOptions);
  }

  deletePedidoById(produtoid: string): Observable<number> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token
      })
    };
    return this.http.delete<number>(this.url + '/' + produtoid + '/changeEstado?estado=cancelado',
      httpOptions);
  }

  getPedidoById(pedidoId: string): Observable<pedido> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token
      })
    };
    return this.http.get<pedido>(this.url + '/' + pedidoId, httpOptions);
  }
}
