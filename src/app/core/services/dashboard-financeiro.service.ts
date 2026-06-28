import { inject, Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

import { environment } from "../../../environments/environment.development";
import { DashboardFinanceiroResponse } from "../models/dashborad-financeiro/dashboard-financeiro-response";

@Injectable({
  providedIn: 'root'
})
export class DashboardFinanceiroService {

  private url = environment.apiDeslandes;
  private http = inject(HttpClient);

getDashboardFinanceiro(
  ano?: number,
  mes?: number
): Observable<DashboardFinanceiroResponse> {

  const anoFinal = ano ?? new Date().getFullYear();
  const mesFinal = mes ?? (new Date().getMonth() + 1);

  const params = new HttpParams()
    .set('ano', anoFinal.toString())
    .set('mes', mesFinal.toString());

  return this.http.get<DashboardFinanceiroResponse>(
    `${this.url}/api/v1/dashboard-financeiro/obter-dashboard`,
    { params }
  );
}
}