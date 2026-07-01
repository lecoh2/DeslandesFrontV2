import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.development";
import { Observable } from "rxjs";
import { WebJurPublicacaoDetalhe } from "../models/webjur/webjur-publicacao-detalhe";

@Injectable({
  providedIn: 'root'
})
export class WebJurService {

  private url = environment.apiDeslandes;
  private http = inject(HttpClient);

  consultarPublicacoesPaginado(pageNumber: number, pageSize: number, searchTerm?: string) {
    const params: any = {
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString()
    };

    if (searchTerm) {
      params.searchTerm = searchTerm;
    }

    return this.http.get<any>(
      `${this.url}/api/v1/webjur/publicacoes/paginacao`,
      { params }
    );
  }

  importarPublicacoes() {
    const token = localStorage.getItem('token');

    return this.http.post(
      `${this.url}/api/v1/webjur/publicacoes/importar`,
      {},
      {
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : {}
      }
    );
  }

  sincronizarTudo() {
    const token = localStorage.getItem('token');

    return this.http.post(
      `${this.url}/api/v1/webjur/sincronizar`,
      {},
      {
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : {}
      }
    );
  }

  verificarProcesso(numeroProcesso: string) {
    return this.http.get<any>(
      `${this.url}/api/v1/webjur/verificar/${numeroProcesso}`
    );
  }

  consultarAndamentos(processoId: string) {
    return this.http.get<any>(
      `${this.url}/api/v1/webjur/andamentos/${processoId}`
    );
  }
  obterDetalhe(id: string){
  return this.http.get<WebJurPublicacaoDetalhe>(
    `${this.url}/api/v1/webjur/publicacoes/${id}`
  );
}

registrarVisualizacao(id:string){
  return this.http.post(
    `${this.url}/api/v1/webjur/publicacoes/${id}/visualizar`,
    {}
  );
}

sincronizarPublicacao(id:string){
  return this.http.post(
    `${this.url}/api/v1/webjur/publicacoes/${id}/sincronizar`,
    {}
  );
}
adicionarComentario(id: string, comentario: string) {
  return this.http.post(
    `${this.url}/api/v1/webjur/publicacoes/${id}/comentarios`,
    { comentario }
  );
}

baixarPdf(id:string){

  return this.http.get(
      `${this.url}/api/v1/webjur/publicacoes/${id}/pdf`,
      {
        responseType:'blob'
      });

}
getComentarios(id: string) {
  return this.http.get<any>(
    `${this.url}/api/v1/webjur/publicacoes/${id}/comentarios`
  );
}

getVisualizacoes(id: string, pageNumber: number, pageSize: number) {
  return this.http.get<any>(
    `${this.url}/api/v1/webjur/publicacoes/${id}/visualizacoes`,
    {
      params: {
        pageNumber,
        pageSize
      }
    }
  );
}
}