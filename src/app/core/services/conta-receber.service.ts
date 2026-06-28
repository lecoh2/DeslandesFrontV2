import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { environment } from "../../../environments/environment.development";

import { ApiResponse } from "../models/respostas/api-response";
import { ContaReceberRequest } from "../models/contas/conta-receber-request";
import { ContaReceberResponse } from "../models/contas/conta-receber.response";
import { ContaReceberBaixaRequest } from "../models/contas/conta-receber-baixa-request";


@Injectable({
  providedIn: 'root'
})
export class ContaReceberService {

  private url = environment.apiDeslandes;
  private http = inject(HttpClient);

  cadastrarContaReceber(
    request: ContaReceberRequest
  ): Observable<ApiResponse<ContaReceberResponse>> {

    const token = localStorage.getItem('token');

    return this.http.post<ApiResponse<ContaReceberResponse>>(
      `${this.url}/api/v1/conta-receber/cadastrar-conta-receber`,
      request,
      {
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : {}
      }
    );
  }

  editarContaReceber(
    id: string,
    request: any
  ): Observable<ApiResponse<ContaReceberResponse>> {

    const token = localStorage.getItem('token');

    return this.http.put<ApiResponse<ContaReceberResponse>>(
      `${this.url}/api/v1/conta-receber/atualizar-conta-receber/${id}`,
      request,
      {
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : {}
      }
    );
  }

  excluirContaReceber(
    id: string
  ): Observable<ApiResponse<ContaReceberResponse>> {

    const token = localStorage.getItem('token');

    return this.http.delete<ApiResponse<ContaReceberResponse>>(
      `${this.url}/api/v1/conta-receber/excluir-conta-receber/${id}`,
      {
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : {}
      }
    );
  }

  consultarContasReceber(): Observable<ContaReceberResponse[]> {

    return this.http.get<ContaReceberResponse[]>(
      `${this.url}/api/v1/conta-receber/consultar-contas-receber`
    );
  }

consultarContasReceberPaginado(pageNumber: number, pageSize: number, searchTerm?: string){
 const params: any = { pageNumber: pageNumber.toString(), pageSize: pageSize.toString() };
  if (searchTerm) params.searchTerm = searchTerm;

  return this.http.get<any>(
    `${this.url}/api/v1/conta-receber/consultar-conta-receber-paginacao`,
    { params }
  );

  }
  
 baixarContaReceber(
  id: string,
  request: ContaReceberBaixaRequest
): Observable<any> {

  const token = localStorage.getItem('token');

  const url =
    `${this.url}/api/v1/conta-receber/baixar-conta-receber/${id}`;

  console.log('====================================');
  console.log('BAIXAR CONTA RECEBER');
  console.log('ID:', id);
  console.log('URL:', url);
  console.log('REQUEST:', request);
  console.log('====================================');

  return this.http.post(
    url,
    request,
    {
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : {}
    }
  );
}
  consultarContasReceberAgrupado() {
  return this.http.get<any[]>(
    `${this.url}/api/v1/conta-receber/conta-receber-agrupado`
  );
}
obterContaReceberPorId(
  id: string
): Observable<ContaReceberResponse> {

  const token = localStorage.getItem('token');

  return this.http.get<ContaReceberResponse>(
    `${this.url}/api/v1/conta-receber/obter-conta-receber-por-id/${id}`,
    {
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : {}
    }
  );
}


}