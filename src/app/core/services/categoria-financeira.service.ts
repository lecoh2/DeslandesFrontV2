import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { environment } from "../../../environments/environment.development";

import { ApiResponse } from "../models/respostas/api-response";


import { CategoriaFinanceiraResponse } from "../models/categoria-financeira/categoria-financeira-response";
import { CategoriaFinanceiraRequest } from "../models/categoria-financeira/categoria-financeira-request";
import { ObterCategoriaFinanceiraResponse } from "../models/categoria-financeira/obter-categoria-financeira-response";

@Injectable({
  providedIn: 'root'
})
export class CategoriaFinanceiraService {

  private url = environment.apiDeslandes;
  private http = inject(HttpClient);

  cadastrarCategoriaFinanceira(
    request: CategoriaFinanceiraRequest
  ): Observable<ApiResponse<CategoriaFinanceiraResponse>> {

    const token = localStorage.getItem('token');

    return this.http.post<ApiResponse<CategoriaFinanceiraResponse>>(
      `${this.url}/api/v1/categoria-financeira/cadastrar-categoria-financeira`,
      request,
      {
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : {}
      }
    );

  }

  editarCategoriaFinanceira(
    id: string,
    request: any
  ): Observable<any> {

    const token = localStorage.getItem('token');

    return this.http.put<any>(
      `${this.url}/api/v1/categoria-financeira/atualizar-categoria-financeira/${id}`,
      request,
      {
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : {}
      }
    );

  }

  excluirCategoriaFinanceira(
    id: string
  ): Observable<any> {

    const token = localStorage.getItem('token');

    return this.http.delete<any>(
      `${this.url}/api/v1/categoria-financeira/remover-categoria-financeira/${id}`,
      {
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : {}
      }
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

  obterCategoriaFinanceiraPorId(
    id: string
  ): Observable<ObterCategoriaFinanceiraResponse> {

    return this.http.get<ObterCategoriaFinanceiraResponse>(
      `${this.url}/api/v1/categoria-financeira/obter-categoria-financeira-por-id/${id}`
    );

  }
consultarCategoriaFinanceira(): Observable<CategoriaFinanceiraResponse[]> {

  return this.http.get<CategoriaFinanceiraResponse[]>(
    `${this.url}/api/v1/categoria-financeira/consultar-categoria-financeira`
  );

}
}