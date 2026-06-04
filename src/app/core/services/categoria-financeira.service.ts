import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment.development';
import { CategoriaFinanceiraResponse } from '../models/categoria-financeira/categoria-financeira-response';

@Injectable({
  providedIn: 'root'
})
export class CategoriaFinanceiraService {

  private url = environment.apiDeslandes;
  private http = inject(HttpClient);

  consultarCategoriaFinanceira(): Observable<CategoriaFinanceiraResponse[]> {

    return this.http.get<CategoriaFinanceiraResponse[]>(
      `${this.url}/api/v1/categoria-financeira/consultar-categoria-financeira`
    );

  }

  consultarCategoriaFinanceiraPaginado(
    pageNumber: number,
    pageSize: number
  ) {

    const params: any = {
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString()
    };

    return this.http.get<any>(
      `${this.url}/api/v1/categoria-financeira/consultar-categoria-financeira-paginacao`,
      { params }
    );

  }

}