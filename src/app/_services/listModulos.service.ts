import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})

export class ListModulosService {
  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<any>(`https://aw-cadoh-api-kilamba.herokuapp.com/api/v1/modulo`);
  }
}
