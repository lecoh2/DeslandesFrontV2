import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { environment } from "../../../environments/environment.development";

import { ApiResponse } from "../models/respostas/api-response";
import { BaixaFinanceiraRequest } from "../models/baixa/baixa-financeira-request";
import { BaixaFinanceiraResponse } from "../models/baixa/baixa-financeira-response";


@Injectable({
  providedIn: 'root'
})
export class BaixaFinanceiraService {

  private url = environment.apiDeslandes;

  private http = inject(HttpClient);

  cadastrarBaixaFinanceira(
    request: BaixaFinanceiraRequest
  ): Observable<ApiResponse<BaixaFinanceiraResponse>> {

    const token = localStorage.getItem('token');

    return this.http.post<ApiResponse<BaixaFinanceiraResponse>>(
      `${this.url}/api/v1/baixa-financeira/cadastrar-baixa-financeira`,
      request,
      {
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : {}
      }
    );
  }

  excluirBaixaFinanceira(
    id: string
  ): Observable<ApiResponse<BaixaFinanceiraResponse>> {

    const token = localStorage.getItem('token');

    return this.http.delete<ApiResponse<BaixaFinanceiraResponse>>(
      `${this.url}/api/v1/baixa-financeira/excluir-baixa-financeira/${id}`,
      {
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : {}
      }
    );
  }

  consultarBaixas(): Observable<BaixaFinanceiraResponse[]> {

    return this.http.get<BaixaFinanceiraResponse[]>(
      `${this.url}/api/v1/baixa-financeira/consultar-baixas-financeiras`
    );
  }

  consultarPorContaReceber(
    contaReceberId: string
  ): Observable<BaixaFinanceiraResponse[]> {

    return this.http.get<BaixaFinanceiraResponse[]>(
      `${this.url}/api/v1/baixa-financeira/consultar-baixas-conta-receber/${contaReceberId}`
    );
  }

  consultarPorContaPagar(
    contaPagarId: string
  ): Observable<BaixaFinanceiraResponse[]> {

    return this.http.get<BaixaFinanceiraResponse[]>(
      `${this.url}/api/v1/baixa-financeira/consultar-baixas-conta-pagar/${contaPagarId}`
    );
  }

  obterBaixaFinanceiraPorId(
    id: string
  ): Observable<ApiResponse<BaixaFinanceiraResponse>> {

    const token = localStorage.getItem('token');

    return this.http.get<ApiResponse<BaixaFinanceiraResponse>>(
      `${this.url}/api/v1/baixa-financeira/obter-baixa-financeira-por-id/${id}`,
      {
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : {}
      }
    );
  }
}