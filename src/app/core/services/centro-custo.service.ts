import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { environment } from "../../../environments/environment.development";

import { ApiResponse } from "../models/respostas/api-response";
import { CentroCustoRequest } from "../models/centro-custo/centro-custo-requeste";
import { CentroCustoResponse } from "../models/centro-custo/centro-custo-response";



@Injectable({
    providedIn: 'root'
})
export class CentroCustoService {

    private url = environment.apiDeslandes;
    private http = inject(HttpClient);

    cadastrarCentroCusto(
        request: CentroCustoRequest
    ): Observable<ApiResponse<CentroCustoResponse>> {


        const token = localStorage.getItem('token');

        return this.http.post<ApiResponse<CentroCustoResponse>>(
            `${this.url}/api/v1/centro-custo/cadastrar-centro-custo`,
            request,
            {
                headers: token
                    ? { Authorization: `Bearer ${token}` }
                    : {}
            }
        );


    }
    obterCentroCustoPorId(id: string) {
        return this.http.get<any>(
            `${this.url}/api/v1/centro-custo/obter-centro-custo-por-id/${id}`
        );
    }

    atualizarCentroCusto(
        id: string,
        request: CentroCustoRequest
    ): Observable<ApiResponse<CentroCustoResponse>> {


        const token = localStorage.getItem('token');

        return this.http.put<ApiResponse<CentroCustoResponse>>(
            `${this.url}/api/v1/centro-custo/atualizar-centro-custo/${id}`,
            request,
            {
                headers: token
                    ? { Authorization: `Bearer ${token}` }
                    : {}
            }
        );

    }
    editarCentroCusto(id: string, request: any): Observable<any> {
        const token = localStorage.getItem('token');

        return this.http.put<any>(
            `${this.url}/api/v1/centro-custo/atualizar-centro-custo/${id}`,
            request,
            {
                headers: token
                    ? { Authorization: `Bearer ${token}` }
                    : {}
            }
        );
    }

    excluirCentroCusto(
        id: string
    ): Observable<ApiResponse<CentroCustoResponse>> {


        const token = localStorage.getItem('token');

        return this.http.delete<ApiResponse<CentroCustoResponse>>(
            `${this.url}/api/v1/centro-custo/remover-centro-custo/${id}`,
            {
                headers: token
                    ? { Authorization: `Bearer ${token}` }
                    : {}
            }
        );


    }

    consultarCentroCusto(): Observable<CentroCustoResponse[]> {

        return this.http.get<CentroCustoResponse[]>(
            `${this.url}/api/v1/centro-custo/consultar-centro-custo`
        );


    }

    consultarCentroCustoPaginado(
        pageNumber: number,
        pageSize: number
    ) {


        const params: any = {
            pageNumber: pageNumber.toString(),
            pageSize: pageSize.toString()
        };

        return this.http.get<any>(
            `${this.url}/api/v1/centro-custo/consultar-centro-custo-paginacao`,
            { params }
        );

    }
}
