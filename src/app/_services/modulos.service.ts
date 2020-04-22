import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { modulo } from '../_models/modulo';


@Injectable({providedIn: 'root'})

export class ModulosService {

  constructor(private http: HttpClient) {
  }

  listarModulos() {
    return this.http.get<modulo[]>(`https://aw-cadoh-api-kilamba.herokuapp.com/api/v1/modulo`);
  }
}
