import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";

import { environment } from "../../../environments/environment.development";

import { ApiResponse } from "../models/respostas/api-response";

import { ContratoRequest } from "../models/contrato/contrato-request";
import { ContratoResponse } from "../models/contrato/contrato-response";

@Injectable({
  providedIn: 'root'
})
export class ContratoService {

  private url = environment.apiDeslandes;
  private http = inject(HttpClient);

cadastrarContrato(request: ContratoRequest): Observable<ApiResponse<ContratoResponse>> {

  const token = localStorage.getItem('token');

  return this.http.post<ApiResponse<ContratoResponse>>(
    `${this.url}/api/v1/contrato/cadastrar-contrato`,
    request,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    }
  )
  .pipe(
    catchError(err => {
      return throwError(() => err);
    })
  );
}

  consultarContratosPaginado(
    pageNumber: number,
    pageSize: number,
    searchTerm?: string
  ) {
    const params: any = {
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString()
    };

    if (searchTerm) {
      params.searchTerm = searchTerm;
    }

    return this.http.get<any>(
      `${this.url}/api/v1/contrato/consultar-contato-paginacao`,
      { params }
    );
  }

  consultarContratos() {
    return this.http.get<ContratoResponse[]>(
      `${this.url}/api/v1/contrato/consultar-contratos`
    );
  }

  obterContratoPorId(id: string) {
    return this.http.get<ContratoResponse>(
      `${this.url}/api/v1/contrato/obter-contrato-por-id/${id}`
    );
  }

  editarContrato(
    id: string,
    request: any
  ): Observable<any> {

    const token = localStorage.getItem('token');

    return this.http.put<any>(
      `${this.url}/api/v1/contrato/atualizar-contrato/${id}`,
      request,
      {
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : {}
      }
    );
  }

  excluirContrato(id: string) {

    const token = localStorage.getItem('token');

    return this.http.delete<any>(
      `${this.url}/api/v1/contrato/excluir-contrato/${id}`,
      {
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : {}
      }
    );
  }
}