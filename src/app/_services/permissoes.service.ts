import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { categorias } from '../_models/categorias';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })

export class CategoriasService {

  url = 'https://aw-cadoh-api-kilamba.herokuapp.com/api/v1/categoriaProduto';

  constructor(private http: HttpClient) {
  }

  listarCategorias() {
    return this.http.get<categorias[]>(this.url);
  }

  // tslint:disable-next-line: no-shadowed-variable
  createCategoria(categorias: categorias): Observable<categorias> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<categorias>(this.url, categorias, httpOptions);
  }
  // tslint:disable-next-line: no-shadowed-variable
  updateCategorias(categorias: categorias): Observable<categorias> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.put<categorias>(this.url , categorias, httpOptions);
  }
  deleteCategoriasById(categoriasid: string): Observable<number> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.delete<number>(this.url + '/DeletecategoriasDetails?id=' + categoriasid,
      httpOptions);
  }
  getCategoriaById(categoriaId: string): Observable<categorias> {
    return this.http.get<categorias>(this.url + '/' + categoriaId);
  }
}
