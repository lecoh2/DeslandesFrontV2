import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { environment } from "../../../environments/environment.development";
import { ConfiguracaoFinanceiraRequest } from "../models/configuracao-financeira/configuracao-financeira-request";
import { ConfiguracaoFinanceiraResponse } from "../models/configuracao-financeira/configuracao-financeira-response";

@Injectable({
  providedIn: 'root'
})
export class ConfiguracaoFinanceiraService {

  private url = environment.apiDeslandes;
  private http = inject(HttpClient);

  // GET configuração atual
  obterConfiguracao(): Observable<ConfiguracaoFinanceiraResponse> {
    return this.http.get<ConfiguracaoFinanceiraResponse>(
      `${this.url}/api/v1/configuracao-financeira/obter`
    );
  }

  // POST salvar configuração
  salvarConfiguracao(
    request: ConfiguracaoFinanceiraRequest
  ): Observable<ConfiguracaoFinanceiraResponse> {

    const token = localStorage.getItem('token');

    return this.http.post<ConfiguracaoFinanceiraResponse>(
      `${this.url}/api/v1/configuracao-financeira/salvar`,
      request,
      {
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : {}
      }
    );
  }

  // (opcional) resetar para automática
  usarAutomatica(): Observable<void> {
    return this.http.post<void>(
      `${this.url}/api/v1/configuracao-financeira/usar-automatica`,
      {}
    );
  }
}