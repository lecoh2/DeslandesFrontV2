import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { environment } from "../../../environments/environment.development";

import { ApiResponse } from "../models/respostas/api-response";
import { ContaPagarRequest } from "../models/contas/conta-pagar-request";
import { ContaPagarResponse } from "../models/contas/conta-pagar.response";


@Injectable({
  providedIn: 'root'
})
export class ContaPagarService {

  private url = environment.apiDeslandes;
  private http = inject(HttpClient);

  cadastrarContaPagar(
    request: ContaPagarRequest
  ): Observable<ApiResponse<ContaPagarResponse>> {

    const token = localStorage.getItem('token');

    return this.http.post<ApiResponse<ContaPagarResponse>>(
      `${this.url}/api/v1/conta-pagar/cadastrar-conta-pagar`,
      request,
      {
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : {}
      }
    );
  }

  editarContaPagar(
    id: string,
    request: any
  ): Observable<ApiResponse<ContaPagarResponse>> {

    const token = localStorage.getItem('token');

    return this.http.put<ApiResponse<ContaPagarResponse>>(
      `${this.url}/api/v1/conta-pagar/atualizar-conta-pagar/${id}`,
      request,
      {
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : {}
      }
    );
  }

  excluirContaPagar(
    id: string
  ): Observable<ApiResponse<ContaPagarResponse>> {

    const token = localStorage.getItem('token');

    return this.http.delete<ApiResponse<ContaPagarResponse>>(
      `${this.url}/api/v1/conta-pagar/excluir-conta-pagar/${id}`,
      {
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : {}
      }
    );
  }

  consultarContasPagar(): Observable<ContaPagarResponse[]> {

    return this.http.get<ContaPagarResponse[]>(
      `${this.url}/api/v1/conta-pagar/consultar-contas-pagar`
    );
  }

  consultarContasPagarPaginado(pageNumber: number, pageSize: number, searchTerm?: string) {
     const params: any = { pageNumber: pageNumber.toString(), pageSize: pageSize.toString() };

     if (searchTerm) params.searchTerm = searchTerm;
        return this.http.get<any>(`${this.url}/api/v1/conta-pagar/consultar-conta-pagar-paginacao`,
      { params }
    );
  }

  baixarContaPagar(
    id: string,
    request: any
  ) {

    const token = localStorage.getItem('token');

    return this.http.post(
      `${this.url}/api/v1/conta-pagar/baixar-conta-pagar/${id}`,
      request,
      {
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : {}
      }
    );
  }

  obterContaPagarPorId(id: string) {

    const token = localStorage.getItem('token');

    return this.http.get<ContaPagarResponse>(
      `${this.url}/api/v1/conta-pagar/obter-conta-pagar-por-id/${id}`,
      {
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : {}
      }
    );
  }
}