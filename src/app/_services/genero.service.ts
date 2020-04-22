import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })

export class GeneroService {

  url = 'assets/genero.json';

  constructor(private http: HttpClient) {
  }

  listarGenero() {
    return this.http.get<any[]>(this.url);
  }
}
